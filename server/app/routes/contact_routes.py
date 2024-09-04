from flask import Blueprint, jsonify
from ..models import Contacts
from ..db import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route("/view-contacts-by-owner/<owner>", methods=["GET"])
def view_contacts_by_owner(owner):
    contacts = Contacts.query.filter_by(contactOwner=owner).all()
    contactsList = [
        {
            'id': contact.id,
            'isGroup': contact.isGroup,
            'contactName': contact.contactName,
            'contactOwner': contact.contactOwner,
            'profilePhoto': contact.profilePhoto
        } for contact in contacts
    ]
    return jsonify(contactsList)

@contact_bp.route("/add-test-contacts", methods=["GET"])
def add_test_contacts():
    a = Contacts(isGroup=False, contactOwner="test1", contactName="dave")
    b = Contacts(isGroup=False, contactOwner="test1", contactName="ada")
    c = Contacts(isGroup=True, contactOwner="test1", contactName="new_group")
    
    db.session.add_all([a, b, c])
    db.session.commit()
    return {"message": "Test contacts added"}
