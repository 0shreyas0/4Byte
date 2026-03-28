# Personalized Compiler Error Explainer (RAG + FastAPI)

A small production-style API that checks **Python** source with `compile()` (no execution), stores error history in **SQLite**, maps mistakes to learning **topics**, retrieves beginner explainers from **ChromaDB** with **sentence-transformers** (`all-MiniLM-L6-v2`), and returns a **personalized**, tutor-style explanation in simple English.

The layout is **modular** so you can add C, C++, or Java later by registering new compiler drivers in `app/compiler.py`.

## Features

- **POST /compile** — body: `code`, `user_id`, optional `language` (default `python`)
- **GET /** — health / service info
- **GET /user/{user_id}/stats** — weak topics, common errors, counts
- **RAG** — seeded knowledge for syntax, indentation, names, types, indexing; duplicate seed IDs are skipped
- **Weak-topic profile** — inferred from repeated `mapped_topic` values in SQLite

## Setup

Python 3.10+ recommended.

```bash
cd /path/to/project
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

The first server start will download the embedding model (one-time download, may take several
minutes on a slow connection) and create:

- `data/errors.db` — SQLite history
- `data/chroma/` — Chroma persistence

## Run the API

From the project directory (the folder that contains the `app` package):

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open `http://127.0.0.1:8000/docs` for interactive Swagger UI.

Optional smoke test (loads the embedding model on first run, which may take a minute):

```bash
python scripts/smoke_test.py
```

## Example requests

**Compile with personalization**

```bash
curl -X POST "http://127.0.0.1:8000/compile" ^
  -H "Content-Type: application/json" ^
  -d "{\"user_id\": \"learner-1\", \"code\": \"if True\\n    print('hi')\\n\"}"
```

(PowerShell: use `curl.exe` or `Invoke-RestMethod` with a JSON body.)

**User stats**

```bash
curl "http://127.0.0.1:8000/user/learner-1/stats"
```

## Response shape (POST /compile)

- `success`
- `line_number`
- `error_type`
- `raw_error`
- `faulty_line`
- `explanation`
- `suggestions`
- `weak_topics`
- `common_errors`

When `success` is `true`, error fields are `null` and an encouraging message is returned.

## Design notes

- **Safety**: Only `compile()` is used for Python; arbitrary user code is not executed by this service.
- **Explainer**: Rule-based narrative in `app/explainer.py` — swap in an LLM later using the same inputs (error, RAG snippets, profile).
- **New languages**: Implement `CompilerDriver` and add to `LANGUAGES` in `app/compiler.py`.

## License

Use and modify freely for learning and products; add your own license file if you ship this.
