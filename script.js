// Get DOM elements
const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');

// Initialize state variables
let timer = null;          // Holds the interval ID
let isRunning = false;     // Tracks if the stopwatch is running
let startTime = 0;         // Time when the stopwatch was started
let elapsedTime = 0;       // Total elapsed time
let lapNumber = 1;

// --- Helper Function ---
function formatTime(time) {
    // Convert milliseconds to minutes, seconds, and centiseconds
    let minutes = Math.floor(time / (60 * 1000));
    let seconds = Math.floor((time % (60 * 1000)) / 1000);
    let centiseconds = Math.floor((time % 1000) / 10); // Get two digits

    // Format numbers to have leading zeros
    const format = (num) => (num < 10 ? '0' + num : num);
    
    return `${format(minutes)}:${format(seconds)}.${format(centiseconds)}`;
}

// --- Core Timer Function ---
function updateDisplay() {
    // Calculate current elapsed time since start
    const currentTime = Date.now();
    const time = elapsedTime + (currentTime - startTime);
    display.textContent = formatTime(time);
}

// --- Control Functions ---
function startStop() {
    if (isRunning) {
        // --- Pause the stopwatch ---
        clearInterval(timer);
        timer = null;
        
        // Calculate and store the elapsed time so far
        elapsedTime += Date.now() - startTime;
        
        startStopBtn.textContent = 'Start';
        startStopBtn.classList.remove('paused');
        
        lapBtn.disabled = true; // Disable lap button when paused
        isRunning = false;

    } else {
        // --- Start (or resume) the stopwatch ---
        
        // Set the start time
        startTime = Date.now();
        
        // Update the display every 10ms (for centiseconds)
        timer = setInterval(updateDisplay, 10);
        
        startStopBtn.textContent = 'Pause';
        startStopBtn.classList.add('paused');
        
        lapBtn.disabled = false; // Enable lap button
        resetBtn.disabled = false; // Enable reset button
        isRunning = true;
    }
}

function reset() {
    // Stop the timer
    clearInterval(timer);
    timer = null;
    
    // Reset all state variables
    isRunning = false;
    elapsedTime = 0;
    lapNumber = 1;
    
    // Update the UI
    display.textContent = "00:00:00.00";
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('paused');
    
    lapsList.innerHTML = ''; // Clear the laps list
    
    // Disable lap and reset buttons until start is pressed
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

function recordLap() {
    if (!isRunning) return; // Don't record a lap if the timer isn't running

    // Calculate the current time
    const currentTime = Date.now();
    const lapTime = elapsedTime + (currentTime - startTime);
    
    // Create a new list item
    const li = document.createElement('li');
    li.innerHTML = `<span>Lap ${lapNumber}</span><span>${formatTime(lapTime)}</span>`;
    
    // Add the new lap to the top of the list
    lapsList.prepend(li);
    
    lapNumber++;
}

// --- Event Listeners ---
startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);

// --- Initial Setup ---
// Set initial button states
lapBtn.disabled = true;
resetBtn.disabled = true;