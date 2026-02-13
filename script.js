/* ============================================
   VALENTINE ENVELOPE — JavaScript
   ============================================ */

// --- Background Music (Katabi by BINI) ---
let musicPlaying = false;
let musicStarted = false;
const bgMusic = new Audio('katabi.mp3.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

function startMusic() {
    bgMusic.play().then(() => {
        musicPlaying = true;
        musicStarted = true;
        document.getElementById('music-icon').textContent = '🔊';
        document.getElementById('music-toggle').classList.add('playing');
    }).catch(() => {
        // Browser blocked autoplay — will retry on next interaction
        musicStarted = false;
    });
}

function stopMusic() {
    bgMusic.pause();
    musicPlaying = false;
    document.getElementById('music-icon').textContent = '🔇';
    document.getElementById('music-toggle').classList.remove('playing');
}

function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        musicPlaying = true;
        musicStarted = true;
        bgMusic.play();
        document.getElementById('music-icon').textContent = '🔊';
        document.getElementById('music-toggle').classList.add('playing');
    }
}

// --- Enter Site (splash screen click starts music) ---
function enterSite() {
    startMusic();
    showScreen('screen-initial');
}

const heartColors = [
    '#f48fb1', '#f06292', '#ec407a', '#e91e63',
    '#ce93d8', '#ba68c8', '#ab47bc',
    '#ef9a9a', '#e57373', '#ff8a80',
    '#ffcdd2', '#f8bbd0', '#fce4ec',
    '#ff80ab', '#ff4081', '#f50057',
    '#e1bee7', '#d1c4e9', '#c5cae9'
];

const heartShapes = ['❤️', '💕', '💗', '💖', '💓', '💘', '💝', '♥', '🩷', '🤍', '🩵'];

function createFallingHeart() {
    const container = document.getElementById('hearts-container');
    const heart = document.createElement('span');
    heart.classList.add('falling-heart');

    // Random heart style
    const useEmoji = Math.random() > 0.35;
    if (useEmoji) {
        heart.textContent = heartShapes[Math.floor(Math.random() * heartShapes.length)];
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
    } else {
        const size = Math.random() * 16 + 8;
        const color = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }

    heart.style.left = Math.random() * 100 + '%';
    const duration = Math.random() * 6 + 5;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.3;

    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, (duration + 3) * 1000);
}

// Spawn hearts continuously
setInterval(createFallingHeart, 400);
// Initial burst
for (let i = 0; i < 15; i++) {
    setTimeout(createFallingHeart, i * 200);
}

// --- Sparkle Effect ---
function createSparkles(count) {
    const overlay = document.getElementById('sparkle-overlay');
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.width = (Math.random() * 8 + 4) + 'px';
            sparkle.style.height = sparkle.style.width;
            overlay.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1200);
        }, i * 80);
    }
}

// --- Screen Navigation ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
        // Re-trigger the fade-in animation
        const card = target.querySelector('.glass-card');
        if (card) {
            card.classList.remove('fade-in');
            void card.offsetWidth; // force reflow
            card.classList.add('fade-in');
        }
        target.classList.add('active');
    }
}

// --- "Nope/Don't open" path: They refuse to open; we convince them TO open ---
function handleNope(step) {
    createSparkles(8);
    showScreen('screen-nope-' + step);
}

// --- "Open" path: They want to open; we tease them to NOT open first ---
function handleOpen(step) {
    createSparkles(10);
    showScreen('screen-open-' + step);
}

// --- "Don't open" from the open path: They reconsider opening ---
function handleDontOpen(step) {
    createSparkles(6);
    showScreen('screen-dontopen-' + step);
}

// --- Reveal the Letter ---
function revealLetter() {
    createSparkles(40);
    showScreen('screen-letter');

    // Step 1: Open the envelope flap
    setTimeout(() => {
        const flap = document.getElementById('envelope-flap');
        flap.classList.add('open');
        createSparkles(15);

        // Step 2: Fade out the envelope
        setTimeout(() => {
            const envelopeWrapper = document.getElementById('envelope-wrapper');
            envelopeWrapper.classList.add('fade-out');

            // Step 3: Show the full-screen letter
            setTimeout(() => {
                const letter = document.getElementById('letter');
                letter.classList.add('visible');
                createSparkles(30);

                // Ongoing gentle sparkles while reading
                const sparkleInterval = setInterval(() => createSparkles(5), 2500);
                setTimeout(() => clearInterval(sparkleInterval), 25000);
            }, 400);
        }, 1000);
    }, 600);
}

// --- Runaway Button Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const runawayBtns = document.querySelectorAll('.btn-runaway');
    runawayBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const rx = (Math.random() - 0.5) * 2;
            const ry = (Math.random() - 0.5) * 2;
            btn.style.setProperty('--runaway-x', rx);
            btn.style.setProperty('--runaway-y', ry);
        });
    });
});
