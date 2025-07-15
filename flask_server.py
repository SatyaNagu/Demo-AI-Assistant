from flask import Flask, jsonify, request
from search_history import load_history
import json
import os
import sys

app = Flask(__name__)
  # At the top of flask_server.py
from flask_cors import CORS
CORS(app)

# Ensure assistant_state.json status is 'idle' on Flask startup
STATE_FILE = "assistant_state.json"
def ensure_idle_status():
    state = {}
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            try:
                state = json.load(f)
            except Exception:
                state = {}
    if state.get("status") != "idle":
        state["status"] = "idle"
        if "last_response" not in state:
            state["last_response"] = ""
        if "youtube_links" not in state:
            state["youtube_links"] = []
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=4)

# Temporary memory (shared by assistant logic)
def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"last_response": "", "youtube_links": []}

@app.route('/search-stats')
def search_stats():
    history = load_history()
    total = sum(history.values())
    if total == 0:
        return jsonify([])

    # Convert to percentage
    stats = [
        {"category": cat, "percent": round((count / total) * 100, 1)}
        for cat, count in sorted(history.items(), key=lambda x: x[1], reverse=True)
    ][:5]  # Top 5
    return jsonify(stats)

@app.route('/last-response')
def last_response():
    state = load_state()
    return jsonify({"response": state.get("last_response", "")})

@app.route('/youtube-suggestions')
def youtube_suggestions():
    state = load_state()
    return jsonify({"videos": state.get("youtube_links", [])})

@app.route('/status')
def status():
    state = load_state()
    return jsonify({"status": state.get("status", "idle")})

if __name__ == '__main__':
    ensure_idle_status()
    app.run(debug=True)
