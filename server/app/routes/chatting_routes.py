from flask import Blueprint, jsonify, request
from ..models import Contacts, Users
from sqlalchemy import or_, and_
from ..db import db
from ..models import Chats

chatting_bp = Blueprint("chatting", __name__)


#to list out past and present conversations
@chatting_bp.route("/view-messages-in-chat/<sender>/<receiver>", methods=["GET"])
def viewMessagesInChat(sender, receiver):
    chats = Chats.query.filter(
        or_(
            and_(Chats.sender==sender, Chats.receiver==receiver),
            and_(Chats.sender==receiver, Chats.receiver==sender)
        )
    )

    chats = [{
        "id" : chat.id,
        "sender" : chat.sender,
        "receiver" : chat.receiver,
        "message" : chat.message,
        "createdAt" : chat.createdAt
    } for chat in chats]

    return jsonify(chats)

#to push a new chat
@chatting_bp.route("/send-message", methods=["POST", "GET"])
def sendMessage():
    data = request.get_json()
    sender = data.get('sender')
    receiver = data.get('receiver')
    message = data.get("message")

    chat = Chats(sender=sender, receiver=receiver, message=message)
    db.session.add(chat)
    db.session.commit()

    return {"message": f"{sender} -> {receiver} : {message}"}

#to delete a particular msg
@chatting_bp.route("/delete-message/<sender>/<receiver>/<id>", methods=["GET"])
def deleteMessage(sender, receiver, id):
    return {"message" : "message deleted"}

