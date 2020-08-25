from init import application


class HttpError(Exception):
    STATUS_CODE = 500

    def __init__(self, message: str):
        Exception.__init__(self)
        self.message = message


class BadRequest(HttpError):
    """The request could not be understood by the server due to malformed syntax."""
    STATUS_CODE = 400


class Unauthorized(HttpError):
    """The request requires user authentication."""
    STATUS_CODE = 401


class Forbidden(HttpError):
    """The server understood the request, but is refusing to fulfill it. Authorization will not help."""
    STATUS_CODE = 403


class NotFound(HttpError):
    """The server has not found anything matching the Request-URI."""
    STATUS_CODE = 404


@application.errorhandler(HttpError)
def handle_error(error: HttpError):
    print(error.message)
    return error.message, error.STATUS_CODE
