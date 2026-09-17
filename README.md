# 🎵 Terminal Music Player

A lightweight, terminal-based music player built entirely with **Node.js**. This project demonstrates core CLI development concepts including command-line interaction, file system handling, and process/child-process management — all without a graphical interface.

## 📌 About the Project

Terminal Music Player is a command-line application that allows users to play, pause, stop, and navigate through songs directly from the terminal. It was built as part of an app development class project to explore how Node.js can be used beyond web servers — specifically for building interactive CLI tools that manage real-time processes and local files.

## ✨ Features

- ▶️ Play audio files directly from the terminal
- ⏸️ Pause and resume playback
- ⏹️ Stop the currently playing track
- ⏭️ Skip to the next song / ⏮️ previous song
- 📂 Automatically reads and lists songs from a local music folder
- 🧠 Demonstrates process spawning and management in Node.js
- 🖥️ Simple, distraction-free command-line interface

## 🛠️ Built With

- **Node.js** — core runtime
- **File System (fs) module** — for reading local audio files
- **Child Process module** — for handling playback as a separate process
- **Command-line interface libraries** (e.g., `inquirer`, `chalk`, `commander` — update based on what you used)

## 📁 Project Structure

terminal-music-player/
├── songs/ # Folder containing music files
├── src/ # Source code
│ └── index.js # Entry point
├── package.json
└── README.md

## ⚙️ Requirements

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- A local folder containing audio files (e.g., `.mp3`)

## 🚀 Getting Started

Follow these steps to run the project on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/terminal-music-player.git
```

### 2. Navigate into the project directory

```bash
cd terminal-music-player
```

### 3. Install dependencies

```bash
npm install
```

### 4. Add your music files

Place your `.mp3` files inside the `songs/` folder.

### 5. Run the application

```bash
node src/index.js
```

## 🎮 Usage

Once the app is running, use the terminal prompts/keys to:

- Select a song to play
- Pause / Resume playback
- Stop the current track
- Skip to next or previous song

## 📚 What I Learned

- Building interactive CLI applications with Node.js
- Handling local files using the `fs` module
- Managing background processes for audio playback
- Structuring a Node.js project for readability and scalability

## made with love by Bhavya Bansal
