from flask import Flask, jsonify
from search_history import load_history
import json
import os

app = Flask(__name__)

# Temporary memory (shared by assistant logic)
STATE_FILE = "assistant_state.json"

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

if __name__ == '__main__':
    app.run(debug=True)
