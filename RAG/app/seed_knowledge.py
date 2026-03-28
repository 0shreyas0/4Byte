"""
Curated beginner-friendly snippets for common Python compile-time issues
(and a few runtime concepts learners often confuse with "compiler" errors).

Each item gets a stable Chroma id so seeding is idempotent.
"""

from __future__ import annotations

from app.rag import seed_documents

# (id, document_text, metadata.topic)
KNOWLEDGE: list[tuple[str, str, str]] = [
    (
        "py_syn-colon-if",
        """
Topic: if, elif, else, and loops need a colon at the end of the line.

In Python, when you write `if`, `elif`, `else`, `for`, `while`, `try`, `except`,
`with`, `def`, or `class`, the line must end with a colon `:`.
Think of the colon as saying "here comes a block of code that belongs to this line."

Example that is correct:
    if x > 0:
        print("positive")

Common mistake:
    if x > 0
        print("positive")

Fix: add `:` after the condition (or after `else`, `try`, etc.).
""".strip(),
        "control_flow_syntax",
    ),
    (
        "py_indent-blocks",
        """
Topic: Indentation groups code into blocks.

Python uses spaces (usually 4) at the start of a line to show what code
belongs inside `if`, loops, and functions. All lines in the same block
must line up. If one line is shifted wrong, you get IndentationError.

Tips:
- Pick either spaces or tabs and stick to it; mixing breaks things.
- After a line ending with `:`, the next line must be indented one level deeper.

Fix: align the body under the `if` / `def` / loop, or remove extra spaces
so the file looks tidy and consistent.
""".strip(),
        "indentation",
    ),
    (
        "py_name-not-defined",
        """
Topic: NameError means Python does not know that name yet.

You see this when you use a variable or function name before you create it,
or when you spell the name differently than where you defined it.
Python is case-sensitive: `count` and `Count` are different.

Fix checklist:
- Define the variable before use, or import the name.
- Check spelling and capitalization.
- If you meant to use a string, wrap text in quotes.
""".strip(),
        "variables_scope",
    ),
    (
        "py_type-wrong-kind",
        """
Topic: TypeError means you used a value in a way its type does not allow.

Examples: adding a number to text without converting, calling something that is
not a function, or using the wrong number of arguments.

Beginner-friendly fix:
- Read the error message — it often says which types were involved.
- Use `str(number)` before joining with strings, or `int(text)` only when the
  string really holds a whole number.
""".strip(),
        "data_types",
    ),
    (
        "py_index-out-of-range",
        """
Topic: IndexError means the position does not exist in the list.

Valid indexes for a list of length N are 0 up to N-1. Index -1 is the last item.

Fix:
- Check `len(my_list)` before using a risky index.
- Remember the first item is index 0, not 1.
- For loops, use `for item in my_list:` to avoid manual indexes at first.
""".strip(),
        "lists_indexing",
    ),
    (
        "py_key-missing",
        """
Topic: KeyError means that key is not in the dictionary.

Dictionaries map keys to values. If you ask for a key that was never stored,
Python raises KeyError.

Fix:
- Use `if key in d:` before `d[key]`, or use `d.get(key, default)`.
- Print the dict to see what keys you actually have while learning.
""".strip(),
        "dicts_keys",
    ),
    (
        "py_syntax-parens-quotes",
        """
Topic: Parentheses, brackets, and quotes must come in matching pairs.

Every `(`, `[`, `{` needs a matching closing partner. Strings started with `"`
must end with `"` (same for single quotes).

Fix: count brackets from left to right, or use an editor that highlights pairs.

If the error points to the end of a long line, often a missing `)` or `"`
earlier in the line is the real problem.
""".strip(),
        "syntax_general",
    ),
    (
        "py_eol-backslash",
        """
Topic: Unexpected end of line inside a string.

Sometimes a string was opened but not closed, or a line break happened
in the middle of a string without using triple quotes or `\\n`.

Fix:
- Close your string with the same quote style you opened it with.
- For multi-line text, use triple quotes: `\"\"\" ... \"\"\"`.
""".strip(),
        "syntax_strings_or_line_endings",
    ),
    (
        "py_def-missing-colon",
        """
Topic: Function definitions need a colon.

`def name(arguments):` — the colon tells Python the function body is next.

Common mistake:
    def greet(name)
        print("hi")

Correct:
    def greet(name):
        print("hi")
""".strip(),
        "control_flow_syntax",
    ),
    (
        "py_except-indent",
        """
Topic: try / except layout.

After `try:` the indented block runs risky code. `except` lines should line
up with `try`, not be nested inside the try body unless you really mean that.

Mixing these up causes SyntaxError or IndentationError on the except line.
""".strip(),
        "control_flow_syntax",
    ),
]


def run_seed() -> tuple[int, int]:
    """Load KNOWLEDGE into Chroma; safe to call on every startup."""
    ids = [t[0] for t in KNOWLEDGE]
    docs = [t[1] for t in KNOWLEDGE]
    metas = [{"topic": t[2]} for t in KNOWLEDGE]
    return seed_documents(ids, docs, metas)
