import imghdr

#used to get the format of the image
def validate_image(stream):
    header = stream.read(512) # reads the first 512 bytes of image file
    stream.seek(0)
    format = imghdr.what(None, header)
    if not format:
        return None
    return "." + (format if format != "jpeg" else "jpg")
