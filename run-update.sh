#!/bin/bash
set -e

TIMESTAMP=$(date +"%d-%m-%Y-%I_%M-%p")
UPDATE_DIR="/mnt/d/ai-workspace/studyhub-updates/studyhub-update-$TIMESTAMP"

mkdir -p "$UPDATE_DIR"

echo "🔍 Running Gemini agents..."

gemini < .agents/ui-agent.md > /tmp/ui.output.md
gemini < .agents/module-agent.md > /tmp/module.output.md
gemini < .agents/state-agent.md > /tmp/state.output.md

echo "🧠 Coordinating..."

cat /tmp/*.output.md | gemini < .agents/coordinator.md > /tmp/final.plan.md

echo "📝 Applying changes manually or via Claude (recommended)"

git diff > "$UPDATE_DIR/patch.diff"

echo "# StudyHub Update $TIMESTAMP" > "$UPDATE_DIR/README.md"
echo "" >> "$UPDATE_DIR/README.md"
cat /tmp/final.plan.md >> "$UPDATE_DIR/README.md"

git add .
git commit -m "update($TIMESTAMP): automated AI update"
git push

echo "✅ Update complete"
