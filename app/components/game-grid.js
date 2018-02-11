import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    window.addEventListener('keydown', function() {
      console.log('got here');
    });
  }
});
