import Service from '@ember/service';

const NAMES_LS_KEY = 'snake-game-names';
const SCORES_LS_KEY = 'snake-game-scores';

export default Service.extend({
  scores: null,

  init() {
    let scores = [];
    if (window.localStorage.getItem(SCORES_LS_KEY)) {
      let scoreVals = (window.localStorage.getItem(SCORES_LS_KEY)).split(',').map((s) => {
        return parseInt(s, 10);
      });
      let nameVals = (window.localStorage.getItem(NAMES_LS_KEY)).split(',');
      scoreVals.forEach((score, ix) => scores.pushObject({ name: nameVals[ix], score }));
    }
    this.set('scores', scores.sort((x, y) => y.score > x.score));
  },

  saveScore(score, name) {
    this.get('scores').pushObject({ score, name });
    this.get('scores').sort((x, y) => y.score > x.score);
    let scores = this.get('scores');
    let scoreVals = [];
    let nameVals = [];
    scores.forEach((obj) => {
      scoreVals.push(obj.score);
      nameVals.push(obj.name);
    });
    window.localStorage.setItem(SCORES_LS_KEY, scoreVals.join(','));
    window.localStorage.setItem(NAMES_LS_KEY, nameVals.join(','));
  }
});
