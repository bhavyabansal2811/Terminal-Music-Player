# 🎵 Terminal Music Player

A lightweight, terminal-based music player built entirely with **Node.js**. This project demonstrates core CLI development concepts including keyboard-driven interaction, file system handling, and process/child-process management — all without a graphical interface.

## 📌 About the Project

Terminal Music Player is a command-line application that lets users browse, play, pause, seek, and navigate through songs directly from the terminal — using **VLC** as the underlying playback engine, controlled entirely through Node.js. It was built as part of an app development class project to explore how Node.js can be used beyond web servers — specifically for spawning and managing external processes, handling raw keyboard input, and persisting application state to disk.

## ✨ Features

- ▶️ Play audio files directly from the terminal via VLC
- ⏸️ Pause and resume playback
- ⏭️ Skip to next song / ⏮️ go back to previous song
- ⏩ Seek forward and backward (±10 seconds)
- 🎚️ Cycle playback speed (1x, 1.25x, 1.5x, 2x)
- 🔀 Shuffle mode for random song selection
- 🔁 Repeat mode to loop the current song
- 📈 Live progress bar with elapsed/total duration
- 📂 Automatically reads and lists songs from a local `songs/` folder
- 📊 Persistent play history (total songs played, total listening time, recently played list) saved to `history.json`
- 🧠 Demonstrates process spawning and management in Node.js (VLC + `afinfo`)
- 🖥️ Clean, bordered terminal UI with live status display

## 🛠️ Built With

- **Node.js** — core runtime
- **File System (`fs`) module** — for reading the songs directory and reading/writing `history.json`
- **Child Process (`child_process`) module** — for spawning and controlling VLC as a separate process, and reading song metadata via `afinfo`
- **VLC** — actual audio playback engine, controlled through its `rc` (remote control) interface
- **Raw terminal input (`process.stdin`)** — for detecting individual key presses and arrow-key escape sequences
- **ANSI escape codes** — for the bordered UI, colors, and progress bar rendering

## 📁 Project Structure

\`\`\`
terminal-music-player/
├── songs/          # Folder containing your music files
├── index.js        # Entry point — all application logic
├── history.json    # Auto-generated on first run to store play history
└── README.md
\`\`\`

## ⚙️ Requirements

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- **VLC** installed and available in your system PATH
- **`afinfo`** command available (used to read song duration — comes built-in on macOS)
- A local `songs/` folder containing audio files (e.g., `.mp3`)

## 🚀 Getting Started

Follow these steps to run the project on your local machine:

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/terminal-music-player.git
\`\`\`

### 2. Navigate into the project directory

\`\`\`bash
cd terminal-music-player
\`\`\`

### 3. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Add your music files

Place your \`.mp3\` files inside the \`songs/\` folder.

### 5. Make sure VLC is available

\`\`\`bash
which vlc
\`\`\`

If this doesn't return a path, install VLC and ensure it's added to your system PATH.

### 6. Run the application

\`\`\`bash
node index.js
\`\`\`

## 🎮 Usage

Once the app is running, use the following keys:

| Key | Action |
|---|---|
| \`↑\` / \`↓\` | Move selection up/down |
| \`Enter\` | Play selected song |
| \`p\` | Pause / Resume |
| \`n\` | Next song |
| \`b\` | Previous song |
| \`←\` | Seek backward 10s |
| \`→\` | Seek forward 10s |
| \`t\` | Cycle playback speed |
| \`s\` | Toggle shuffle |
| \`r\` | Toggle repeat |
| \`Ctrl + C\` | Exit and save history |

## 📚 What I Learned

- Building interactive CLI applications with Node.js
- Spawning and controlling external processes (VLC) via \`child_process\`
- Handling raw keyboard input and decoding terminal escape sequences
- Reading local files using the \`fs\` module
- Persisting application state to disk with JSON serialization
- Managing separate application-side state (like elapsed time) alongside an external process's actual playback state
- Structuring a Node.js project for readability and scalability

## made with love by Bhavya Bansal
