const fs = require('fs');
const { spawn } = require("child_process");

process.stdin.setRawMode(true)

let userChoice = 0
let isPaused = true
let playerProcess = undefined

let elapsedDuration = 0;
let totalDuration = 0;

const speeds = [1, 1.25, 1.5, 2];
let speedIndex = 0;
let currentSpeed = speeds[speedIndex];

function playCurrentSong(resumeFrom = 0) {
    if (playerProcess !== undefined) {
        playerProcess.kill("SIGINT");
    }
    elapsedDuration = resumeFrom;
    totalDuration = 0;
    getTotalDuration(`./songs/${songMenu[userChoice]}`);

    const args = ["--intf", "rc", "--rate", String(currentSpeed)];
    if (resumeFrom > 0) {
        args.push("--start-time", String(Math.floor(resumeFrom)));
    }
    args.push(`./songs/${songMenu[userChoice]}`);

    playerProcess = spawn('vlc', args);
    isPaused = false;
    listSongs();
}

function nextSong() {
    userChoice = (userChoice + 1) % songMenu.length;
    playCurrentSong();
}

process.stdin.on('data', (data) => {
    // n: Next
    if (data[0] === 0x6e) {
        nextSong();
        return;
    }
    // b: Back
    if (data[0] === 0x62) {
        userChoice -= 1;
        if (userChoice < 0) userChoice = songMenu.length - 1;
        playCurrentSong();
        return;
    }
    // t: Toggle Speed
    if (data[0] === 0x74) {
        speedIndex = (speedIndex + 1) % speeds.length;
        currentSpeed = speeds[speedIndex];
        if (playerProcess) {
            playCurrentSong(elapsedDuration);
        } else {
            listSongs();
        }
        return;
    }

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
            } else if (data[2] === 0x43) { // Right Arrow (Seek Forward)
                if (playerProcess) {
                    playerProcess.stdin.write("seek +10\n");
                    elapsedDuration += 10;
                    if (totalDuration > 0 && elapsedDuration > totalDuration) {
                        elapsedDuration = totalDuration;
                    }
                    listSongs();
                }
            } else if (data[2] === 0x44) { // Left Arrow (Seek Backward)
                if (playerProcess) {
                    playerProcess.stdin.write("seek -10\n");
                    elapsedDuration -= 10;
                    if (elapsedDuration < 0) elapsedDuration = 0;
                    listSongs();
                }
            }
        }
        if (data[0] === 0x03) { // Ctrl+C
            process.exit(0);
        }
        return; // Don't fall through
    }
    if (data[0] === 0x03) { // Ctrl+C (fallback)
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

    // Progress Bar
    const ratio = Math.min(1, Math.max(0, elapsedDuration / (totalDuration || 1)));
    const barLength = 40;
    const filledLength = Math.round(ratio * barLength);
    const filledBars = '='.repeat(filledLength);
    const emptyBars = '-'.repeat(barLength - filledLength);

    process.stdout.write(`\x1b[33m[${filledBars}${emptyBars}]\x1b[0m\n`);

    const formattedElapsed = Math.round(elapsedDuration);
    const formattedTotal = Math.round(totalDuration);
    process.stdout.write(`Time: ${formattedElapsed}s / ${formattedTotal}s\n\n`);

    // Status
    process.stdout.write(`State: ${isPaused ? '\x1b[31mPaused\x1b[0m' : '\x1b[32mPlaying\x1b[0m'} | `);
    process.stdout.write(`Speed (t): \x1b[35m${currentSpeed}x\x1b[0m\n\n`);

    process.stdout.write(`\n[ $] \n`);
}

function getTotalDuration(songPath) {
    const afinfoProcess = spawn('afinfo', [songPath]);

    afinfoProcess.stdout.on('data', (data) => {
        const output = data.toString();
        try {
            totalDuration = Number(
                output.split("estimated duration: ")[1].split(".")[0]
            );
            listSongs(); // Re-render to show total duration
        } catch (e) {
            totalDuration = 0; // fallback
        }
    });
}

listSongs();

// Continuous update loop
setInterval(() => {
    if (isPaused === false && playerProcess !== undefined) {
        elapsedDuration += 0.5 * currentSpeed; // Update every 500ms scaled by speed

        if (totalDuration > 0 && elapsedDuration >= totalDuration) {
            nextSong();
        }
        listSongs();
    }
}, 500);