# StudyHub OS

## 🚀 Overview

**StudyHub OS** is a comprehensive, React-based productivity dashboard designed as a "Secure Access Terminal" for students and professionals. It features a futuristic, gamified UI with modules for task management, focus tracking, note-taking, and more. 

Built with the "Liquid Glass" design language, it offers a visually stunning experience with dynamic transparency, fluid animations, and a rich, immersive environment.

## ✨ Features

- **Gamified Productivity:** Turn your tasks into quests and level up your operative profile.
- **Liquid Glass UI:** A premium, "AAA" visual experience with heavy transparency, blur, and fluid distortions.
- **AI Integration (Oracle):** Built-in AI assistant for instant help, code review, and learning.
- **Real-Time Collaboration:** Social modules and live synchronization powered by Supabase.
- **Modular Dashboard:** Lazy-loaded, customizable modules including:
  - Task & Goal Management
  - Focus Tracking (Pomodoro)
  - Journal & Notes (Neural Vault)
  - Gradebook & Academic Tracking
  - CodeLab & Developer Snippets
  - Social Network & Leaderboards

## 🛠 Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Custom "Cyber" & "Liquid Glass" themes)
- **State Management:** Zustand
- **Backend & Auth:** Supabase
- **Icons:** Lucide React
- **Animations:** Framer Motion / Native CSS

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Supabase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/taha-halakoo/studyhub.git
   cd studyhub/main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the `main` directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

The application uses a Monolithic Client-Side architecture with lazy-loaded modules to ensure lightning-fast load times. State is managed globally via Zustand stores, connecting to a real-time Supabase backend for persistent data and live updates.

## 🤝 Contributing

We follow a strict "Test-First" Constitution for all AI and manual contributions. Every feature or bug fix must have a corresponding test plan before implementation.

## 📄 License

This project is licensed under the MIT License.
