class AppError(Exception):
    """Base application exception."""
    pass

class InvalidURL(AppError):
    """Raised when the target URL is invalid or malformed."""
    pass

class InvalidAlias(AppError):
    """Raised when the custom alias format is invalid."""
    pass

class AliasAlreadyExists(AppError):
    """Raised when a custom alias is already in use in the database."""
    pass

class ShortCodeGenerationError(AppError):
    """Raised when the system fails to generate a unique random short code after max retries."""
    pass
