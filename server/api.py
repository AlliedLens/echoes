from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import TIMESTAMP
import datetime
import os
import sqlite3
import logging
import hashlib
from flask_cors import CORS

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app)

def hashPassword(password):
   password_bytes = password.encode('utf-8')
   hash_object = hashlib.sha256(password_bytes)
   return hash_object.hexdigest()

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db = SQLAlchemy()
db.init_app(app)


class Users(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True)

class Contacts(db.Model):
    __tablename__ = "contact"
    
    id = db.Column(db.Integer, primary_key=True)
    isGroup = db.Column(db.Boolean, unique=False)
    contactOwner = db.Column(db.String(200), db.ForeignKey("user.username"), unique=False, nullable=False)
    contactName = db.Column(db.String(200), unique=False,nullable=False)
    profilePhoto = db.Column(db.String(200), unique=False, nullable=True)

    __table_args__ = (
        db.UniqueConstraint(contactName, contactOwner),
    )

class Conversations(db.Model):
    __tablename__ = "conversation"
    senderId = db.Column(db.Integer, primary_key=True)
    receiverId = db.Column(db.Integer, primary_key=True)
    msg = db.Column(db.String(1000), unique=False, nullable=False)
    createdAt = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

class LoggedUser(db.Model):
    __tablename__ = "logged_user"
    username = db.Column(db.String(200), unique=True, nullable=False, primary_key=True)

with app.app_context():
    db.create_all()

@app.route('/delete')
def delete_users_table():
    db.drop_all()
    db.create_all()
    return {'message': 'Users table deleted'}

@app.route("/add-test-users")
def add_test_users():
    a = Contacts(isGroup=False, contactOwner="test1", contactName="dave")
    b = Contacts(isGroup=False, contactOwner="test1", contactName="ada")
    c = Contacts(isGroup=True, contactOwner="test1", contactName="new_group")
    # d = Contacts(isGroup=False, contactOwner="invalid", contactName="dave")

    db.session.add(a)
    db.session.add(b)
    db.session.add(c)
    # db.session.add(d)

    db.session.commit()

    return {'message':"test users added"}

@app.route("/view-contacts/<owner>", methods=["POST", "GET"])
def find_contacts(owner):
    contacts = Contacts.query.filter(Contacts.contactOwner==owner).all()
    contactsList = [
        
        {
            'id' : contact.id,
            'isGroup' : contact.isGroup,
            'contactName' : contact.contactName,
            'contactOwner' : contact.contactOwner,
            'profilePhoto' : contact.profilePhoto
        } for contact in contacts
    ]

    return jsonify(contactsList)

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

if __name__ == "__main__":
    app.run()
