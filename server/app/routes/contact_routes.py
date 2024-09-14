from flask import Blueprint, jsonify, request
from ..models import Contacts, Users
from ..db import db

contact_bp = Blueprint('contact', __name__)

def view_contacts_by_owner(owner):
    contacts = Contacts.query.filter_by(contactOwner=owner).all()
    if not contacts:
        return jsonify([]), 200

    userList = []
    for c in contacts:
        u = Users.query.filter_by(username=c.contactName).all()
        if u:
            userList.append(u[0])

    userList = [
        {
            "id": user.id,
            "username": user.username,
            "profilePhotoPath": user.profilePhotoPath,
        } for user in userList if user
    ]

    return jsonify(userList), 200

@contact_bp.route("/add-test-contacts", methods=["GET"])
def add_test_contacts():
    a = Contacts(isGroup=False, contactOwner="test1", contactName="dave")
    b = Contacts(isGroup=False, contactOwner="test1", contactName="ada")
    c = Contacts(isGroup=True, contactOwner="test1", contactName="new_group")
    
    db.session.add_all([a, b, c])
    db.session.commit()
    return {"message": "Test contacts added"}

@contact_bp.route("/add-contact/<queryName>/<owner>", methods=["POST"])
def add_contacts(queryName, owner):
    contactedUser = Users.query.filter_by(username=queryName).first()
    
    if not contactedUser:
        return {"message" : "contact not found"}
    
    userAlreadyInContacts = Contacts.query.filter_by(contactName=queryName, contactOwner=owner).first()

    if userAlreadyInContacts:
        return {"message" : f"contact already exists with {owner}."}

    newContact = Contacts(isGroup = False, contactOwner=owner, contactName=queryName)

    db.session.add(newContact)
    db.session.commit()
    return {"message": "contact has been added"}
