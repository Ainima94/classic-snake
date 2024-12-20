import { GameMap } from './GameMap.js';

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

function controls(snake, e) {
  if (!e) e = { key: checkDirection() };
  switch (e.key) {
  case 'ArrowUp':
  case 'w':
    snake.changeDirection(GameMap.directions.up);
    break;
  case 'ArrowDown':
  case 's':
    snake.changeDirection(GameMap.directions.down);
    break;
  case 'ArrowLeft':
  case 'a':
    snake.changeDirection(GameMap.directions.left);
    break;
  case 'ArrowRight':
  case 'd':
    snake.changeDirection(GameMap.directions.right);
    break;
  }
}

const defineControls = snake => {
  const controlsWithSnake = (...args) => controls(snake, ...args);
  document.addEventListener('keydown', controlsWithSnake);
  document.addEventListener('touchstart', (e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
  }));

  document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    controlsWithSnake();
  });
};

function checkDirection() {
  if (Math.abs(touchstartX - touchendX) > Math.abs(touchstartY - touchendY)) {
    if (touchendX < touchstartX) return 'ArrowLeft';
    if (touchendX > touchstartX) return 'ArrowRight';
  } else {
    if (touchendY < touchstartY) return 'ArrowUp';
    if (touchendY > touchstartY) return 'ArrowDown';
  }
}


export { defineControls };
