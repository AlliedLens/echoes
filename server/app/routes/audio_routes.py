from flask import Blueprint, jsonify, request
from ..models import Users
from ..models import Chats
from ..db import db
import pyttsx3

engine = pyttsx3.init()

audio_bp = Blueprint("audio", __name__)

voices = engine.getProperty('voices')
for index, voice in enumerate(voices):
    print(f"Voice {index}: {voice.name} - ID: {voice.id}")

# Select a human-like voice (choose based on your OS and preference)
# Replace `0` with the index of the desired voice from the above list


@audio_bp.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    # Get the text from the POST request
    data = request.get_json()
    text = data.get('text')

    engine.setProperty('voice', voices[98].id)

    # Set properties for a more natural sound
    engine.setProperty('rate', 150)  # Lower rate for a more human-like speed
    engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    filename = '../client/screens/ChatScreen/tts.mp3'

    # Save speech to file
    engine.save_to_file(text, filename)
    engine.runAndWait()  # Process and finalize the file save

    return jsonify({'message': 'Text saved as MP3', 'filename': filename}), 200
