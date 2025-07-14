# weather_fetcher.py

import requests

API_KEY = "e0e65adba0dd050d6044134618d3cd23"  # Replace with your actual OpenWeatherMap API key
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def fetch_weather(city_name):
    try:
        params = {
            'q': city_name,
            'appid': API_KEY,
            'units': 'metric'
        }
        response = requests.get(BASE_URL, params=params, timeout=10)

        if response.status_code == 200:
            data = response.json()
            temp = data['main']['temp']
            description = data['weather'][0]['description'].capitalize()
            return f"The current temperature in {city_name} is {temp}°C with {description}."
        else:
            return "Sorry, I couldn't retrieve the weather data right now."

    except Exception as e:
        return "Sorry, I couldn't retrieve the weather data right now."
