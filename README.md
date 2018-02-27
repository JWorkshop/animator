# animator

An instance class which manages animations by hooking into requestAnimationFrame (or setInterval if not available).

[![build status][https://img.shields.io/travis/jworkshop/animator.svg]][https://travis-ci.org/jworkshop/animator]

## install

[![NPM](https://nodei.co/npm/@jworkshop/animator.png)](https://nodei.co/npm/@jworkshop/animator/)

## Usage

```javascript
/* Create an instance of an animator. */
let animator = new Animator();

/** Bind an event handler to the animate event. */
animator.add(timeDiff => { ... });

/** Unbind an event handler from the animate event. */
animator.remove(timeDiff => { ... });

/** Unbind all event handlers from the animate event. */
animator.clear();

/** Set a specific frame rate for the animation. */
animator.setFPS(fps);

/** Start the animation loop. */
animator.start();

/** Pause the animation loop. */
animator.pause();

/** Resume the animation loop. */
animator.resume();

/** Bind an event handler to the pause event. */
animator.onPause(() => { ... });

/** Unbind an event handler from the pause event. */
animator.removePause(() => { ... });

/** Unbind all event handlers from the pause event. */
animator.clearPause();

/** Bind an event handler to the resume event. */
animator.onResume(() => { ... });

/** Unbind an event handler from the resume event. */
animator.removeResume(() => { ... });

/** Unbind all event handlers from the resume event. */
animator.clearResume();
```
