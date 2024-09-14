from .db import db
from sqlalchemy import TIMESTAMP
import datetime

class Users(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    profilePhotoPath= db.Column(db.String(200), unique=False, nullable=True)
    password = db.Column(db.String(200), nullable=True)

class Contacts(db.Model):
    __tablename__ = "contact"
    id = db.Column(db.Integer, primary_key=True)
    isGroup = db.Column(db.Boolean, unique=False)
    contactOwner = db.Column(db.String(200), db.ForeignKey("user.username"), unique=False, nullable=False)
    contactName = db.Column(db.String(200), unique=False, nullable=False)
    
    #maybe not needed to mention the profilephoto path in contacts, as we can search that value from users table anyways...
    #profilePhotoPath = db.Column(db.String(200), unique=False, nullable=True)


    __table_args__ = (
        db.UniqueConstraint(contactName, contactOwner),
    )

class Chats(db.Model):
    __tablename__ = "chat"
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(200), db.ForeignKey("user.username"), unique=False, nullable=False)
    receiver = db.Column(db.String(200), db.ForeignKey("user.username"), unique=False, nullable=False)
    message = db.Column(db.String(4000), unique=False, nullable=False)
    createdAt = db.Column(TIMESTAMP, default=db.func.now())
