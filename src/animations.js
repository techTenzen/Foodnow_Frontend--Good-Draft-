import anime from 'animejs/lib/anime.es.js';

export class Animations {
  static fadeIn(selector, delay = 0) {
    anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: delay,
      easing: 'easeOutExpo'
    });
  }
  
  static slideIn(selector, direction = 'left', delay = 0) {
    const translateProp = direction === 'left' ? 'translateX' : 'translateY';
    const value = direction === 'left' ? [-50, 0] : [50, 0];
    
    anime({
      targets: selector,
      [translateProp]: value,
      opacity: [0, 1],
      duration: 500,
      delay: delay,
      easing: 'easeOutCubic'
    });
  }
  
  static bounceIn(selector, delay = 0) {
    anime({
      targets: selector,
      scale: [0.3, 1],
      opacity: [0, 1],
      duration: 600,
      delay: delay,
      easing: 'easeOutElastic(1, .8)'
    });
  }
  
  static staggerCards(selector, delay = 100) {
    anime({
      targets: selector,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(delay),
      easing: 'easeOutExpo'
    });
  }
  
  static pulseButton(selector) {
    anime({
      targets: selector,
      scale: [1, 1.05, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
  }
  
  static modalIn(selector) {
    anime({
      targets: selector,
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutBack'
    });
  }
  
  static modalOut(selector, callback) {
    anime({
      targets: selector,
      scale: [1, 0.8],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInBack',
      complete: callback
    });
  }
}

window.Animations = Animations;