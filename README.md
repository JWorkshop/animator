# animator

An instance class which manages animations by hooking into requestAnimationFrame (or setInterval if not available).

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/@jworkshop/animator.svg
[npm-url]: http://npmjs.org/package/@jworkshop/animator
[travis-image]: https://img.shields.io/travis/JWorkshop/animator.svg
[travis-url]: https://travis-ci.org/JWorkshop/animator
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@jworkshop/animator.svg
[download-url]: https://npmjs.org/package/@jworkshop/animator

## install

[![NPM](https://nodei.co/npm/@jworkshop/animator.png)](https://nodei.co/npm/@jworkshop/animator/)

## Usage

```javascript
/* Create an instance of an animator. */
let animator = new Animator();

let animateHandler = timeDiff => { ... };

/** Bind an event handler to the animate event. */
animator.add(animateHandler);

/** Unbind an event handler from the animate event. */
animator.remove(animateHandler);

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

let pauseHandler = () => { ... };

/** Bind an event handler to the pause event. */
animator.onPause(pauseHandler);

/** Unbind an event handler from the pause event. */
animator.removePause(pauseHandler);

/** Unbind all event handlers from the pause event. */
animator.clearPause();

let resumeHandler = () => { ... };

/** Bind an event handler to the resume event. */
animator.onResume(resumeHandler);

/** Unbind an event handler from the resume event. */
animator.removeResume(resumeHandler);

/** Unbind all event handlers from the resume event. */
animator.clearResume();
```
