from .auth_routes import auth_bp
from .contact_routes import contact_bp
from .admin_routes import admin_bp
from .chatting_routes import chatting_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(chatting_bp)