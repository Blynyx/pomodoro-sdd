/* ========================================
   app.js — Pomodoro SDD v3.0
   JavaScript vanilla. Sin frameworks.
   ======================================== */

// --- Constantes ---

const DURATION_WORK = 1500;
const DURATION_BREAK = 300;
const DURATION_WORK_DEBUG = 10;
const DURATION_BREAK_DEBUG = 5;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 120;

const BEEP_FREQ = 880;
const BEEP_GAIN_INITIAL = 0.3;
const BEEP_GAIN_FINAL = 0.001;
const BEEP_DURATION = 0.5;

const NOTIFICATION_WORK = {
  title: '¡Pomodoro completado!',
  body: 'Es hora de descansar. Toma un respiro.'
};

const NOTIFICATION_BREAK = {
  title: '¡Descanso terminado!',
  body: 'Listo para concentrarse de nuevo.'
};

// --- Variables de estado ---

let mode = 'work';
let totalSeconds;
let remainingSeconds;
let isRunning = false;
let cycles = 0;
let intervalId = null;
let isDebug = false;
let notificationPermissionRequested = false;

// --- Referencias al DOM ---

const $timeDisplay = document.getElementById('time-display');
const $modeLabel = document.getElementById('mode-label');
const $cycleCount = document.getElementById('cycle-count');
const $btnToggle = document.getElementById('btn-toggle');
const $btnReset = document.getElementById('btn-reset');
const $progressCircle = document.getElementById('progress-circle');
const $debugBadge = document.getElementById('debug-badge');
const $app = document.querySelector('.app');

// --- Funciones utilitarias ---

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

// --- Funciones de UI ---

function updateDisplay() {
  $timeDisplay.textContent = formatTime(remainingSeconds);
}

function updateModeLabel() {
  if (mode === 'work') {
    $modeLabel.textContent = 'Trabajo';
    $app.classList.add('mode-work');
    $app.classList.remove('mode-break');
  } else {
    $modeLabel.textContent = 'Descanso';
    $app.classList.add('mode-break');
    $app.classList.remove('mode-work');
  }
}

function updateButton() {
  if (isRunning) {
    $btnToggle.textContent = 'Pausar';
    $btnToggle.setAttribute('aria-label', 'Pausar temporizador');
  } else {
    $btnToggle.textContent = 'Iniciar';
    $btnToggle.setAttribute('aria-label', 'Iniciar temporizador');
  }
}

function updateCycleCount() {
  $cycleCount.textContent = cycles;
}

function updateProgressRing() {
  const offset = CIRCLE_CIRCUMFERENCE * (1 - remainingSeconds / totalSeconds);
  $progressCircle.setAttribute('stroke-dashoffset', offset);
}

function updateTitle() {
  if (isRunning) {
    document.title = formatTime(remainingSeconds) + ' — Pomodoro';
  } else {
    document.title = 'Pomodoro';
  }
}

// --- Funciones del temporizador ---

function startTimer() {
  isRunning = true;
  intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  isRunning = false;
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetTimer() {
  pauseTimer();
  totalSeconds = getDuration(mode);
  remainingSeconds = totalSeconds;
  updateDisplay();
  updateButton();
  updateProgressRing();
  updateTitle();
}

function tick() {
  remainingSeconds--;
  updateDisplay();
  updateProgressRing();
  updateTitle();

  if (remainingSeconds <= 0) {
    onPhaseEnd();
  }
}

function onPhaseEnd() {
  pauseTimer();

  playBeep();
  sendNotification(mode);

  if (mode === 'work') {
    cycles++;
    updateCycleCount();
  }

  mode = mode === 'work' ? 'break' : 'work';
  totalSeconds = getDuration(mode);
  remainingSeconds = totalSeconds;

  updateModeLabel();
  updateDisplay();
  updateProgressRing();
  updateButton();
  updateTitle();
}

// --- Notificaciones ---

function playBeep() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var oscillator = ctx.createOscillator();
    var gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = BEEP_FREQ;

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(BEEP_GAIN_INITIAL, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(BEEP_GAIN_FINAL, ctx.currentTime + BEEP_DURATION);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + BEEP_DURATION);
  } catch (e) {
    // Silenciar error si AudioContext no está disponible
  }
}

function requestNotificationPermission() {
  if (notificationPermissionRequested) return;
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
  notificationPermissionRequested = true;
}

function sendNotification(completedMode) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  var config = completedMode === 'work' ? NOTIFICATION_WORK : NOTIFICATION_BREAK;
  try {
    new Notification(config.title, { body: config.body });
  } catch (e) {
    // Silenciar error
  }
}

// --- Modo debug ---

function initDebug() {
  isDebug = new URLSearchParams(window.location.search).has('debug');
  if (isDebug) {
    $debugBadge.hidden = false;
  }
}

function getDuration(phase) {
  if (isDebug) {
    return phase === 'work' ? DURATION_WORK_DEBUG : DURATION_BREAK_DEBUG;
  }
  return phase === 'work' ? DURATION_WORK : DURATION_BREAK;
}

// --- Event handlers ---

function onToggle() {
  requestNotificationPermission();

  if (!isRunning) {
    startTimer();
  } else {
    pauseTimer();
  }
  updateButton();
}

function onReset() {
  resetTimer();
}

// --- Inicialización ---

function init() {
  initDebug();
  totalSeconds = getDuration('work');
  remainingSeconds = totalSeconds;
  mode = 'work';

  updateDisplay();
  updateModeLabel();
  updateButton();
  updateProgressRing();
  updateCycleCount();
  updateTitle();

  $btnToggle.addEventListener('click', onToggle);
  $btnReset.addEventListener('click', onReset);
}

document.addEventListener('DOMContentLoaded', init);
