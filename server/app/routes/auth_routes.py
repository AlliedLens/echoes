# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from ..models import Users
from ..utils.hashing import hashPassword
from ..db import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    profilePhotoPath = data.get("profile_photo")

    
    if len(username) < 3:
        return {"value": "username_too_short"}
    if len(password) < 3:
        return {"value": "password_too_short"}

    hashedPassword = hashPassword(password)
    newUser = Users(username=username, password=hashedPassword, profilePhotoPath=profilePhotoPath)
    
    try:
        db.session.add(newUser)
        db.session.commit()
        return {'value': 'new_account_success'}
    except Exception as e:
        db.session.rollback()
        return {'value': str(e)}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    hashedPassword = hashPassword(password)
    
    user = Users.query.filter_by(username=username).first()
    
    if user and user.password == hashedPassword:
        return {"value": "user_found"}
    
    return {"value": "user_not_found"}

