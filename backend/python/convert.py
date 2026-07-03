#!/usr/bin/env python3
"""Convert a file to Markdown using Microsoft MarkItDown."""
import sys

def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: convert.py <filepath>", file=sys.stderr)
        sys.exit(1)

    filepath = sys.argv[1]

    try:
        from markitdown import MarkItDown
    except ImportError as exc:
        print(f"ModuleNotFoundError: {exc}", file=sys.stderr)
        sys.exit(2)

    try:
        converter = MarkItDown()
        result = converter.convert(filepath)
        text = getattr(result, "text_content", None) or str(result)
        print(text)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(3)

if __name__ == "__main__":
    main()
