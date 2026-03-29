import sqlite3
import argparse
from pathlib import Path
import chromadb
from datetime import datetime

# Path Configuration
ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "errors.db"
CHROMA_PATH = ROOT / "data" / "memory_chroma"

def inspect_user(user_id: str):
    print(f"\n{'='*60}")
    print(f" 🧠 BRAIN INSPECTOR: User Profile for [{user_id}]")
    print(f"{'='*60}")

    # 1. Fetch from SQLite Error History
    print(f"\n[1] LATEST CODING ERRORS (SQLite History)")
    print(f"{'-'*45}")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT created_at, error_type, mapped_topic, faulty_line 
            FROM error_history 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 5
        """, (user_id,))
        rows = cursor.fetchall()
        
        if not rows:
            print("No error history found for this user.")
        for row in rows:
            time_str = row[0][:19] if row[0] else "Unknown"
            print(f"[{time_str}] {row[1]} in {row[2]}")
            if row[3]:
                print(f"   Line: {row[3].strip()[:60]}")
        conn.close()
    except Exception as e:
        print(f"Error reading SQLite: {e}")

    # 2. Fetch from ChromaDB Memories
    print(f"\n[2] AI CONTEXT MEMORIES (Vector DB)")
    print(f"{'-'*45}")
    try:
        client = chromadb.PersistentClient(path=str(CHROMA_PATH))
        # Ensure collection exists
        collection = client.get_collection(name="user_memories")
        
        results = collection.get(
            where={"user_id": {"$eq": user_id}},
            include=["documents", "metadatas"]
        )
        
        docs = results.get("documents", [])
        metas = results.get("metadatas", [])
        
        if not docs:
            print("No distilled memories found for this user yet.")
        for i, (doc, meta) in enumerate(zip(docs, metas)):
            m_type = meta.get("type", "unknown").upper()
            topic = meta.get("topic", "general")
            print(f"{i+1}. [{m_type}] ({topic}): {doc}")
            
    except Exception as e:
        print(f"Error reading ChromaDB: {e}")

    print(f"\n{'='*60}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Inspect user performance and memories.")
    parser.add_argument("--user", type=str, required=True, help="User ID to inspect")
    args = parser.parse_args()
    inspect_user(args.user)
