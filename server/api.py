from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import sqlite3
import logging
import hashlib
from flask_cors import CORS

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app)
db = SQLAlchemy()

def hashPassword(password):
   password_bytes = password.encode('utf-8')
   hash_object = hashlib.sha256(password_bytes)
   return hash_object.hexdigest()


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/delete-users-table')
def delete_users_table():
    db.drop_all()
    return {'message': 'Users table deleted'}

@app.route('/view-users', methods=['GET'])
def view_users():
    users = Users.query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'password': user.password} for user in users])

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = str(data.get("username"))
    password = str(data.get("password"))

    if (len(username) < 3):
        return {"value":"username_too_short"}
    if (len(password) < 3):
        return {"value":"password_too_short"}
    
    if not (username.isalnum() and any(c.isalpha() for c in username) and any(c.isdigit() for c in username)):
        return {"value": "username_not_mix_of_letters_and_numbers"}

    if not (password.isalnum() and any(c.isalpha() for c in password) and any(c.isdigit() for c in password)):
        return {"value": "password_not_mix_of_letters_and_numbers"}
    
    hashedPassword = hashPassword(password)
    newUser = Users(username=username, password=hashedPassword)
    
    try:
        db.session.add(newUser)
        db.session.commit()
        app.logger.info("User added successfully")
        return {'value': 'new_account_success'}
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error occurred: {e}")
        return {'value': str(e)}


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    hashedPassword = hashPassword(password)
    users = Users.query.all()

    userFound = True
    
    for ele in [{'id': user.id, 'username': user.username, 'password':user.password} for user in users]:
        if ele["username"] == username and hashedPassword == ele["password"]:
            return {"value":"user_found"}
        
    return {"value":"user_not_found"}
