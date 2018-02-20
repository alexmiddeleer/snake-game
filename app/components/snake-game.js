import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const FOOD_SCORE = 10;
const MULTIPLIER = 1.1;
const HIGH_SCORE_COUNT = 10;

export default Component.extend({
  score: 0,
  gameOver: true,
  scoreUnsaved: false,
  scoreName: '',

  scoreHistory: service(),

  highScores: computed('scoreHistory.scores.[]', function() {
    return this.get('scoreHistory.scores').slice(0, HIGH_SCORE_COUNT);
  }),

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
      this.set('scoreUnsaved', true);
    },

    submit() {
      this.set('scoreUnsaved', false);
      this.get('scoreHistory').saveScore(this.get('score'), this.get('scoreName'));
    }
  }
});
