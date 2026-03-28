"""
Language-specific compile / check drivers.

MVP: Python uses ast.parse / compile() safely (no execution of user code).

To add C/C++/Java later, implement a small class with the same interface as
PythonCompiler and register it in LANGUAGES.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from app.models import CompileResult, Language


def map_python_error_to_topic(error_type: str, raw_message: str) -> str:
    """
    Map Python exception type + message hints to a coarse learning topic.

    Extend this table as you add more pedagogy / languages.
    """
    msg = raw_message.lower()
    et = error_type

    if et == "SyntaxError":
        if "expected ':'" in msg or "expected \":" in msg:
            return "control_flow_syntax"
        if "invalid syntax" in msg:
            return "syntax_general"
        return syntax_topic_from_message(msg)

    if et == "IndentationError":
        return "indentation"
    if et == "TabError":
        return "indentation"

    if et == "NameError":
        return "variables_scope"
    if et == "UnboundLocalError":
        return "variables_scope"

    if et == "TypeError":
        return "data_types"
    if et == "ValueError":
        return "data_types"

    if et == "IndexError":
        return "lists_indexing"
    if et == "KeyError":
        return "dicts_keys"

    return "general"


def syntax_topic_from_message(msg: str) -> str:
    """Extra SyntaxError heuristics from the message text."""
    if ":" in msg and ("expected" in msg or "invalid" in msg):
        return "control_flow_syntax"
    if "eol" in msg or "end of line" in msg:
        return "syntax_strings_or_line_endings"
    return "syntax_general"


class CompilerDriver(ABC):
    """Contract for per-language checkers."""

    language: Language

    @abstractmethod
    def check(self, source: str) -> CompileResult:
        raise NotImplementedError


class PythonCompiler(CompilerDriver):
    """
    Check Python source with compile() (and ast.parse for clearer errors).

    Does not execute user code — only parses/byte-compiles.
    """

    language = Language.PYTHON

    def check(self, source: str) -> CompileResult:
        # Normalize line endings for stable line numbers
        normalized = source.replace("\r\n", "\n").replace("\r", "\n")
        try:
            # compile() catches the same class of errors; ast.parse can be skipped
            compile(normalized, "<user_input>", "exec", dont_inherit=True)
        except SyntaxError as e:
            return self._from_syntax_error(normalized, e)
        except Exception as e:  # pragma: no cover — compile rarely raises others
            et = type(e).__name__
            topic = map_python_error_to_topic(et, str(e))
            return CompileResult(
                success=False,
                language=self.language,
                error_type=et,
                raw_error=str(e),
                line_number=None,
                faulty_line=None,
                mapped_topic=topic,
            )
        return CompileResult(success=True, language=self.language)

    def _from_syntax_error(self, source: str, e: SyntaxError) -> CompileResult:
        et = type(e).__name__
        raw = e.msg or str(e)
        lineno = e.lineno
        text_line = e.text
        if text_line is None and lineno is not None:
            text_line = self._line_at(source, lineno)
        topic = map_python_error_to_topic(et, raw)
        return CompileResult(
            success=False,
            language=self.language,
            error_type=et,
            raw_error=f"{et}: {raw}" + (f" (line {lineno})" if lineno else ""),
            line_number=lineno,
            faulty_line=(text_line.rstrip("\n") if text_line else None),
            mapped_topic=topic,
            extra={"offset": e.offset},
        )

    @staticmethod
    def _line_at(source: str, lineno: int) -> str | None:
        lines = source.split("\n")
        if 1 <= lineno <= len(lines):
            return lines[lineno - 1]
        return None


class StubFutureCompiler(CompilerDriver):
    """Placeholder for C/C++/Java — raises clear not-implemented result."""

    def __init__(self, language: Language):
        self.language = language

    def check(self, source: str) -> CompileResult:
        return CompileResult(
            success=False,
            language=self.language,
            error_type="NotImplementedError",
            raw_error=(
                f"Language '{self.language.value}' is not implemented yet. "
                "MVP supports Python only."
            ),
            line_number=None,
            faulty_line=None,
            mapped_topic="general",
        )


# Registry: add new compilers here.
LANGUAGES: dict[Language, CompilerDriver] = {
    Language.PYTHON: PythonCompiler(),
    Language.CPP: StubFutureCompiler(Language.CPP),
    Language.C: StubFutureCompiler(Language.C),
    Language.JAVA: StubFutureCompiler(Language.JAVA),
}


def get_compiler(language: Language) -> CompilerDriver:
    return LANGUAGES[language]


def check_source(language: Language, source: str) -> CompileResult:
    """Public entry: route to the right compiler."""
    compiler = get_compiler(language)
    return compiler.check(source)
