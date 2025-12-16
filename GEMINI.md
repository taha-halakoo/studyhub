# StudyHub OS - AI Workspace Context

## Project Overview
**StudyHub OS** is a comprehensive, React-based productivity dashboard designed as a "Secure Access Terminal" for students and professionals. It features a futuristic, gamified UI with modules for task management, focus tracking, note-taking, and more.

### Tech Stack
- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Cyber" & "Zen" themes)
- **State Management:** Zustand
- **Backend/Auth:** Supabase
- **Icons:** Lucide React

## Architecture
The application uses a **Monolithic Client-Side** architecture with lazy-loaded modules.

- **Entry Point:** `main/src/main.tsx` -> `main/src/App.tsx`
- **Routing:** Custom state-based routing (`activeView` state), not `react-router`.
- **Modules:** located in `main/components/modules/`, lazy-loaded in `App.tsx`.
- **UI Components:** Reusable components in `main/components/ui/`.
- **Context:** Global state provided via `AppProvider` in `main/context/AppContext.tsx`.

## AI Development Workflow
This project operates under a strict **AI Constitution**. All changes must follow the "Test-First" rule.

### 1. The Constitution (`AI_CONSTITUTION.md`)
- **Mandatory Tests:** Every feature/fix must have a corresponding test *before* implementation.
- **Verification:** Changes are rejected if they lack tests or fail verification.

### 2. Update Protocol (`run-update.sh`)
**NEVER** modify `main/` directly. Always use the sandbox workflow:
1.  **Plan:** Analyze requirements and create a test plan in `.ai/tests/`.
2.  **Execute:** The system runs `run-update.sh`, which:
    - Clones `main/` to `sandbox/working-copy/`.
    - Applies changes in the sandbox.
    - Runs tests and builds.
    - Shows a diff for approval.
3.  **Apply:** If approved, changes are synced back to `main/`.

### 3. Directory Structure
```
/mnt/d/ai-workspace/studyhub/
├── main/                 # Source code (React + Vite)
│   ├── components/       # UI and Feature components
│   ├── context/          # React Context (Global State)
│   ├── lib/              # Utilities (Supabase, AI, etc.)
│   └── stores/           # Zustand stores
├── .ai/                  # AI working directory
│   ├── plans/            # Implementation plans
│   ├── reports/          # Execution reports
│   └── tests/            # Test plans
├── sandbox/              # Temporary build/test environment
├── .agents/              # Agent persona definitions
├── AI_CONSTITUTION.md    # Governing rules
└── run-update.sh         # Main update script
```

## Key Commands
Run these from the `main/` directory:

- **Start Dev Server:** `npm run dev`
- **Build Production:** `npm run build` (Runs `tsc` + `vite build`)
- **Lint Code:** `npm run lint`

## Conventions
- **Naming:** PascalCase for components (`TiltCard.tsx`), camelCase for hooks/functions.
- **Styling:** Tailwind utility classes preferred over custom CSS.
- **Imports:** Absolute imports or relative imports that maintain clean structure.
- **Safety:** Always verify compilation (`npm run build`) in the sandbox before finalizing.
