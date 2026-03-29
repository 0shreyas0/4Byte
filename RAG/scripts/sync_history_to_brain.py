import sqlite3
import argparse
from pathlib import Path
import sys

# Ensure we can import from app
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.memory_store import store_memory

DB_PATH = ROOT / "data" / "errors.db"

def sync_history(user_id: str):
    print(f"🔄 Syncing SQLite history to AI Context Brain for user: {user_id}...")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Fetch all historical errors for this user
        cursor.execute("""
            SELECT language, mapped_topic, error_type, error_message 
            FROM error_history 
            WHERE user_id = ?
        """, (user_id,))
        
        rows = cursor.fetchall()
        if not rows:
            print("No historical data found in SQLite to sync.")
            return

        synced_count = 0
        for lang, topic, err_type, err_msg in rows:
            # Topic might be None in old records, fallback to general
            topic = topic or "general"
            err_type = err_type or "UnknownError"
            
            # Format as a distilled memory
            content = f"User triggered a {err_type} in {topic}: '{err_msg}'"
            
            # Store in VectorDB (store_memory handles deduplication automatically)
            inserted, _ = store_memory(
                user_id=user_id,
                domain=lang,
                topic=topic,
                mem_type="weakness",
                content=content
            )
            if inserted:
                synced_count += 1
        
        print(f"✅ Sync complete! Added {synced_count} new unique insights to the VectorDB.")
        conn.close()
        
    except Exception as e:
        print(f"❌ Sync failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync SQLite history to ChromaDB.")
    parser.add_argument("--user", type=str, required=True, help="User ID to sync")
    args = parser.parse_args()
    sync_history(args.user)
