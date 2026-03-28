from __future__ import annotations

from ai.retriever import retrieve_error_docs
from ai.vector_store import add_document, initialize_db


def _doc(
    doc_id: str,
    error_type: str,
    pattern: str,
    topic: str,
    meaning: str,
    why: str,
    fix: str,
    wrong_example: str,
    correct_example: str,
):
    text = "\n".join(
        [
            "Language: Python",
            f"Error Type: {error_type}",
            f"Pattern: {pattern}",
            f"Topic: {topic}",
            f"Meaning: {meaning}",
            f"Why: {why}",
            f"Fix: {fix}",
            f"Wrong Example: {wrong_example}",
            f"Correct Example: {correct_example}",
        ]
    )
    metadata = {
        "language": "Python",
        "error_type": error_type,
        "pattern": pattern,
        "topic": topic,
    }
    return doc_id, text, metadata


KNOWLEDGE_BASE = [
    _doc("py-001", "SyntaxError", "expected ':'", "control_flow_syntax", "You forgot to add a colon at the end of a block-opening statement.", "Python needs a colon after statements like if, for, while, def, class, try, and else to start the indented block.", "Add a colon ':' at the end of the statement.", "if x > 5", "if x > 5:\n    print(x)"),
    _doc("py-002", "SyntaxError", "invalid syntax", "syntax_general", "The overall shape of the code does not follow Python's grammar.", "Python found a token, keyword, or symbol in a place where it does not belong.", "Check nearby punctuation, missing brackets, commas, or misspelled keywords.", "print('hello'", "print('hello')"),
    _doc("py-003", "IndentationError", "expected an indented block", "indentation", "Python expected the next line to be indented.", "A line ending in ':' must be followed by an indented block.", "Indent the next line with 4 spaces.", "if x > 0:\nprint(x)", "if x > 0:\n    print(x)"),
    _doc("py-004", "IndentationError", "unexpected indent", "indentation", "A line was indented even though Python was not expecting a new block.", "Extra spaces were added where the code should have stayed aligned with the previous block.", "Remove the extra indentation so the line lines up correctly.", "print('a')\n    print('b')", "print('a')\nprint('b')"),
    _doc("py-005", "TabError", "inconsistent use of tabs and spaces", "indentation", "The file mixes tabs and spaces for indentation.", "Python treats tabs and spaces differently, so mixed indentation can break block structure.", "Use only spaces, ideally 4 per indentation level.", "if x > 0:\n\tprint(x)\n    print(y)", "if x > 0:\n    print(x)\n    print(y)"),
    _doc("py-006", "NameError", "name is not defined", "variables_scope", "You used a variable or function name that Python does not know yet.", "The name may be misspelled, used before assignment, or missing quotes if you meant a string.", "Define the name first, fix the spelling, or wrap plain text in quotes.", "print(total)\n# total was never created", "total = 10\nprint(total)"),
    _doc("py-007", "UnboundLocalError", "local variable referenced before assignment", "variables_scope", "A function tried to use a local variable before giving it a value.", "Inside a function, assigning to a name makes Python treat it as local unless told otherwise.", "Assign the value before using it, or pass it into the function.", "def show():\n    print(x)\n    x = 5", "def show():\n    x = 5\n    print(x)"),
    _doc("py-008", "TypeError", "can only concatenate str", "data_types", "You tried to join text with a non-text value directly.", "Python does not automatically merge strings and numbers in concatenation.", "Convert the non-string value with str(...).", "age = 12\nprint('Age: ' + age)", "age = 12\nprint('Age: ' + str(age))"),
    _doc("py-009", "TypeError", "unsupported operand type", "data_types", "You used an operator with incompatible types.", "Operators like +, -, or / only work on types that support that operation together.", "Convert the values to compatible types before using the operator.", "print('3' - 1)", "print(int('3') - 1)"),
    _doc("py-010", "TypeError", "object is not callable", "functions_calls", "You tried to call something with parentheses even though it is not a function.", "A variable may have overwritten a function name, or parentheses were used on a plain value.", "Check what the name stores before calling it.", "items = [1, 2]\nitems()", "def items():\n    return [1, 2]\nitems()"),
    _doc("py-011", "TypeError", "missing required positional argument", "functions_calls", "A function was called without all the arguments it needs.", "The function definition expects more inputs than the call provided.", "Pass every required argument in the right order.", "def add(a, b):\n    return a + b\nadd(1)", "def add(a, b):\n    return a + b\nadd(1, 2)"),
    _doc("py-012", "IndexError", "list index out of range", "lists_indexing", "You asked for a list position that does not exist.", "Lists are zero-indexed, and valid indexes go from 0 to len(list)-1.", "Check the list length and use a valid index.", "items = ['a']\nprint(items[1])", "items = ['a']\nprint(items[0])"),
    _doc("py-013", "KeyError", "missing dictionary key", "dicts_keys", "You asked a dictionary for a key that is not stored in it.", "Dictionary lookup with square brackets fails if the key does not exist.", "Use the correct key, check membership first, or use get().", "student = {'name': 'Ava'}\nprint(student['age'])", "student = {'name': 'Ava'}\nprint(student.get('age'))"),
    _doc("py-014", "ValueError", "invalid literal for int()", "data_conversion", "Python could not turn the given text into an integer.", "The string contains characters that are not valid in a whole number.", "Clean the input or only convert strings that look like numbers.", "int('12a')", "int('12')"),
    _doc("py-015", "ValueError", "too many values to unpack", "assignment_unpacking", "The number of variables on the left does not match the number of values on the right.", "Unpacking expects the counts to line up unless you use * to collect extras.", "Match both sides or use starred unpacking.", "a, b = [1, 2, 3]", "a, b, c = [1, 2, 3]"),
    _doc("py-016", "AttributeError", "object has no attribute", "objects_attributes", "You tried to use a method or property that the object does not have.", "Different Python types support different attributes and methods.", "Check the type and use a method that belongs to that object.", "name = 'Ada'\nname.append('!')", "items = ['Ada']\nitems.append('!')"),
    _doc("py-017", "ZeroDivisionError", "division by zero", "math_basics", "A number was divided by zero.", "Division by zero is undefined, so Python stops with an error.", "Make sure the denominator is not zero before dividing.", "print(10 / 0)", "denominator = 2\nprint(10 / denominator)"),
    _doc("py-018", "SyntaxError", "EOL while scanning string literal", "strings_syntax", "A string started but never closed before the line ended.", "Python needs matching opening and closing quotes around text.", "Close the string with the same quote character you started with.", "print('hello)", "print('hello')"),
    _doc("py-019", "SyntaxError", "unexpected EOF while parsing", "brackets_syntax", "Python reached the end of the file while still waiting for something to close.", "This usually means a bracket, parenthesis, or string quote was left open.", "Close the unfinished bracket, parenthesis, or string.", "numbers = [1, 2, 3", "numbers = [1, 2, 3]"),
    _doc("py-020", "SyntaxError", "unmatched ')'", "brackets_syntax", "There is a closing bracket or parenthesis without a matching opening one.", "Python tracks opening and closing symbols in pairs.", "Remove the extra closing symbol or add the missing opening one.", "print('hi'))", "print('hi')"),
    _doc("py-021", "ModuleNotFoundError", "No module named", "imports", "Python could not find the module you tried to import.", "The module name may be wrong or the package may not be installed in the current environment.", "Check the spelling and install the package if needed.", "import numppy", "import numpy"),
    _doc("py-022", "ImportError", "cannot import name", "imports", "Python found the module but not the specific name you requested.", "The imported symbol may be misspelled, unavailable, or located in a different module.", "Verify the exported name and import path.", "from math import square_root", "from math import sqrt"),
    _doc("py-023", "SyntaxError", "can't assign to function call", "assignment_syntax", "You tried to put a value into something that is not a variable.", "Only names, attributes, and indexes can appear on the left side of =.", "Assign the result to a variable instead.", "print('hi') = 3", "message = 'hi'\nprint(message)"),
    _doc("py-024", "TypeError", "'int' object is not iterable", "loops_iterables", "Python expected something it could loop over, but got a single integer.", "for loops need an iterable like a list, string, tuple, or range.", "Wrap values in a list or use range() when counting.", "for x in 5:\n    print(x)", "for x in range(5):\n    print(x)"),
    _doc("py-025", "ValueError", "not enough values to unpack", "assignment_unpacking", "There are fewer values than variables during unpacking.", "Python cannot fill every variable on the left if the right side is too short.", "Reduce the number of variables or provide more values.", "a, b, c = [1, 2]", "a, b = [1, 2]"),
]


def seed_database() -> tuple[int, int]:
    initialize_db()
    inserted = 0
    skipped = 0
    for doc_id, text, metadata in KNOWLEDGE_BASE:
        if add_document(doc_id, text, metadata):
            inserted += 1
        else:
            skipped += 1
    return inserted, skipped


if __name__ == "__main__":
    inserted_count, skipped_count = seed_database()
    print(f"Seeded compiler_errors collection: inserted={inserted_count}, skipped={skipped_count}")
    print()
    print("query: SyntaxError expected ':'")
    top_docs = retrieve_error_docs("SyntaxError", "expected ':'", "if x > 5")
    for index, doc in enumerate(top_docs, start=1):
        print(f"\nTop {index} retrieved doc")
        print(doc["text"])
