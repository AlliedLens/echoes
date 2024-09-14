from flask import Blueprint, jsonify, request
from ..models import Contacts, Users
from sqlalchemy import or_, and_
from ..db import db
from ..models import Chats

chatting_bp = Blueprint("chatting", __name__)


#to list out past and present conversations
@chatting_bp.route("/view-messages-in-chat", methods=["POST"])
def viewMessagesInChat():
    data = request.get_json()
    sender = data.get("sender")
    receiver = data.get("receiver")
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
@chatting_bp.route("/send-message", methods=["POST"])
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
@chatting_bp.route("/delete-message", methods=["POST"])
def deleteMessage(sender, receiver, id):
    data = request.get_json()
    sender = data.get("sender")
    receiver = data.get("receiver")
    id = data.get("id")
    
    return {"message" : "message deleted"}

