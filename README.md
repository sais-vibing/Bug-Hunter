# ✦ BUG HUNTER ✦
### 2D Educational RPG Dungeon Crawler Web Game

An educational pixel-art web RPG inspired by dark fantasy manhwa (Solo Leveling). Players conquer 30 dungeon gates by solving programming puzzles, fill-in-the-blank code bugs, and defeating dungeon overlords.

## ✨ Features
- **Solo Leveling / Dark Fantasy Aesthetic**: System window UI, glowing rank badges, pixel sprites, dynamic particles, and retro sound effects.
- **Dynamic Curriculum Generation with Ollama**: Connects locally to `gemma3:1b` (via built-in `/api/ollama` proxy) with instant fallback to built-in curricula.
- **Python & JavaScript Support**:
  - Full 30-level authentic Python pathway (`# que - what is ...?`)
  - 30-level JavaScript fundamentals pathway
- **Strict Hardcoded Answer Validation**: AI never validates correctness directly, preventing hallucinations.
- **Combat System**:
  - Real-time fireball projectile attacks
  - 2-strike system with Shadow Pet hint unlock
  - MCQ and 20s speed-typing challenges
  - Level map with 30 interactive gates

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local server**:
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

4. **(Optional) Local AI with Ollama**:
   - Ensure Ollama is running (`ollama run gemma3:1b`).
   - The game automatically proxies requests to `http://127.0.0.1:11434` without CORS issues.
