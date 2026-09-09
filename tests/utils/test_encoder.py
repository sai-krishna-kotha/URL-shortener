from app.utils.encoder import generate_short_code, BASE62_ALPHABET, SHORT_CODE_LENGTH

def test_generate_short_code_length():
    code = generate_short_code()
    assert len(code) == SHORT_CODE_LENGTH

def test_generate_short_code_characters():
    code = generate_short_code()
    for char in code:
        assert char in BASE62_ALPHABET

def test_generated_codes_are_random():
    code1 = generate_short_code()
    code2 = generate_short_code()
    # It is cryptographically improbable for these to match
    assert code1 != code2
