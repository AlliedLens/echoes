from flask import Blueprint, jsonify, request
from ..models import Contacts, Users
from ..db import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route("/view-contact-users", methods=["POST"])
def view_contacts_by_owner():
    data = request.get_json()
    user = data.get("user")

    contacts = Contacts.query.filter_by(contactOwner=user).all()
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

@contact_bp.route("/add-contact", methods=["POST"])
def add_contacts():
    data = request.get_json()
    
    queryName = data.get('contactName')
    owner = data.get('loggedUser')

    if not queryName or not owner:
        return jsonify({"message": "Both contactName and owner are required"}), 400

    contactedUser = Users.query.filter_by(username=queryName).first()
    if not contactedUser:
        return jsonify({"message": "Contact not found"}), 404
    
    userAlreadyInContacts = Contacts.query.filter_by(contactName=queryName, contactOwner=owner).first()
    if userAlreadyInContacts:
        return jsonify({"message": f"Contact already exists with {owner}"}), 400

    newContact = Contacts(isGroup=False, contactOwner=owner, contactName=queryName)
    db.session.add(newContact)
    db.session.commit()

    return jsonify({"message": "Contact has been added"}), 200