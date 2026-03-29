"""
Turn raw compiler output + RAG + user history into a friendly tutoring narrative.
"""

from __future__ import annotations
import logging
import re
import ollama

from app.compiler import map_python_error_to_topic
from app.models import CompileResult, QuestionResult, QuestionAnalysis
from app.rag import RetrievedDoc

logger = logging.getLogger(__name__)

# Config for local LLM
OLLAMA_MODEL = "llama3"


# ─────────────────────────────────────────────
#  Compiler Error Explainer (original feature)
# ─────────────────────────────────────────────

def _generate_llm_explanation(
    result: CompileResult,
    retrieved: list[RetrievedDoc],
    weak_topics: list[str],
    common_errors: list[str],
) -> tuple[str, list[str]] | None:
    topic = result.mapped_topic or map_python_error_to_topic(
        result.error_type or "",
        result.raw_error or "",
    )
    rag_context = "\n---\n".join([d.text for d in retrieved])
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

        if "Actionable Tips" in text or "What to try next" in text:
            sections = text.split("Tips" if "Tips" in text else "next")
            main_part = sections[0].strip()
            tips_part = sections[1].strip() if len(sections) > 1 else ""
            tips = [line.strip().lstrip("-*123. ") for line in tips_part.split("\n")
                    if line.strip().startswith(("-", "*", "1.", "2.", "3."))]
            return main_part, tips

        return text, _suggestions_for_topic(topic, result.faulty_line)
    except Exception as e:
        logger.warning("Ollama generation failed: %s. Falling back to rule-based.", e)
        return None


def _topic_plain_english(topic: str | None) -> str:
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
    et = result.error_type or "Error"
    line = result.line_number
    where = f" around line {line}" if line else ""
    return (
        f'Python reported a "{et}"{where}. That sounds scary, but it is just '
        "the computer asking for a small fix. You are still learning, and this is normal."
    )


def _decode_error_in_simple_words(result: CompileResult) -> str:
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
    return (
        "Here is what Python said, in short: "
        f"{(result.raw_error or 'something went wrong while reading your code.')}"
    )


def _suggestions_for_topic(topic: str | None, faulty_line: str | None) -> list[str]:
    t = topic or "general"
    base = [
        "Save your file and run the checker again after each tiny change.",
        "Compare your line with a small example from a tutorial side by side.",
    ]
    if t == "control_flow_syntax":
        return ["Find the `if`, `for`, `while`, `def`, `try`, or `class` line and add `:` at the end.", *base]
    if t == "indentation":
        return ["Delete the spaces on the problem line and press Tab once (4 spaces) to match surrounding lines.", *base]
    if t == "variables_scope":
        return ["Search for where the name is first created (`=` or `def`). Use that exact spelling.", *base]
    if t == "data_types":
        return ["Print the values with `print(type(x))` to see what each piece is.", *base]
    if t == "lists_indexing":
        return ["Check the list length with `len(items)` before using a big index.", *base]
    if t == "dicts_keys":
        return ["Print `my_dict.keys()` to see allowed keys.", *base]
    if faulty_line:
        return [f"Look closely at this line: `{faulty_line.strip()[:200]}`", *base]
    return base


def build_personalized_explanation(
    result: CompileResult,
    retrieved: list[RetrievedDoc],
    weak_topics: list[str],
    common_errors: list[str],
) -> tuple[str, list[str]]:
    llm_res = _generate_llm_explanation(result, retrieved, weak_topics, common_errors)
    if llm_res:
        return llm_res

    topic = result.mapped_topic or map_python_error_to_topic(
        result.error_type or "", result.raw_error or "",
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
            parts.append("This matches an area you have bumped into before. Extra practice here will pay off soon.")
        else:
            others = ", ".join(_topic_plain_english(w) for w in weak_topics[:3])
            parts.append(f"You have also had trouble with: {others}. Patterns you learn while fixing this error will help there too.")

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
    parts.append("Take a breath, change one small thing, and try again. Small steps are how every good programmer learned.")

    return "\n".join(parts), _suggestions_for_topic(topic, result.faulty_line)


# ─────────────────────────────────────────────
#  AI Mentor: Performance Summary (NEW FEATURE)
# ─────────────────────────────────────────────

async def generate_learning_summary(
    domain: str,
    weak_topics: list[str],
    micro_gaps: list[str],
    root_cause: str,
    results: list[QuestionResult] = None
) -> tuple[str, list[str], list[dict]]:
    """
    Generate a mentor-style summary and detailed thought process for missed concepts.
    Returns: (summary, reasoning_chain, detailed_report)
    """
    results = results or []

    # Prioritize missed questions for deep-dive; include enough context for richer UI cards.
    missed = [r for r in results if not r.is_correct]
    correct = [r for r in results if r.is_correct]
    to_analyze = (missed + correct)[:8]

    detailed_report_context = "\n".join([
        f"- ID: {r.question_id} | Topic: {r.topic} | Concept: {r.concept} | Correct: {r.is_correct}"
        for r in to_analyze
    ])

    prompt = f"""[PERSONA]
You are an experienced teacher and senior developer who genuinely loves helping students understand things. You use the Feynman Technique — if something is complex, you explain it with a simple real-world analogy first. Your tone is: Friendly, Encouraging, and a little bit Storytelling. You are NOT an AI assistant. You are a real person who cares about this student's growth.

Your communication rules (inspired by Mr. Ranedeer AI Tutor principles):
1. Use "you" — always talk directly to the student
2. Start with empathy: acknowledge what they tried, not just what they got wrong
3. Use analogies and real-world examples whenever possible (Feynman Technique)
4. Ask rhetorical questions to make them think: "Have you noticed how... ?" or "Think about it this way..."
5. Never repeat the same explanation twice — if something is hard, try a different angle
6. Be specific to THEIR mistakes. Not generic. Not textbook.
7. NEVER say "As your mentor", "I've identified", "let's dive deep", or any AI phrases
8. Keep sentences short. Use natural pauses. Write like you're speaking.

[STUDENT CONTEXT]
Domain: {domain}
Struggling with: {', '.join(weak_topics)}
Specific confusion points: {', '.join(micro_gaps)}  
Root blocker: {root_cause}

Questions they just answered:
{detailed_report_context}

[YOUR RESPONSE — use EXACTLY these section headers]

SUMMARY:
(2-3 sentences. Talk to them directly. Acknowledge what happened, be real about what needs work, but keep it warm. Example: "Hey, so you actually did better than you think — but there's one thing tripping you up hard, and it's [X]. Once you fix that, the rest clicks.")

REASONING:
- (Why they struggled — explain the WHY behind the confusion, not just the what. Use "you probably thought..." or "most people mix this up because...")
- 
- 

DEEP_DIVE:
[exact question ID]
Thought Process: (Walk them through how to THINK about this problem. Use an analogy. Start with "Okay so imagine..." or "Think of it like...". Then walk through the actual logic step-by-step. This should feel like you're thinking out loud with them.)
Takeaway: (One memorable rule. Make it stick. Like a golden rule they'll remember at 2am.)
---
[repeat DEEP_DIVE for each question if there are multiple]
"""

    try:
        print("\n" + "="*80, flush=True)
        print(f"🧠 NEURALPATH MENTOR: Analyzing {domain} Performance...", flush=True)
        print("="*80, flush=True)
        print(f"👉 Weak Topics: {weak_topics}", flush=True)
        print(f"👉 Micro Gaps: {micro_gaps}", flush=True)
        print(f"👉 Root Cause: {root_cause}", flush=True)
        print("-"*80, flush=True)

        response = ollama.generate(model=OLLAMA_MODEL, prompt=prompt)
        text = response.get("response", "")

        print(f"✅ AI RESPONSE RECEIVED ({len(text)} characters)", flush=True)
        print("-"*80, flush=True)
        print(f"📝 SNIPPET:\n{text[:300]}...", flush=True)
        print("="*80 + "\n", flush=True)

        # ── Parse Summary ──
        summary = "Great effort! Keep pushing your fundamentals."
        s_match = re.search(r'\*?\*?SUMMARY\*?\*?:?\s*(.*?)(?=\n\n|\*?\*?REASONING|\*?\*?DEEP_DIVE|$)', text, re.DOTALL | re.I)
        if s_match:
            summary = s_match.group(1).strip()
        if not summary:
            summary = f"You are improving in {domain}, and your current blocker is {root_cause}. We will fix it step by step."

        # ── Parse Reasoning ──
        reasoning = []
        r_match = re.search(r'\*?\*?REASONING\*?\*?:?\s*(.*?)(?=\n\n|\*?\*?DEEP_DIVE|$)', text, re.DOTALL | re.I)
        if r_match:
            lines = r_match.group(1).strip().split('\n')
            reasoning = [l.strip().lstrip('-*123. ') for l in lines if len(l.strip()) > 5][:5]
        if len(reasoning) == 0:
            reasoning = [
                f"Your core blocker is {root_cause}, and it affects dependent topics.",
                "You can recover faster by dry-running small examples before coding.",
                "Fixing one foundational concept will improve multiple downstream questions.",
            ]

        # ── Parse Deep Dive sections (split by --- separator) ──
        detailed = []
        sections = re.split(r'\n---\n?', text)
        for i, section in enumerate(sections):
            tp_match = re.search(r'Thought Process:?\s*(.*?)(?=Takeaway:|$)', section, re.DOTALL | re.I)
            ta_match = re.search(r'Takeaway:?\s*(.*?)$', section, re.DOTALL | re.I)

            if tp_match and to_analyze:
                # Try to match question ID in text, fallback to index order
                matched = None
                for r in to_analyze:
                    if r.question_id.lower() in section.lower():
                        matched = r
                        break
                if not matched:
                    matched = to_analyze[len(detailed) % len(to_analyze)]

                detailed.append({
                    "question_id": matched.question_id,
                    "topic": matched.topic,
                    "concept": matched.concept or "General",
                    "is_correct": matched.is_correct,
                    "mentor_thought_process": tp_match.group(1).strip(),
                    "key_takeaway": ta_match.group(1).strip() if ta_match else "Master this concept step by step."
                })

        # Fallback: if format drifts or parse is partial, fill missing cards deterministically.
        seen_ids = {d["question_id"] for d in detailed}
        missing_items = [r for r in to_analyze if r.question_id not in seen_ids]
        if missing_items:
            logger.warning("Deep-dive parse missing %s item(s); adding deterministic fallback cards", len(missing_items))
            for r in missing_items:
                concept = r.concept or "General"
                confusion_hint = next(
                    (g for g in micro_gaps if concept.lower() in g.lower() or g.lower() in concept.lower()),
                    concept,
                )
                detailed.append({
                    "question_id": r.question_id,
                    "topic": r.topic,
                    "concept": concept,
                    "is_correct": r.is_correct,
                    "mentor_thought_process": (
                        f"You likely mixed up {confusion_hint} while solving this question. "
                        f"First, restate the goal in one line. Then trace the logic for {concept} step by step "
                        f"using a tiny dry run. Finally, validate edge cases before finalizing your answer. "
                        f"This reduces confusion and builds strong fundamentals from {root_cause}."
                    ),
                    "key_takeaway": (
                        f"Before coding, do a 3-step dry run for {concept} and check one edge case."
                    ),
                })

        logger.info(f"--- Parsed {len(detailed)} deep-dive items ---")
        return summary, reasoning, detailed

    except Exception as e:
        print(f"❌ AI Mentor generation failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
        return "NeuralPath Mentor system is currently recalibrating.", ["Keep practicing basic syntax."], []
