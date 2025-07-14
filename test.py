from weather_fetcher import fetch_weather
import whisper
import ollama
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import tempfile
import os
import re
import json
import torch
import simpleaudio as sa
from pynput import keyboard
from TTS.api import TTS
from deepmultilingualpunctuation import PunctuationModel
from search_history import update_search_history
from youtube_fetcher import fetch_youtube_links

# Global variables
punctuation_model = PunctuationModel()
recording = False
recorded_audio = []
samplerate = 16000

STATE_FILE = "assistant_state.json"


def callback(indata, frames, time_info, status):
    if recording:
        recorded_audio.append(indata.copy())


def wait_for_right_shift():
    def on_press(key):
        global recording, recorded_audio
        if key == keyboard.Key.shift_r and not recording:
            print("\n🔴 Listening... Speak now.")
            recorded_audio = []
            recording = True

    def on_release(key):
        global recording
        if key == keyboard.Key.shift_r and recording:
            recording = False
            print("✅ Recording stopped.")
            return False

    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()


def record_audio():
    global recorded_audio
    with sd.InputStream(samplerate=samplerate, channels=1, callback=callback):
        wait_for_right_shift()
    audio_data = np.concatenate(recorded_audio, axis=0)
    temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    wav.write(temp_wav.name, samplerate, audio_data)
    return temp_wav.name


def adaptive_transcribe(audio_path):
    for model_name in ["medium", "large"]:
        print(f"🔍 Transcribing with Whisper ({model_name})...")
        model = whisper.load_model(model_name)
        result = model.transcribe(audio_path)
        text = result["text"].strip()
        if len(text.split()) > 4 and any(c.isalpha() for c in text):
            punctuated = punctuation_model.restore_punctuation(text)
            print(f"📝 You said: {punctuated}")
            return punctuated
        else:
            print(f"⚠️ Poor quality with {model_name}, trying next...")
    return "Sorry, I couldn't hear you clearly."


def extract_city_from_text(user_text):
    user_text = user_text.lower()
    possible_cities = [
        "new york", "california", "los angeles", "chicago", "boston", "houston",
        "texas", "seattle", "san francisco", "miami", "philadelphia", "dallas"
    ]
    for city in possible_cities:
        if city in user_text:
            return city.title()
    return "New York"  # Default fallback


def query_ollama(text, model_name="mistral"):
    print("🤖 Thinking...")
    response = ollama.chat(model=model_name, messages=[
        {"role": "user", "content": text}
    ])
    reply = response['message']['content']
    print(f"🤖 Assistant: {reply}")
    return reply


def clean_text_for_tts(text):
    text = re.sub(r'http\S+', 'Link available.', text)
    text = text.replace('°', ' degrees')
    text = text.replace('=', ' equals ')
    text = text.replace('/', ' slash ')
    text = text.replace('-', ' dash ')
    text = text.replace('_', ' underscore ')
    return text


def speak_text(text):
    print("🔊 Speaking response...")
    tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False)
    tts.to("cuda" if torch.cuda.is_available() else "cpu")

    clean_text = clean_text_for_tts(text)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        tts.tts_to_file(text=clean_text, file_path=temp_audio.name)
        wave_obj = sa.WaveObject.from_wave_file(temp_audio.name)
        play_obj = wave_obj.play()
        play_obj.wait_done()
        temp_audio.close()
        os.unlink(temp_audio.name)


def save_state(response_text, youtube_links=None):
    state = {
        "last_response": response_text,
        "youtube_links": youtube_links or []
    }
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=4)


def loop_assistant():
    while True:
        try:
            audio_path = record_audio()
            user_text = adaptive_transcribe(audio_path)

            history_data, category = update_search_history(user_text)
            print(f"📊 Detected category: {category}")
            print(f"📈 Updated search stats: {history_data}")

            # Handle Weather Requests Dynamically
            if "weather" in user_text.lower() or "temperature" in user_text.lower():
                city_name = extract_city_from_text(user_text)
                assistant_reply = fetch_weather(city_name)
                print(f"🌦️ Weather Fetched for {city_name}: {assistant_reply}")
            else:
                assistant_reply = query_ollama(user_text)

            speak_text(assistant_reply)

            video_links = []
            if category in ["Movies", "Cartoons", "Facts"]:
                print("\n🎬 Related YouTube Suggestions:")
                video_links = fetch_youtube_links(user_text)
                for link in video_links:
                    print("•", link)

            save_state(assistant_reply, video_links)

            os.unlink(audio_path)
            print("\n👂 Ready to listen again. Hold RIGHT SHIFT to speak.")

        except KeyboardInterrupt:
            print("\n👋 Exiting Demo AI Assistant.")
            break


if __name__ == "__main__":
    print("🧠 Demo AI Assistant is running in background mode.\n")
    print("👉 Hold RIGHT SHIFT anytime to speak.\n")
    loop_assistant()
