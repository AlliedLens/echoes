from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import sqlite3
import logging
# from flask_login import LoginManager, UserMixin
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

    hashedPassword = hashPassword(password)

    newUser = Users(username=username, password=hashedPassword)
    
    try:
        db.session.add(newUser)
        db.session.commit()
        app.logger.info("User added successfully")
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 400

    return data

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    hashedPassword = hashPassword(password)
    users = Users.query.all()
    
    for ele in [{'id': user.id, 'username': user.username, 'password':user.password} for user in users]:
        if ele["username"] == username and hashedPassword == ele["password"]:
            return {"value":"user_found"}
        
    return {"value":"user_not_found"}
