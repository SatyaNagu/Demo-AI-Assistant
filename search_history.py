# --- SEARCH TRACKING LOGIC FOR DEMO AI ASSISTANT ---
import json
import os

# Define file to store history
SEARCH_HISTORY_FILE = "search_history.json"

# Define basic categories and keywords for matching
CATEGORY_KEYWORDS = {
    "Weather": ["weather", "rain", "sunny", "temperature", "forecast"],
    "Movies": ["movie", "film", "cinema", "theater"],
    "Cartoons": ["cartoon", "animation", "anime"],
    "Restaurants": ["restaurant", "food", "dine", "eat"],
    "Cloths Stores": ["cloth", "apparel", "fashion", "shop"],
    "Alarm": ["alarm", "timer", "reminder"],
    "Medical Equipment": ["medicine", "equipment", "health", "hospital"],
    "Traffic Signals": ["traffic", "signal", "road", "accident"],
    "Path Recognition": ["path", "direction", "route", "navigate"],
    "Facts": ["fact", "info", "truth", "science", "history"]
}

def load_history():
    if os.path.exists(SEARCH_HISTORY_FILE):
        with open(SEARCH_HISTORY_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_history(history):
    with open(SEARCH_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=4)

def categorize_query(text):
    text_lower = text.lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            return category
    return "Other"

def update_search_history(text):
    history = load_history()
    category = categorize_query(text)
    history[category] = history.get(category, 0) + 1
    save_history(history)
    return history, category
