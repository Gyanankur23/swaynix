#!/usr/bin/env python3
"""
Content Moderation Module for Swaynix
Detects and blocks hate speech, harmful words, and inappropriate content.
Usage: Import and call validate_content() before allowing posts/messages.
"""

import re
from typing import List, Tuple, Optional

# Hate speech and harmful word patterns
# Organized by category for maintainability
HARMFUL_PATTERNS = {
    "hate_speech": [
        r"\bhate\b", r"\bkill\b", r"\bdie\b", r"\bdeath\b",
        r"\bviolence\b", r"\battack\b", r"\bdestroy\b",
        r"\bracist\b", r"\bracism\b", r"\bnazi\b", r"\bhitler\b",
        r"\bterrorist\b", r"\bterrorism\b", r"\bbomb\b",
    ],
    "harassment": [
        r"\bstupid\b", r"\bidiot\b", r"\bmoron\b", r"\bdumb\b",
        r"\bretard\b", r"\bretarded\b", r"\bfool\b",
        r"\bshut\s*up\b", r"\bget\s*lost\b", r"\bgo\s*away\b",
        r"\bharrass\b", r"\bbully\b", r"\btorture\b",
    ],
    "profanity": [
        r"\bf\s*[*\u00b7]*\s*u\s*[*\u00b7]*\s*c\s*[*\u00b7]*\s*k\b",
        r"\bs\s*h\s*[*\u00b7]*\s*i\s*t\b", r"\ba\s*s\s*s\b",
        r"\bb\s*i\s*t\s*c\s*h\b", r"\bb\s*a\s*s\s*t\s*a\s*r\s*d\b",
        r"\bd\s*a\s*m\s*n\b", r"\bh\s*e\s*l\s*l\b",
    ],
    "discrimination": [
        r"\bs\s*l\s*u\s*r\b", r"\bh\s*o\s*m\s*o\b",
        r"\bf\s*a\s*g\b", r"\bn\s*i\s*g\b", r"\bc\s*h\s*i\s*n\s*k\b",
        r"\bk\s*y\s*k\b", r"\bw\s*h\s*o\s*r\s*e\b",
        r"\bs\s*h\s*e\s*m\s*a\s*l\s*e\b", r"\bt\s*r\s*a\s*n\s*n\s*y\b",
    ],
    "threats": [
        r"\bwill\s+kill\b", r"\bgoing\s+to\s+kill\b",
        r"\bshould\s+die\b", r"\bdeserve\s+to\s+die\b",
        r"\bhurt\s+you\b", r"\bcome\s+for\s+you\b",
        r"\bwatch\s+your\s+back\b", r"\bremember\s+this\b",
    ],
    "self_harm": [
        r"\bsuicide\b", r"\bkill\s+myself\b", r"\bend\s+it\s+all\b",
        r"\bcut\s+myself\b", r"\bhurt\s+myself\b",
        r"\bwant\s+to\s+die\b", r"\bbetter\s+off\s+dead\b",
    ],
}

# Compile all patterns for efficient matching
ALL_PATTERNS: List[Tuple[str, re.Pattern]] = []
for category, patterns in HARMFUL_PATTERNS.items():
    for pattern in patterns:
        try:
            ALL_PATTERNS.append((category, re.compile(pattern, re.IGNORECASE)))
        except re.error:
            continue


def validate_content(text: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Validates content for hate speech and harmful words.
    
    Args:
        text: The content to validate
        
    Returns:
        Tuple of (is_valid, violation_category, matched_word)
        - is_valid: True if content is safe, False if harmful
        - violation_category: Category of violation if harmful, None if safe
        - matched_word: The specific word/pattern matched, None if safe
    """
    if not text or not isinstance(text, str):
        return True, None, None
    
    # Normalize text: remove extra spaces, convert to lowercase for matching
    normalized_text = re.sub(r'\s+', ' ', text).strip()
    
    for category, pattern in ALL_PATTERNS:
        match = pattern.search(normalized_text)
        if match:
            return False, category, match.group(0)
    
    return True, None, None


def get_validation_message(violation_category: str, matched_word: str) -> str:
    """
    Returns an appropriate error message based on the violation type.
    
    Args:
        violation_category: The category of violation detected
        matched_word: The specific word/pattern that was matched
        
    Returns:
        Error message to display to the user
    """
    messages = {
        "hate_speech": "Your message contains hate speech which violates our community guidelines.",
        "harassment": "Harassment and insults are not allowed in our community.",
        "profanity": "Please keep your language clean and respectful.",
        "discrimination": "Discriminatory language is not tolerated here.",
        "threats": "Threats of violence are strictly prohibited.",
        "self_harm": "If you're struggling, please reach out for help. This type of content is not allowed.",
    }
    
    base_message = messages.get(
        violation_category, 
        "Your message contains inappropriate content."
    )
    
    return f"⚠️ Content Blocked: {base_message} Please revise your message."


def moderate_post(title: str, content: str, author: str) -> dict:
    """
    Moderates a complete post with title and content.
    
    Args:
        title: Post title
        content: Post content/body
        author: Author identifier
        
    Returns:
        dict with moderation result
    """
    # Check title
    title_valid, title_cat, title_word = validate_content(title)
    if not title_valid:
        return {
            "allowed": False,
            "reason": "title_violation",
            "category": title_cat,
            "message": get_validation_message(title_cat, title_word),
            "suggestion": "Please revise your post title to remove inappropriate language."
        }
    
    # Check content
    content_valid, content_cat, content_word = validate_content(content)
    if not content_valid:
        return {
            "allowed": False,
            "reason": "content_violation",
            "category": content_cat,
            "message": get_validation_message(content_cat, content_word),
            "suggestion": "Please revise your post content to remove inappropriate language."
        }
    
    return {
        "allowed": True,
        "reason": None,
        "category": None,
        "message": "Content approved",
        "suggestion": None
    }


def moderate_message(message_text: str, sender: str) -> dict:
    """
    Moderates a chat/message content.
    
    Args:
        message_text: The message content
        sender: Message sender identifier
        
    Returns:
        dict with moderation result
    """
    valid, category, word = validate_content(message_text)
    
    if not valid:
        return {
            "allowed": False,
            "reason": "message_violation",
            "category": category,
            "message": get_validation_message(category, word),
            "blocked_word": word
        }
    
    return {
        "allowed": True,
        "reason": None,
        "category": None,
        "message": "Message approved",
        "blocked_word": None
    }


# Example usage and testing
if __name__ == "__main__":
    # Test cases
    test_cases = [
        ("Hello everyone!", True),
        ("This is a normal post about travel", True),
        ("I hate all of you", False),
        ("You are such an idiot", False),
        ("This community is great!", True),
        ("Go away and never come back", False),
    ]
    
    print("=" * 60)
    print("Swaynix Content Moderation Test")
    print("=" * 60)
    
    for test_text, expected in test_cases:
        is_valid, category, word = validate_content(test_text)
        status = "✅ PASS" if is_valid == expected else "❌ FAIL"
        print(f"\n{status} | Text: '{test_text}'")
        print(f"    Valid: {is_valid} | Expected: {expected}")
        if category:
            print(f"    Category: {category} | Word: {word}")
            print(f"    Message: {get_validation_message(category, word)}")
    
    print("\n" + "=" * 60)
    print("Testing complete post moderation...")
    print("=" * 60)
    
    post_result = moderate_post(
        title="Welcome to the community",
        content="Let's build something amazing together!",
        author="user123"
    )
    print(f"\nApproved post: {post_result}")
    
    blocked_post = moderate_post(
        title="I hate everyone here",
        content="You all deserve to suffer",
        author="troll456"
    )
    print(f"\nBlocked post: {blocked_post}")
