from app import create_app
from app.config import Config
import ssl
import os

app = create_app()

if __name__ == "__main__":    
    # cert_path = os.getenv("CERT_PATH", "certs/cert.perm")
    # key_path = os.getenv("KEY_PATH", "certs/key.perm")

    # context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    # context.load_cert_chain(certfile="certs/cert.perm", keyfile="certs/key.perm")

    app.run()

