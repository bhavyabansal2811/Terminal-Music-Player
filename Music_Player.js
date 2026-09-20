const fs = require('fs');
const { spawn } = require("child_process");

process.stdin.setRawMode(true)

let userChoice = 0
let isPaused = true
let playerProcess = undefined

function playCurrentSong() {
    if (playerProcess !== undefined) {
        playerProcess.kill("SIGINT");
    }
    playerProcess = spawn('vlc', ["--intf", "rc", `./songs/${songMenu[userChoice]}`]);
    isPaused = false;
    listSongs();
}

process.stdin.on('data', (data) => {
    if (data[0] === 0x1b) {
        if (data[1] === 0x5b) {
            if (data[2] === 0x41) { // Up Arrow
                if (userChoice > 0) {
                    userChoice -= 1;
                    listSongs();
                }
            } else if (data[2] === 0x42) { // Down Arrow
                if (userChoice < songMenu.length - 1) {
                    userChoice += 1;
                    listSongs();
                }
            }
        }
        return;
    }
    if (data[0] === 0x03) { // Ctrl+C
        process.exit(0);
    }
    if (data[0] === 0x0d) { // Enter
        playCurrentSong();
    }
    if (data[0] === 0x70) { // p: Play/Pause
        if (playerProcess) {
            playerProcess.stdin.write("pause\n");
            isPaused = !isPaused;
            listSongs();
        }
    }
})

let songMenu = [];
try {
    songMenu = fs.readdirSync('./songs').filter(file => !file.startsWith('.'));
    if (songMenu.length === 0) {
        console.log("No songs found in ./songs/ directory!");
        process.exit(1);
    }
} catch (err) {
    console.log("Could not read ./songs/ directory. Make sure it exists!");
    process.exit(1);
}

function listSongs() {
    // Move cursor to top left and clear downwards (prevents flicker)
    process.stdout.write('\x1b[1;1H\x1b[0J');

    process.stdout.write('\x1b[36m--- CLI Music Player ---\x1b[0m\n\n');

    songMenu.forEach((song, ind) => {
        if (ind === userChoice) {
            process.stdout.write(`\x1b[32m> ${ind} : ${song}\x1b[0m\n`);
        } else {
            process.stdout.write(`  ${ind} : ${song}\n`);
        }
    })

    process.stdout.write('\n');

    // Status
    process.stdout.write(`State: ${isPaused ? '\x1b[31mPaused\x1b[0m' : '\x1b[32mPlaying\x1b[0m'}\n\n`);

    process.stdout.write(`\n[ $] \n`);
}

listSongs();