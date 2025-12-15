#!/usr/bin/env bash
set -e

echo "🔒 Freezing main branch"
git status --porcelain | grep . && {
  echo "❌ Uncommitted changes in root. Commit first."
  exit 1
}

echo "🧹 Resetting sandbox"
rm -rf sandbox/working-copy
mkdir -p sandbox

echo "🧬 Cloning main → sandbox"
rsync -a \
  --exclude node_modules \
  --exclude .git \
  main/ sandbox/working-copy/

cd sandbox/working-copy

echo "🤖 Running Gemini update (SANDBOX ONLY)"
../../.ai/run-gemini.sh \
  ../../.ai/tests/2025-12-16-test-plan.md \
  ../../.ai/reports/2025-12-16-execution.md

echo "🧪 Running sanity checks"
npm install
npm run build || {
  echo "❌ Build failed in sandbox. Aborting."
  exit 1
}

cd ../../

echo "📊 Showing diff (sandbox → main)"
diff -ruN main sandbox/working-copy || true

echo
read -p "✅ Apply these changes to main? (yes/no): " confirm

if [[ "$confirm" == "yes" ]]; then
  echo "🚀 Applying changes"
  rsync -a --delete sandbox/working-copy/ main/
  echo "✅ Main updated safely."
else
  echo "🛑 Aborted. Main untouched."
fi

