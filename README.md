# Demo AI Assistant

A cross-platform desktop voice assistant built with React, Electron, and Python (Flask backend + AI modules). The assistant provides real-time voice interaction, AI-powered responses, YouTube suggestions, weather info, search history, and more—all in a beautiful, modern UI.

---

## Features

### Major Features
- **Voice Assistant:** Hold RIGHT SHIFT to speak, transcribe your voice, and get AI-powered responses.
- **Real-Time Status:** UI shows assistant state (Idle, Listening, Thinking, Speaking) in real time.

- **YouTube Suggestions:** Get relevant YouTube video links for entertainment and information.
- **Weather Info:** Ask for weather/temperature and get live data.
- **Search History & Stats:** Tracks and displays your search categories and history.
- **Modern UI:** Animated orb, sidebar, video suggestions, and status area.
- **Electron Desktop App:** Runs as a single-window desktop app.

### Minor Features
- **Hotkey Activation:** Hold RIGHT SHIFT to start voice input.
- **Category Detection:** Classifies your queries into categories (Weather, Movies, Cartoons, etc.).
- **Speech Synthesis:** AI responses are spoken aloud using TTS.
- **Abort Logic:** Cancel any AI processing instantly from the UI.
- **Persistent State:** Remembers last response, status, and video suggestions.
- **Cross-Origin Support:** Flask backend supports CORS for seamless frontend-backend communication.

---

## How to Run the Project

### 1. **Install Node.js dependencies**
```
npm install
```

### 2. **Install Python dependencies**
Create a `requirements.txt` with the following (or install manually):
```
flask
flask-cors
whisper
ollama
sounddevice
numpy
scipy
torch
simpleaudio
pynput
TTS
deepmultilingualpunctuation
youtubesearchpython
requests
```
Then run:
```
pip install -r requirements.txt
```

### 3. **Start the App**
- In your project directory, run:
  ```
  npm start
  ```
  This will:
  - Start the React development server
  - Wait for it to be ready
  - Launch Electron, which also starts the Flask backend

- In a **separate terminal**, run:
  ```
  python Main.py
  ```
  This enables hotkey/audio and real-time status updates. **You must run Main.py in a real terminal for hotkey/audio to work!**

---

## Project Structure

- `src/` — React frontend (UI, hooks, components)
- `public/electron.js` — Electron main process (launches Flask, opens UI)
- `flask_server.py` — Flask backend (serves API endpoints, status, abort, etc.)
- `Main.py` — Main assistant logic (audio, AI, TTS, status, abort logic)
- `weather_fetcher.py`, `youtube_fetcher.py`, `search_history.py` — Backend modules
- `assistant_state.json`, `search_history.json` — Persistent state files

---

## Node.js/Electron Packages Used
- `react`, `react-dom`, `react-scripts` — UI
- `electron` — Desktop app shell
- `concurrently`, `wait-on` — For running React and Electron together
- `@testing-library/*`, `web-vitals` — Testing/metrics

---

## Python Packages Used
- `flask`, `flask-cors` — Backend API
- `whisper` — Speech-to-text
- `ollama` — AI chat
- `sounddevice`, `numpy`, `scipy` — Audio recording/processing
- `torch` — ML backend
- `simpleaudio` — Audio playback
- `pynput` — Hotkey detection
- `TTS` — Text-to-speech
- `deepmultilingualpunctuation` — Punctuation restoration
- `youtubesearchpython` — YouTube video search
- `requests` — HTTP requests

---

## Troubleshooting & Tips
- **Main.py must be run in a real terminal** (not as a background process) for hotkey/audio to work.
- If you see CORS errors, make sure `flask-cors` is installed and enabled in `flask_server.py`.
- If Electron does not launch, ensure `concurrently` and `wait-on` are installed (`npm install`).
- For audio features, ensure your microphone is working and accessible.
- If you get Python import errors, check that all required packages are installed.
- For weather, you need a valid OpenWeatherMap API key in `weather_fetcher.py`.

---

## Development Workflow
- Edit React UI in `src/` — hot reloads in Electron window.
- Edit backend Python files — restart Flask/Main.py as needed.
- Use the ABORT button to cancel long AI responses.

---

## Credits
- Built with [React](https://reactjs.org/), [Electron](https://www.electronjs.org/), [Flask](https://flask.palletsprojects.com/), [Whisper](https://github.com/openai/whisper), [Ollama](https://ollama.com/), and more.

---

**Enjoy your AI-powered desktop assistant!**
