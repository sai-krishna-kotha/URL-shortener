import secrets
import string

BASE62_ALPHABET = string.ascii_uppercase + string.ascii_lowercase + string.digits
SHORT_CODE_LENGTH = 7

def generate_short_code() -> str:
    """Generates a cryptographically secure random 7-character Base62 string."""
    return ''.join(secrets.choice(BASE62_ALPHABET) for _ in range(SHORT_CODE_LENGTH))
