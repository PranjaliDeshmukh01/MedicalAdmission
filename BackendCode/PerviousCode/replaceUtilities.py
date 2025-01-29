import re


def replace_birthdate(text):
    
    birthdate_patterns = [
        r"(Date of Birth:\s*)\d{2}/\d{2}/\d{4}",
        r"(DOB:\s*)\d{2}/\d{2}/\d{4}",
        r"(Birth Date:\s*)\d{2}/\d{2}/\d{4}"
    ]

    for pattern in birthdate_patterns:
        text = re.sub(pattern, r"\1[BIRTHDATE]", text)

    return text

def replace_date(entity_text):
    year_match = re.search(r"\b(19|20)\d{2}\b", entity_text)
    if year_match:
        year = year_match.group(0)
        return f"6/30/{year}"
    return "[DATE]"


def replace_pii(text, entity_text, placeholder):
    return text.replace(entity_text, placeholder)


def replace_gender(text):
    return re.sub(r"\bSex:\s*[MF]\b", "Sex: [GENDER]", text)


def replace_ssn(text):
    ssn_pattern = r"\b\d{3}-\d{2}-\d{4}\b"
    return re.sub(ssn_pattern, "[SSN]", text)

