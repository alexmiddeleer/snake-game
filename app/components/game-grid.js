import Component from '@ember/component';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const SPACE_CHAR = String.fromCharCode(0x00A0);
const HEAD_CHAR = 'X';
const GOAL_CHAR = 'W';

export default Component.extend({
  grid: null,
  headX: 9,
  headY: 4,
  gameOver: false,
  goalX: 7,
  goalY: 2,

  init() {
    this._super(...arguments);
    let grid = [];
    for (var i = 0; i < GRID_HEIGHT; i++) {
      grid.push(SPACE_CHAR.repeat(GRID_WIDTH).split(''));
    }
    this.set('grid', grid);
  },

  drawGrid() {
    let gridText = '';
    this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
    this.get('grid')[this.get('goalY')][this.get('goalX')] = GOAL_CHAR;
    for (var i = 0; i < this.get('grid').length; i++) {
      gridText += this.get('grid')[i].join('') + '\n';
    }
    this.set('gridText', gridText);
  },

  endGame() {
    this.set('gameOver', true);
  },

  checkGameState() {
    if ((this.get('headX') >= GRID_WIDTH) || (this.get('headX') < 0) ||
        (this.get('headY') >= GRID_HEIGHT) || (this.get('headY') < 0)) {
      throw 'game over';
    }
    if ((this.get('headX') === this.get('goalX')) && this.get('headY') === this.get('goalY')) {
      throw 'game over';
    }
  },

  moveHead(oldX, oldY) {
    this.get('grid')[oldY][oldX] = SPACE_CHAR;
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
