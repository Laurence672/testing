const startPauseButton = document.getElementById("start-pause");
const resetButton = document.getElementById("reset");
const timerLabel = document.getElementById("timer-label");
const timeRemaining = document.getElementById("time-remaining");
const focusLengthLabel = document.getElementById("focus-length");
const breakLengthLabel = document.getElementById("break-length");
const lengthButtons = document.querySelectorAll(".length-controls button");

let focusMinutes = 25;
let breakMinutes = 5;
let isRunning = false;
let isFocus = true;
let remainingSeconds = focusMinutes * 60;
let timerInterval = null;

const updateDisplay = () => {
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  timeRemaining.textContent = `${minutes}:${seconds}`;
  timerLabel.textContent = isFocus ? "Focus" : "Break";
};

const syncLengths = () => {
  focusLengthLabel.textContent = focusMinutes;
  breakLengthLabel.textContent = breakMinutes;
};

const setTimer = (minutes) => {
  remainingSeconds = minutes * 60;
  updateDisplay();
};

const toggleTimer = () => {
  if (isRunning) {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startPauseButton.textContent = "Start";
    return;
  }

  isRunning = true;
  startPauseButton.textContent = "Pause";
  timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      updateDisplay();
      return;
    }

    isFocus = !isFocus;
    setTimer(isFocus ? focusMinutes : breakMinutes);
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  isFocus = true;
  startPauseButton.textContent = "Start";
  focusMinutes = 25;
  breakMinutes = 5;
  syncLengths();
  setTimer(focusMinutes);
};

const adjustLength = (target, delta) => {
  if (isRunning) return;
  if (target === "break") {
    breakMinutes = Math.min(30, Math.max(1, breakMinutes + delta));
    breakLengthLabel.textContent = breakMinutes;
    if (!isFocus) {
      setTimer(breakMinutes);
    }
    return;
  }

  focusMinutes = Math.min(60, Math.max(5, focusMinutes + delta));
  focusLengthLabel.textContent = focusMinutes;
  if (isFocus) {
    setTimer(focusMinutes);
  }
};

startPauseButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

lengthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const target = button.dataset.target;
    adjustLength(target, action === "increase" ? 1 : -1);
  });
});

syncLengths();
updateDisplay();
