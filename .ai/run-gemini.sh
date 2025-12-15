#!/bin/bash
set -e

PROMPT_FILE="$1"
OUTPUT_FILE="$2"

if [ -z "$PROMPT_FILE" ] || [ -z "$OUTPUT_FILE" ]; then
  echo "Usage: run-gemini.sh <prompt.md> <output.md>"
  exit 1
fi

gemini <<EOF > "$OUTPUT_FILE"
SYSTEM:
You are a planning-only AI.
You MUST NOT use tools.
You MUST NOT execute commands.
You MUST NOT assume execution.
You output plain Markdown text only.

USER:
$(cat "$PROMPT_FILE")
EOF
