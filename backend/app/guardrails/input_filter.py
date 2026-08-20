"""
Inbound Input Guardrail: Prompt Injections, Jailbreaks, Toxicity, and Off-Topic Query Filtering.
"""

import re
from typing import Tuple, Dict, Any

class InputGuardrail:
    def __init__(self):
        self.injection_patterns = [
            re.compile(r'ignore\s+(all\s+)?previous\s+instructions', re.IGNORECASE),
            re.compile(r'system\s+prompt', re.IGNORECASE),
            re.compile(r'you\s+are\s+now\s+in\s+dan\s+mode', re.IGNORECASE),
            re.compile(r'bypass\s+all\s+safety', re.IGNORECASE),
            re.compile(r'do\s+anything\s+now', re.IGNORECASE),
            re.compile(r'reveal\s+(internal|hidden)\s+prompt', re.IGNORECASE),
            re.compile(r'drop\s+database|delete\s+from', re.IGNORECASE)
        ]

        self.unsafe_patterns = [
            re.compile(r'\b(bomb|explosive|weapon|malware|ransomware|hack\s+into|ddos)\b', re.IGNORECASE),
            re.compile(r'\b(create\s+a\s+virus|steal\s+passwords)\b', re.IGNORECASE)
        ]

        self.off_topic_patterns = [
            re.compile(r'\b(joke|riddle|sing\s+a\s+song|write\s+a\s+poem|play\s+a\s+game)\b', re.IGNORECASE),
            re.compile(r'\b(weather\s+in|horoscope|fortune|lottery)\b', re.IGNORECASE)
        ]

    def evaluate(self, query: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Evaluates input query.
        Returns: (is_safe, reason, metadata)
        """
        clean_q = query.strip()
        if not clean_q:
            return False, "Empty query received.", {"flag": "empty_input", "category": "invalid"}

        # 1. Check for prompt injection
        for pat in self.injection_patterns:
            if pat.search(clean_q):
                return False, "Input rejected: Prompt injection / jailbreak attempt detected.", {
                    "flag": "prompt_injection",
                    "category": "security_violation",
                    "matched_pattern": pat.pattern
                }

        # 2. Check for unsafe/harmful requests
        for pat in self.unsafe_patterns:
            if pat.search(clean_q):
                return False, "Input rejected: Safety policy violation (harmful/inappropriate content).", {
                    "flag": "safety_violation",
                    "category": "harmful_content",
                    "matched_pattern": pat.pattern
                }

        # 3. Check for off-topic non-informational queries
        for pat in self.off_topic_patterns:
            if pat.search(clean_q):
                return False, "Query out of scope: This assistant is dedicated to factual knowledge retrieval from the MSMARCO corpus.", {
                    "flag": "off_topic",
                    "category": "domain_mismatch",
                    "matched_pattern": pat.pattern
                }

        return True, "Input passed security & intent validation.", {
            "flag": "passed",
            "category": "safe_informational"
        }

input_guardrail = InputGuardrail()
