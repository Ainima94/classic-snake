class GameMap {
  name;
  device;
  #snakeSpawnProperties = {
    pos: { x: 0.5, y: 0.5 },
    direction: GameMap.directions.up,
  };
  boundaries = [];
  #gameWidth;
  #gameHeight;

  constructor(name, device) {
    this.name = name;
    this.device = device;
  }

  setGameSize(width, height) {
    this.#gameWidth = width;
    this.#gameHeight = height;
  }

  addLine(from, to) {
    this.boundaries.push({
      from,
      to,
    });
  }

  get snakeSpawnProperties() {
    return {
      direction: this.#snakeSpawnProperties.direction,
      pos: {
        x: Math.round(this.#snakeSpawnProperties.pos.x * this.#gameWidth),
        y: Math.round(this.#snakeSpawnProperties.pos.y * this.#gameHeight),
      }
    };
  }

  set snakeSpawnProperties(value) {
    this.#snakeSpawnProperties = value;
  }

  drawMap() {

  }

  static get directions() {
    const directions = {
      right() {
        this.pos.x++;
        if (this.pos.x >= this.pos.width)
          this.pos.x = 0;
      },
      down() {
        this.pos.y++;
        if (this.pos.y >= this.pos.height)
          this.pos.y = 0;
      },
      left() {
        this.pos.x--;
        if (this.pos.x <= -1)
          this.pos.x = this.pos.width - 1;
      },
      up() {
        this.pos.y--;
        if (this.pos.y <= -1)
          this.pos.y = this.pos.height - 1;
      },
    };
    directions.right.opposite = directions.left;
    directions.right.angle = 0 ;
    directions.down.opposite = directions.up;
    directions.down.angle = 90;
    directions.left.opposite = directions.right;
    directions.left.angle = 180;
    directions.up.opposite = directions.down;
    directions.up.angle = 270;
    return directions;
  }
}


const defaultMaps = [
  new GameMap('No maze', 'any'),
];

export { GameMap, defaultMaps };
