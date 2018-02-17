import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const SPACE_CHAR = String.fromCharCode(0x00A0);
const TAIL_CHAR = '~';
const HEAD_CHAR = 'X';
// const GOAL_CHAR = 'W';
const FOOD_CHAR = 'F';
const MOVE_INTERVAL_MS = 200;
const RIGHT = 'right';
const LEFT = 'left';
const UP = 'up';
const DOWN = 'down';

export default Component.extend({
  grid: null,
  headX: 1,
  headY: 1,
  gameOver: false,
  goalX: 7,
  goalY: 2,
  foodX: 8,
  foodY: 3,
  direction: RIGHT,

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
    // this.get('grid')[this.get('goalY')][this.get('goalX')] = GOAL_CHAR;
    this.get('grid')[this.get('foodY')][this.get('foodX')] = FOOD_CHAR;
    for (var i = 0; i < this.get('grid').length; i++) {
      gridText += this.get('grid')[i].join('') + '\n';
    }
    this.set('gridText', gridText);
  },

  endGame() {
    this.set('gameOver', true);
    this.get('onGameOver')();
  },

  checkGameState() {
    let headX = this.get('headX');
    let headY = this.get('headY');
    if ((headX >= GRID_WIDTH) || (headX < 0) ||
        (headY >= GRID_HEIGHT) || (headY < 0)) {
      throw 'game over';
    }
    // if ((headX === this.get('goalX')) && headY === this.get('goalY')) {
    //   debugger;
    //   throw 'game over';
    // }
    if (this.get('grid')[headY][headX] === TAIL_CHAR) {
      throw 'game over';
    }
  },

  ateFood() {
    this.get('tail').push({ x: this.get('headX'), y: this.get('headY')});
    let availableFoodSpots = [];
    this.get('grid').forEach((col, y) => {
      col.forEach((cell, x) => {
        if (cell !== HEAD_CHAR && cell !== TAIL_CHAR) {
          availableFoodSpots.push({ x, y });
        }
      });
    })
    let nextFoodLoc = availableFoodSpots[Math.floor(Math.random()*(availableFoodSpots.length))];
    this.get('foodEaten')();
    this.set('foodX', nextFoodLoc.x);
    this.set('foodY', nextFoodLoc.y);
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

  willDestroyElement() {
    window.removeEventListener('keydown', this.get('onKeyDown'));
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    this.set('onKeyDown', function(e) {
      let direction = this.get('direction')
      try {
        switch(e.key) {
          case 'ArrowUp':
            if (!(direction === DOWN || direction === UP)) {
              this.set('direction', UP);
              this.get('startSnake').perform(UP);
            }
            break;
          case 'ArrowDown':
            if (!(direction === DOWN || direction === UP)) {
              this.set('direction', DOWN);
              this.get('startSnake').perform(DOWN);
            }
            break;
          case 'ArrowRight':
            if (!(direction === LEFT || direction === RIGHT)) {
              this.set('direction', RIGHT);
              this.get('startSnake').perform(RIGHT);
            }
            break;
          case 'ArrowLeft':
            if (!(direction === LEFT || direction === RIGHT)) {
              this.set('direction', LEFT);
              this.get('startSnake').perform(LEFT);
            }
            break;

          default:
            // code
        }
        this.drawGrid();
      } catch(e) {
        this.endGame();
      }
    }.bind(this));
    window.addEventListener('keydown', this.get('onKeyDown'));
    this.drawGrid();
    this.get('startSnake').perform(this.get('direction'));
  },

  startSnake: task(function* (direction) {
    if (!this.get('gameOver')) {
      try {
        switch(direction) {
          case UP:
            this.moveVertically(-1);
            break;
          case DOWN:
            this.moveVertically(1);
            break;
          case RIGHT:
            this.moveHorizontally(1);
            break;
          case LEFT:
            this.moveHorizontally(-1);
            break;

          default:
            // code
        }
        yield timeout(MOVE_INTERVAL_MS);
        this.get('startSnake').perform(direction);
      } catch(e) {
        this.endGame();
      }
    }
  }).restartable()
});
