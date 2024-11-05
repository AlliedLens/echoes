from flask import Blueprint, jsonify, request
from ..models import Users
from ..models import Chats
from ..db import db
import pyttsx3

audio_bp = Blueprint("audio", __name__)


@audio_bp.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    # Get the text from the POST request
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Initialize pyttsx3 engine
    engine = pyttsx3.init()

    # Set properties if needed, such as voice, rate, etc.
    engine.setProperty('rate', 150)  # Speed of speech

    filename = '../client/screens/ChatScreen/tts.mp3'

    # Save speech to file
    engine.save_to_file(text, filename)
    engine.runAndWait()  # Process and finalize the file save

    return jsonify({'message': 'Text saved as MP3', 'filename': filename}), 200
