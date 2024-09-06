from flask import Blueprint, jsonify
from ..models import Users
from ..db import db

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/delete")
def delete_users_table():
    db.drop_all()
    db.create_all()
    return {'message': 'Users table deleted'}

# @admin_bp.route("")


@admin_bp.route('/view-users', methods=['GET'])
def view_users():
    users = Users.query.all()
    return jsonify([{'id': user.id, 'username': user.username, 'password': user.password, "profilePhotoPath": user.profilePhotoPath} for user in users])
