import Component from '@ember/component';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const SPACE_CHAR = String.fromCharCode(0x00A0);
const HEAD_CHAR = 'X';

export default Component.extend({
  grid: null,
  headX: 9,
  headY: 4,
  gameOver: false,

  init() {
    this._super(...arguments);
    let grid = [];
    for (var i = 0; i < GRID_HEIGHT; i++) {
      let col = [];
      for (var j = 0; j < GRID_WIDTH; j++) {
        if (i === this.headY && j === this.headX) {
          col.push(HEAD_CHAR);
        } else {
          col.push(SPACE_CHAR);
        }
      }
      grid.push(col);
    }
    this.set('grid', grid);
  },

  drawGrid() {
    let gridText = '';
    for (var i = 0; i < this.get('grid').length; i++) {
      gridText += this.get('grid')[i].join('') + '\n';
    }
    this.set('gridText', gridText);
  },

  endGame() {
    this.set('gameOver', true);
  },

  goUp() {
    try {
      this.get('grid')[this.get('headY')][this.get('headX')] = SPACE_CHAR;
      this.set('headY', this.get('headY') - 1);
      this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
      this.drawGrid();
    } catch(e) {
      this.endGame();
    }
  },

  goRight() {
    try {
      this.get('grid')[this.get('headY')][this.get('headX')] = SPACE_CHAR;
      this.set('headX', this.get('headX') + 1);
      if (this.get('headX') >= GRID_WIDTH) {
        throw 'game over';
      }
      this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
      this.drawGrid();
    } catch(e) {
      this.endGame();
    }
  },

  goDown() {
    try {
      this.get('grid')[this.get('headY')][this.get('headX')] = SPACE_CHAR;
      this.set('headY', this.get('headY') + 1);
      if (this.get('headY') >= GRID_HEIGHT) {
        throw 'game over';
      }
      this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
      this.drawGrid();
    } catch(e) {
      this.endGame();
    }
  },

  goLeft() {
    try {
      this.get('grid')[this.get('headY')][this.get('headX')] = SPACE_CHAR;
      this.set('headX', this.get('headX') - 1);
      if (this.get('headX') < 0) {
        throw 'game over';
      }
      this.get('grid')[this.get('headY')][this.get('headX')] = HEAD_CHAR;
      this.drawGrid();
    } catch(e) {
      this.endGame();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    window.addEventListener('keydown', function(e) {
      switch(e.key) {
        case 'ArrowUp':
          this.goUp();
          break;
        case 'ArrowDown':
          this.goDown();
          break;
        case 'ArrowRight':
          this.goRight();
          break;
        case 'ArrowLeft':
          this.goLeft();
          break;

        default:
          // code
      }
      this.drawGrid();
    }.bind(this));
    this.drawGrid();
  }
});
