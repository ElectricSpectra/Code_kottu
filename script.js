let timerInterval;
let hours = 0;
let minutes = 0;
let seconds = 0;
let isRunning = false;

const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');

function updateDisplay() {
    hoursDisplay.textContent = hours.toString().padStart(2, '0');
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(timerInterval);
                isRunning = false;
                createThumbsUp();
                return;
            }

            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }

            updateDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    hours = 0;
    minutes = 0;
    seconds = 0;
    updateDisplay();
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
}

function setTimer() {
    hours = parseInt(hoursInput.value) || 0;
    minutes = parseInt(minutesInput.value) || 0;
    seconds = parseInt(secondsInput.value) || 0;
    updateDisplay();
}

function createThumbsUp() {
    const container = document.getElementById('thumbs-container');
    
    // Create 10 thumbs up emojis
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const thumb = document.createElement('div');
            thumb.className = 'thumb';
            thumb.textContent = '👍';
            thumb.style.left = Math.random() * 100 + 'vw';
            container.appendChild(thumb);

            // Remove the thumb after animation
            setTimeout(() => {
                container.removeChild(thumb);
            }, 2000);
        }, i * 200); // Stagger the appearance of thumbs
    }
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
hoursInput.addEventListener('change', setTimer);
minutesInput.addEventListener('change', setTimer);
secondsInput.addEventListener('change', setTimer);

updateDisplay();