import Component from '@ember/component';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;

export default Component.extend({
  grid: null,
  headX: 9,
  headY: 4,

  init() {
    this._super(...arguments);
    let grid = [];
    for (var i = 0; i < GRID_HEIGHT; i++) {
      let col = [];
      for (var j = 0; j < GRID_WIDTH; j++) {
        if (i === this.headY && j === this.headX) {
          col.push('X');
        } else {
          col.push(String.fromCharCode(0x00A0));
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

  didInsertElement() {
    this._super(...arguments);
    window.addEventListener('keydown', function() {
      this.drawGrid();
    }.bind(this));
    this.drawGrid();
  }
});
