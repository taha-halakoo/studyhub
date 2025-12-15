# StudyHub AI Constitution

## Project Name
StudyHub

## Source of Truth
- Main project lives in: /mnt/d/ai-workspace/studyhub
- Update snapshots live in: /mnt/d/ai-workspace/studyhub-updates

## Naming Rules
- No component may be renamed without coordinator approval
- Folder structure is immutable unless explicitly approved
- New modules must match existing module conventions

## Update Protocol
1. Analyze request
2. Assign agents
3. Agents write outputs (no direct commits)
4. Coordinator applies changes
5. Snapshot diff created
6. README summary written
7. Git commit + push

## Forbidden
- Deleting files
- Renaming modules
- Touching .env.local
- Force pushing
