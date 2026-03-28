"""Quick manual smoke test; run from project root: python scripts/smoke_test.py"""

from __future__ import annotations

import sys
from pathlib import Path

_root = Path(__file__).resolve().parent.parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

print("starting imports...", flush=True)
from fastapi.testclient import TestClient

print("loading app (embeddings may download on first RAG use)...", flush=True)
from app.main import app

def main():
    print("client open...", flush=True)
    with TestClient(app) as c:
        r = c.post("/compile", json={"user_id": "u1", "code": "if True:\n    x=1\n"})
        print("ok code:", r.status_code, r.json().get("success"))
        r2 = c.post("/compile", json={"user_id": "u1", "code": "if True\n    x=1\n"})
        j = r2.json()
        print("bad code:", j.get("success"), j.get("error_type"), "explanation_len", len(j.get("explanation", "")))
        r3 = c.get("/user/u1/stats")
        print("stats:", r3.status_code, r3.json().get("total_errors_recorded"))


if __name__ == "__main__":
    main()
