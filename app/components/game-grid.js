import Component from '@ember/component';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const SPACE_CHAR = String.fromCharCode(0x00A0);
const TAIL_CHAR = '~';
const HEAD_CHAR = 'X';
const GOAL_CHAR = 'W';
const FOOD_CHAR = 'F';

export default Component.extend({
  grid: null,
  headX: 1,
  headY: 1,
  gameOver: false,
  goalX: 7,
  goalY: 2,
  foodX: 8,
  foodY: 3,

  init() {
    this._super(...arguments);
    let grid = [];
    for (var i = 0; i < GRID_HEIGHT; i++) {
      grid.push(SPACE_CHAR.repeat(GRID_WIDTH).split(''));
    }
    this.set('grid', grid);
    this.set('tail', []);
  },

  drawGrid() {
    let gridText = '';
    let tail = this.get('tail');
    tail.forEach((seg) => {
      let {x, y} = seg;
      this.get('grid')[y][x] = TAIL_CHAR;
    });
    this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
    this.get('grid')[this.get('goalY')][this.get('goalX')] = GOAL_CHAR;
    this.get('grid')[this.get('foodY')][this.get('foodX')] = FOOD_CHAR;
    for (var i = 0; i < this.get('grid').length; i++) {
      gridText += this.get('grid')[i].join('') + '\n';
    }
    this.set('gridText', gridText);
  },

  endGame() {
    this.set('gameOver', true);
  },

  checkGameState() {
    let headX = this.get('headX');
    let headY = this.get('headY');
    if ((headX >= GRID_WIDTH) || (headX < 0) ||
        (headY >= GRID_HEIGHT) || (headY < 0)) {
      throw 'game over';
    }
    if ((headX === this.get('goalX')) && headY === this.get('goalY')) {
      throw 'game over';
    }
    if (this.get('grid')[headY][headX] === TAIL_CHAR) {
      throw 'game over';
    }
  },

  ateFood() {
    this.get('tail').push({ x: this.get('headX'), y: this.get('headY')});
  },

  moveHead(oldX, oldY) {
    if (this.get('tail').length > 0) {
      this.get('tail').push({x: oldX, y: oldY });
      let { x, y } = this.get('tail').shift();
      this.get('grid')[y][x] = SPACE_CHAR;
    } else {
      this.get('grid')[oldY][oldX] = SPACE_CHAR;
    }
    if (this.get('grid')[this.get('headY')][this.get('headX')] === FOOD_CHAR) {
      this.ateFood();
    }
  },

  moveVertically(amount) {
    let currY = this.get('headY')
    this.set('headY', currY + amount);
    this.checkGameState();
    this.moveHead(this.get('headX'), currY);
    this.drawGrid();
  },

  moveHorizontally(amount) {
    let currX = this.get('headX');
    this.set('headX', currX + amount);
    this.checkGameState();
    this.moveHead(currX, this.get('headY'));
    this.drawGrid();
  },

  didInsertElement() {
    this._super(...arguments);
    window.addEventListener('keydown', function(e) {
      try {
        switch(e.key) {
          case 'ArrowUp':
            this.moveVertically(-1);
            break;
          case 'ArrowDown':
            this.moveVertically(1);
            break;
          case 'ArrowRight':
            this.moveHorizontally(1);
            break;
          case 'ArrowLeft':
            this.moveHorizontally(-1);
            break;

          default:
            // code
        }
        this.drawGrid();
      } catch(e) {
        this.endGame();
      }
    }.bind(this));
    this.drawGrid();
  }
});
