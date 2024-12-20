import GameRender from './Render.js';
import Snake from './Snake.js';
import { defaultMaps } from './GameMap.js';
import { defineControls } from './controls.js';
import './menus/level.js';

const infoField = document.querySelector('.info-field');
const highScoreField = document.querySelector('.high-score-field'); // Поле для рекорду
const gameField = document.querySelector('.game-field');
const settings = {
  speed: 5,
  map: defaultMaps[0],
  gameIntervalID: 0,
  paused: false,
  highScore: 0, // Рекорд
};
const gameRender = new GameRender(gameField);
let snake;

// Завантаження звуків
const appleSound = new Audio('./sounds/apple-eat.mp3');
const gameOverSound = new Audio('./sounds/game-over.mp3');

addEventListener('endGame', endGame);
window.addEventListener('resize', () => document.location.reload());
document.querySelector('#start-game').addEventListener('click', startGame);
document.querySelector('.field').addEventListener('click', pauseGame);
document.querySelector('#continue-game').addEventListener('click', continueGame);
document.addEventListener('collision', handleGameOver);
document.addEventListener('appleEaten', handleAppleEaten);
infoField.style.width = `${gameRender.gameFieldWidth + 6}px`;
gameField.addEventListener('click', e => e.stopPropagation());
gameField.setAttribute('width', `${gameRender.gameFieldWidth}`);
gameField.setAttribute('height', `${gameRender.gameFieldHeight}`);

function startGame() {
  endGame();
  snake = new Snake();
  defineControls(snake);
  gameRender.setMap(settings.map);
  gameRender.setSnake(snake);
  snake.initSnake(settings.map.snakeSpawnProperties);
  switchToElement('field');
  settings.intervalID = setInterval(() => {
    if (settings.paused) return;
    snake.moveForward();
    gameRender.tick();
  }, Math.round(750 / settings.speed));
}

function pauseGame() {
  settings.paused = true;
  switchToElement('menu');
}

function continueGame() {
  if (!settings.paused) return;
  settings.paused = false;
  switchToElement('field');
}

function endGame() {
  settings.paused = false;
  clearInterval(settings.intervalID);
  
  const currentScore = parseInt(infoField.textContent);
  if (currentScore > settings.highScore) {
    settings.highScore = currentScore;
    highScoreField.textContent = ` ${settings.highScore}`;
  }
  switchToElement('menu');
  
  infoField.textContent = '0';
}

function handleGameOver() {
  // Програвання звуку проіграшу
  gameOverSound.play();
  endGame();
}

function handleAppleEaten() {
  // Програвання звуку
  appleSound.play();
  increaseScore();
}

function increaseScore() {
  infoField.textContent = `${parseInt(infoField.textContent) + settings.speed}`;
}

function switchToElement(elementClass) {
  const elementList = document.querySelectorAll('body>div');
  for (const element of elementList)
    element.classList.add('hidden');
  document.querySelector(`.${elementClass}`).classList.remove('hidden');
}

export { settings, endGame, switchToElement };
