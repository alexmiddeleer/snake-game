import Component from '@ember/component';

const FOOD_SCORE = 10;
const MULTIPLIER = 1.1;

export default Component.extend({
  score: 0,
  gameOver: true,
  actions: {
    bumpScore() {
      let score = this.get('score');
      if (score) {
        this.set('score', Math.round(MULTIPLIER * (this.get('score') + FOOD_SCORE)));
      } else {
        this.set('score', FOOD_SCORE);
      }
    },
    restartGame() {
      this.set('score', 0);
      this.set('gameOver', false);
    }
  }
});
