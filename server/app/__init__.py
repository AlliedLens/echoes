from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config
from .db import db
from .routes import register_routes

#used to initialize once app module is imported in api.py
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, supports_credentials=True)
    
    # Initialize extensions
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    # Register blueprints
    register_routes(app)
    
    return app