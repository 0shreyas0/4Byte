"""
Turn raw compiler output + RAG + user history into a friendly tutoring narrative.

No external LLM required — wording is hand-crafted for clarity and safety.
Swap `build_personalized_explanation` for an LLM call when you are ready.
"""

from __future__ import annotations
import logging
import ollama

from app.compiler import map_python_error_to_topic
from app.models import CompileResult
from app.rag import RetrievedDoc

logger = logging.getLogger(__name__)

# Config for local LLM
OLLAMA_MODEL = "llama3"

def _generate_llm_explanation(
    result: CompileResult,
    retrieved: list[RetrievedDoc],
    weak_topics: list[str],
    common_errors: list[str],
) -> tuple[str, list[str]] | None:
    """
    Call local Ollama instance (llama3) to generate a high-quality explanation.
    """
    topic = result.mapped_topic or map_python_error_to_topic(
        result.error_type or "",
        result.raw_error or "",
    )

    rag_context = "\n---\n".join([d.text for d in retrieved])
    
    # Simple profiles
    profile = f"Weak topics: {', '.join(weak_topics)}\nCommon errors: {', '.join(common_errors)}"

    prompt = f"""
You are a warm, encouraging Python tutor. A student just hit a compiler error. 
Using the provided RAG context and their learning profile, explain what is wrong and give 3-4 actionable tips.

- Student Error: "{result.error_type}: {result.raw_error}"
- Code snippet: `{result.faulty_line}`
- Topic: {topic}

- Learner Profile:
{profile}

- Beginner Guide Context (RAG):
{rag_context}

RULES:
1. Be extremely encouraging (errors are normal!).
2. Avoid jargon where a simple word works.
3. Mention how this relates to their previous struggles (if any).
4. Do NOT say 'as an AI'. Just be the tutor.
5. Provide a 'What to try next' section with clear bullet points.

Structure:
Warm Opener -> The Problem (Simple English) -> Why it happened (Educational context) -> Actionable Tips (Bulleted)
"""
    try:
        response = ollama.generate(
            model=OLLAMA_MODEL,
            prompt=prompt,
            options={"temperature": 0.5, "top_p": 0.9}
        )
        text = response.get("response", "")
        
        # Simple parsing for tips
        if "Actionable Tips" in text or "What to try next" in text:
             sections = text.split("Tips" if "Tips" in text else "next")
             main_part = sections[0].strip()
             tips_part = sections[1].strip() if len(sections) > 1 else ""
             
             tips = [line.strip().lstrip("-*123. ") for line in tips_part.split("\n") if line.strip().startswith(("-", "*", "1.", "2.", "3."))]
             return main_part, tips
             
        return text, _suggestions_for_topic(topic, result.faulty_line)
    except Exception as e:
        logger.warning("Ollama generation failed: %s. Falling back to rule-based.", e)
        return None


def _topic_plain_english(topic: str | None) -> str:
    """One-line learner-facing label for internal topic keys."""
    labels = {
        "control_flow_syntax": "control-flow punctuation (like colons after if/def)",
        "indentation": "indentation and code blocks",
        "variables_scope": "variable names and where they are visible",
        "data_types": "types of values and how they mix",
        "lists_indexing": "list indexes (positions in a list)",
        "dicts_keys": "dictionary keys",
        "syntax_general": "general Python syntax",
        "syntax_strings_or_line_endings": "strings and line breaks",
        "general": "Python basics",
    }
    if not topic:
        return labels["general"]
    return labels.get(topic, topic.replace("_", " "))


def _opening_line(result: CompileResult) -> str:
    """Warm, reassuring opener — errors are normal while learning."""
    et = result.error_type or "Error"
    line = result.line_number
    where = f" around line {line}" if line else ""
    return (
        f'Python reported a "{et}"{where}. That sounds scary, but it is just '
        "the computer asking for a small fix. You are still learning, and this is normal."
    )


def _decode_error_in_simple_words(result: CompileResult) -> str:
    """Map common messages to very simple explanations (esp. SyntaxError)."""
    raw = (result.raw_error or "").lower()
    msg = (result.error_type or "") + " " + raw

    if "expected ':'" in raw or 'expected ":"' in raw:
        return (
            "Python expected a colon `:` at the end of a line that starts a block. "
            "That line often starts with `if`, `else`, `for`, `while`, "
            "`def name(...)`, or `try`."
        )
    if "indentationerror" in msg or "unexpected indent" in raw:
        return (
            "The spaces at the start of a line do not match how Python groups your code. "
            "After a line that ends with a colon, the next line should move inward (usually 4 spaces)."
        )
    if "invalid syntax" in raw:
        return (
            "Something in the shape of the code does not match Python's rules. "
            "Often this is a missing symbol (like `:` or `)`) or a typo in a keyword."
        )

    # Fallback: repeat technical message in gentle framing
    return (
        "Here is what Python said, in short: "
        f"{(result.raw_error or 'something went wrong while reading your code.')}"
    )


def _suggestions_for_topic(topic: str | None, faulty_line: str | None) -> list[str]:
    """Practical next steps — short imperative bullets for beginners."""
    t = topic or "general"
    base = [
        "Save your file and run the checker again after each tiny change.",
        "Compare your line with a small example from a tutorial side by side.",
    ]
    if t == "control_flow_syntax":
        return [
            "Find the `if`, `for`, `while`, `def`, `try`, or `class` line and add `:` at the end.",
            "Make sure you did not skip the colon when copying from notes.",
            *base,
        ]
    if t == "indentation":
        return [
            "Delete the spaces on the problem line and press Tab once (or type 4 spaces) "
            "so the line lines up with similar lines in your file.",
            "Never mix tabs and spaces in the same file.",
            *base,
        ]
    if t == "variables_scope":
        return [
            "Search for where the name is first created (`=` or `def`). Use that exact spelling.",
            "If the variable is inside a function, it cannot be seen outside unless you return it.",
            *base,
        ]
    if t == "data_types":
        return [
            "Print the values involved with `print(type(x))` to see what each piece is.",
            "Convert on purpose, for example `str(3)` before gluing text together.",
            *base,
        ]
    if t == "lists_indexing":
        return [
            "Check the list length with `len(items)` before using a big index.",
            "Remember: the first item is index `0`, not `1`.",
            *base,
        ]
    if t == "dicts_keys":
        return [
            "Print `my_dict.keys()` to see allowed keys.",
            "Use `my_dict.get('key', None)` when the key might be missing.",
            *base,
        ]
    if faulty_line:
        return [f"Look closely at this line: `{faulty_line.strip()[:200]}`", *base]
    return base

def build_personalized_explanation(
    result: CompileResult,
    retrieved: list[RetrievedDoc],
    weak_topics: list[str],
    common_errors: list[str],
) -> tuple[str, list[str]]:
    """
    Returns (long_explanation_string, suggestion_bullets).
    """
    # Try LLM first
    llm_res = _generate_llm_explanation(result, retrieved, weak_topics, common_errors)
    if llm_res:
        return llm_res

    # Rule-based fallback (original logic)
    topic = result.mapped_topic or map_python_error_to_topic(
        result.error_type or "",
        result.raw_error or "",
    )
    topic_friendly = _topic_plain_english(topic)

    parts: list[str] = []
    parts.append(_opening_line(result))
    parts.append("")
    parts.append("What is going on?")
    parts.append(_decode_error_in_simple_words(result))
    parts.append("")
    parts.append(f'We labeled this under the learning topic: "{topic_friendly}".')

    if weak_topics:
        overlap = [w for w in weak_topics if w == topic]
        if overlap:
            parts.append(
                "This matches an area you have bumped into before. Extra practice here "
                "will pay off soon."
            )
        else:
            others = ", ".join(_topic_plain_english(w) for w in weak_topics[:3])
            parts.append(
                f"You have also had trouble with: {others}. "
                "Patterns you learn while fixing this error will help there too."
            )

    if retrieved:
        parts.append("")
        parts.append("Extra notes from your beginner guide:")
        for i, doc in enumerate(retrieved[:3], start=1):
            snippet = doc.text.strip().replace("\n", " ")
            if len(snippet) > 450:
                snippet = snippet[:447] + "..."
            parts.append(f"{i}. {snippet}")

    if common_errors:
        parts.append("")
        parts.append("Errors you have seen often before (for awareness, not blame):")
        for line in common_errors[:3]:
            parts.append(f"- {line}")

    parts.append("")
    parts.append(
        "Take a breath, change one small thing, and try again. Small steps are how every "
        "good programmer learned."
    )

async def generate_learning_summary(
    domain: str,
    weak_topics: list[str],
    micro_gaps: list[str],
    root_cause: str,
    results: list[QuestionResult] = None
) -> tuple[str, list[str]]:
    """
    Generate a mentor-style summary and a detailed thought process for missed concepts.
    """
    performance_context = ""
    if results:
        performance_context = "Detailed results:\n" + "\n".join([
            f"- Q: {r.question_id} | Topic: {r.topic} | Concept: {r.concept} | Correct: {r.is_correct} | Time: {r.time_spent}s"
            for r in results
        ])

    # Extract 3 questions for detailed analysis (prioritize missed ones)
    to_analyze = [r for r in results if not r.is_correct][:3]
    if len(to_analyze) < 3:
        to_analyze.extend([r for r in results if r.is_correct][:3 - len(to_analyze)])

    detailed_report_context = ""
    for r in to_analyze:
        detailed_report_context += f"- ID: {r.question_id} ({r.concept}) | Topic: {r.topic} | Correct: {r.is_correct}\n"

    prompt = f"""
You are the Lead Mentor at NeuralPath. 
Provide a detailed tutoring breakdown for this student in {domain}.

Performance Summary:
- Weak Topics: {', '.join(weak_topics)}
- Conceptual Gaps (Micro): {', '.join(micro_gaps)}
- Root Cause: {root_cause}

Questions to Deep-Dive:
{detailed_report_context}

Output format:
1. SUMMARY: [Mentor's 3-sentence high-level guidance]
2. REASONING: [Step 1; Step 2; Step 3]
3. DEEP_DIVE:
[Question ID]
Thought Process: [Describe the mental model the student should use, very conversational]
Takeaway: [One punchy sentence]
--- (Separator between questions)
"""

    try:
        print("\n" + "="*80, flush=True)
        print(f"🧠 NEURALPATH MENTOR: Analyzing {domain} Performance...", flush=True)
        print("="*80, flush=True)
        print(f"👉 Weak Topics: {weak_topics}", flush=True)
        print(f"👉 Micro Gaps: {micro_gaps}", flush=True)
        print(f"👉 Root Cause: {root_cause}", flush=True)
        print("-"*80, flush=True)

        response = ollama.generate(
            model=OLLAMA_MODEL,
            prompt=prompt,
        )
        text = response.get("response", "")
        
        print(f"✅ AI RESPONSE RECEIVED ({len(text)} characters)", flush=True)
        print("-"*80, flush=True)
        if len(text) > 300:
            print(f"📝 SNIPPET:\n{text[:300]}...", flush=True)
        else:
            print(f"📝 FULL TEXT:\n{text}", flush=True)
        print("="*80 + "\n", flush=True)
        
        summary = "I've reviewed your results, and I see some real potential!"
        reasoning = ["Pattern detection", "Identify symbols", "Foundational check"]
        detailed = []

        # More robust parsing (case-insensitive and handle numbers)
        lower_text = text.lower()
        
        # 1. Summary
        if "summary:" in lower_text:
            s_split = text.split("UMMARY:")[1] if "UMMARY:" in text else text.split("ummary:")[1]
            summary = s_split.split("REASONING:")[0].split("Reasoning:")[0].split("DEEP_DIVE:")[0].split("Deep_Dive:")[0].strip()
        
        # 2. Reasoning
        if "reasoning:" in lower_text:
            r_split = text.split("EASONING:")[1] if "EASONING:" in text else text.split("easoning:")[1]
            reasoning_text = r_split.split("DEEP_DIVE:")[0].split("Deep_Dive:")[0].strip()
            reasoning = [r.strip().lstrip("-*123. ") for r in reasoning_text.split("\n") if r.strip()][:3]
            if not reasoning:
                reasoning = [r.strip() for r in reasoning_text.split(";")][:3]

        # 3. Deep Dive
        if "deep_dive:" in lower_text:
            dd_keyword = "DEEP_DIVE:" if "DEEP_DIVE:" in text else "Deep_Dive:" if "Deep_Dive:" in text else "deep_dive:"
            raw_deep_dive = text.split(dd_keyword)[1].strip()
            parts = raw_deep_dive.split("---")
            for part in parts:
                if "Thought Process:" in part or "thought process:" in part.lower():
                    lines = [l for l in part.strip().split("\n") if l.strip()]
                    if not lines: continue
                    
                    # Target content extraction
                    tp_marker = "Thought Process:" if "Thought Process:" in part else "thought process:"
                    ta_marker = "Takeaway:" if "Takeaway:" in part else "takeaway:"
                    
                    tp = part.split(tp_marker)[1].split(ta_marker)[0].strip() if ta_marker in part else part.split(tp_marker)[1].strip()
                    ta = part.split(ta_marker)[1].strip() if ta_marker in part else "Focus on this concept."
                    
                    # Match with actual result to get metadata
                    orig = next((r for r in to_analyze if r.question_id.lower() in part.lower() or part.lower().find(r.question_id.lower()) != -1), to_analyze[0])
                    detailed.append({
                        "question_id": orig.question_id,
                        "topic": orig.topic,
                        "concept": orig.concept or "General",
                        "is_correct": orig.is_correct,
                        "mentor_thought_process": tp,
                        "key_takeaway": ta
                    })

        logging.info(f"--- Parsed {len(detailed)} deep-dive items ---")
        return summary, reasoning, detailed
    except Exception as e:
        logger.warning("Mentor Deep Dive failed: %s", e)
        return "Keep learning!", [], []
