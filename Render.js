export default class GameRender {
  #snake;
  #snakeParts;
  #mapBoundaries;

  constructor(gameField) {
    this.gameField = gameField;
    this.gameFieldContext = gameField.getContext('2d');

    // Тека для текстур
    this.texturePath = './textures/';
    this.textures = {};

    const width = window.innerWidth * 0.95;
    const height = window.innerHeight * 0.85;
    this.isMobile = height > width;
    this.squareSize = Math.ceil((this.isMobile ? height : width) / 15);
    this.gameWidthSquares = Math.floor(width / this.squareSize);
    this.gameHeightSquares = Math.floor(height / this.squareSize);
    this.gameFieldWidth = this.gameWidthSquares * this.squareSize;
    this.gameFieldHeight = this.gameHeightSquares * this.squareSize;
  }

  setupGameDimensions() {
    this.gameField.width = this.gameFieldWidth;
    this.gameField.height = this.gameFieldHeight;
    console.log('Game dimensions set:', this.gameFieldWidth, this.gameFieldHeight);
  }

  tick() {
    if (this.checkCollision()) return;
    this.clearGameField();
    this.drawSnake();
  }

  setSnake(snake) {
    this.#snake = snake;
    this.#snakeParts = snake.snakeParts;
    snake.setGameSize(this.gameWidthSquares, this.gameHeightSquares);
  }

  setMap(map) {
    this.#mapBoundaries = map.boundaries;
    map.setGameSize(this.gameWidthSquares, this.gameHeightSquares);
  }

  clearGameField() {
    this.gameFieldContext.clearRect(0, 0, this.gameFieldWidth, this.gameFieldHeight);
  }

  drawSnake() {
    for (const snakePart of this.#snakeParts) {
      this.drawPart(snakePart);
    }
    // Малюємо яблуко
    this.drawPart(this.#snakeParts.apple);
  }

  async drawPart(snakePart) {
    const x = snakePart.pos.x * this.squareSize;
    const y = snakePart.pos.y * this.squareSize;
    const sqSize = this.squareSize;
    const spType = snakePart.type;
    const direction = snakePart.direction; // Напрямок частини
    let rotationAngle = 0; // Кут повороту текстури
  
    // Визначаємо кут повороту залежно від напрямку
    switch (direction.name) {
      case 'up':
        rotationAngle = 0;
        break;
      case 'right':
        rotationAngle = Math.PI / 2;
        break;
      case 'down':
        rotationAngle = Math.PI;
        break;
      case 'left':
        rotationAngle = -Math.PI / 2;
        break;
    }
  
    // Load the texture dynamically if not already loaded
    const texture = await this.loadTexture(spType);

    if (spType === 'cornerBody') {
      console.log(snakePart.flag);
      // Check for a corner body part with a flag
      if (snakePart.flag) {
        rotationAngle = (direction.angle * Math.PI / 180);
      }
    }
    
    if (texture) {
      this.gameFieldContext.save(); // Зберігаємо поточний стан контексту
      this.gameFieldContext.translate(x + sqSize / 2, y + sqSize / 2); // Переміщуємо точку обертання в центр
      this.gameFieldContext.rotate(rotationAngle); // Повертаємо текстуру
      this.gameFieldContext.drawImage(texture, -sqSize / 2, -sqSize / 2, sqSize, sqSize); // Малюємо текстуру
      this.gameFieldContext.restore(); // Відновлюємо стан контексту
    } else {
      console.warn(`Texture for type "${type}" is not loaded or broken.`);
      this.gameFieldContext.fillStyle = 'gray'; // Резервний колір
      this.gameFieldContext.fillRect(x, y, sqSize, sqSize);
    }
  }

   // Helper function to load the texture asynchronously
   loadTexture(type) {
    return new Promise((resolve, reject) => {
      // Check if the texture is already loaded
      if (this.textures[type] && this.textures[type].complete) {
        return resolve(this.textures[type]);
      }

      const image = new Image();
      image.src = `${this.texturePath}${type}.png`;

      // Handle image load success
      image.onload = () => {
        this.textures[type] = image; // Store the loaded texture
        resolve(image);
      };

      // Handle image load error
      image.onerror = () => {
        console.error(`Failed to load texture for "${type}" at ${image.src}`);
        resolve(null); // Resolve with null if there's an error
      };
    });
  }
  

  checkCollision() {
    let isCollision = false;
    const headPos = this.#snakeParts[0].pos;
    const apple = this.#snakeParts.apple;
    const applePos = apple?.pos;

    if (applePos && applePos.x === headPos.x && applePos.y === headPos.y) {
      this.#snake.increaseLength();
      document.dispatchEvent(new Event('appleEaten'));
    }

    let flag = false;
    do {
      flag = false;
      this.#snakeParts.forEach((snakePart, index) => {
        if (applePos && applePos.x === snakePart.pos.x && applePos.y === snakePart.pos.y) {
          apple.randomizePos();
          flag = true;
        }

        if (index === 0) return;
        if (headPos.x === snakePart.pos.x && headPos.y === snakePart.pos.y) {
          isCollision = true;
          document.dispatchEvent(new Event('collision'));
        }
      });
    } while (flag);

    return isCollision;
  }
}
