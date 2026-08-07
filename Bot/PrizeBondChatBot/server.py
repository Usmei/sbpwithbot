"""
HTTP API wrapper around the client's RAG assistant so the ICFS website can
call it. Reuses rag.py (and its FAISS index) unchanged; only exposes it over
HTTP instead of Streamlit.

Run:  ./.venv/Scripts/python.exe server.py
API:  POST /api/chat   {"message": "..."}  -> {"answer": "...", "sources": [...]}
      GET  /api/health -> {"status": "ok"}
"""

import os

# rag.py reads VECTOR_DB as a RELATIVE path ("faiss_index"), so make sure the
# working directory is this file's folder no matter where we're launched from.
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS

# Importing rag loads the embedding model + FAISS index once at startup.
from rag import ask_prize_bond_assistant

app = Flask(__name__)
CORS(app)  # dev: allow the Vite origin to call us directly


@app.get("/")
def index():
    # Friendly landing page so the host URL doesn't show a 404.
    return (
        "<h2>ICFS Prize Bond Assistant API</h2>"
        "<p>Status: running. This is the chatbot backend for the ICFS website.</p>"
        "<p>Endpoints: <code>GET /api/health</code>, <code>POST /api/chat</code></p>",
        200,
        {"Content-Type": "text/html"},
    )


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/chat")
def chat():
    data = request.get_json(force=True, silent=True) or {}
    question = (data.get("message") or data.get("question") or "").strip()
    if not question:
        return jsonify({"error": "empty_question"}), 400
    try:
        result = ask_prize_bond_assistant(question)
        return jsonify({
            "answer": result.get("answer", ""),
            "sources": result.get("sources", []),
        })
    except Exception as exc:  # surface a clean error to the UI
        return jsonify({"error": "assistant_failed", "detail": str(exc)}), 500


if __name__ == "__main__":
    print("Loading Prize Bond assistant… (first run downloads the embedding model)")
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    app.run(host=host, port=port, debug=False)
