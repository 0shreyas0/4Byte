import sqlite3
import argparse
from pathlib import Path
import chromadb
from collections import Counter

# Path Configuration
ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "errors.db"
CHROMA_PATH = ROOT / "data" / "memory_chroma"

def get_all_stats():
    print(f"\n{'='*70}")
    print(f" 👩‍🏫 GLOBAL MENTOR DASHBOARD: All Students Overview")
    print(f"{'='*70}\n")

    # 1. Fetch all users from SQLite
    users = set()
    global_errors = []
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT user_id FROM error_history")
        rows = cursor.fetchall()
        users.update([row[0] for row in rows])
        
        cursor.execute("SELECT error_type FROM error_history")
        global_errors = [row[0] for row in cursor.fetchall()]
        conn.close()
    except Exception as e:
        print(f"Error reading SQLite: {e}")

    # 2. Fetch all users from ChromaDB
    chroma_users = set()
    global_memories = 0
    try:
        client = chromadb.PersistentClient(path=str(CHROMA_PATH))
        collection = client.get_collection(name="user_memories")
        results = collection.get(include=["metadatas"])
        metas = results.get("metadatas", [])
        global_memories = len(metas)
        for m in metas:
            if "user_id" in m:
                users.add(m["user_id"])
                chroma_users.add(m["user_id"])
    except Exception as e:
        # Collection might not exist yet
        pass

    if not users:
        print("📭 No user data found across any database.")
        return

    # 3. Print Summary Table
    print(f"{'USER ID':<15} | {'ERRORS':<8} | {'MEMORIES':<10} | {'STATUS'}")
    print(f"{'-'*65}")

    for user in sorted(list(users)):
        # Count errors for this user
        err_count = 0
        try:
            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM error_history WHERE user_id = ?", (user,))
            err_count = cur.fetchone()[0]
            conn.close()
        except: pass

        # Count memories for this user
        mem_count = 0
        try:
            client = chromadb.PersistentClient(path=str(CHROMA_PATH))
            coll = client.get_collection(name="user_memories")
            res = coll.get(where={"user_id": {"$eq": user}}, include=[])
            mem_count = len(res.get("ids", []))
        except: pass

        status = "Active" if err_count > 0 or mem_count > 0 else "Idle"
        print(f"{user:<15} | {err_count:<8} | {mem_count:<10} | {status}")

    # 4. Global Heatmap
    if global_errors:
        print(f"\n{'='*70}")
        print(f" 🔥 GLOBAL ERROR HEATMAP (Top struggle areas)")
        print(f"{'='*70}")
        counts = Counter(global_errors).most_common(5)
        for err, count in counts:
            print(f"- {err:<20}: {count} occurrences")

    print(f"\n{'='*70}\n")

if __name__ == "__main__":
    get_all_stats()
