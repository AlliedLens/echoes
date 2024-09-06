# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from ..models import Users
from ..utils.hashing import hashPassword
from ..db import db

auth_bp = Blueprint('auth', __name__)

#used to make a new account
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    profilePhotoPath = data.get("profilePhotoPath")


    if profilePhotoPath == "":
        return {"value":"upload a profile photo"}
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

#used to login to an already registered account
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

#used to find user data(particularly profile photo, by username)
@auth_bp.route("/view-by-username/<username>", methods=["POST"])
def find_data_by_username(username):
    user = Users.query.filter_by(username=username).first()
    if user:
        return jsonify(
            {
                "id" : user.id,
                "username" : user.username,
                "password" : user.password,
                "profilePhotoPath" : user.profilePhotoPath 
            }
        ), 200
    
    return jsonify({"error": "user not found"}), 404

