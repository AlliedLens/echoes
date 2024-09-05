import os

#has variables that are used throughout the file
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///app.db')
    UPLOAD_PATH = "profiles"
    UPLOAD_EXTENSIONS = [".jpg", ".png"]
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    IP_ADDRESS = "192.168.23.136"
    PORT_NUMBER = 5000