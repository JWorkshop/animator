# animator

An instance class which manages animations by hooking into requestAnimationFrame (or setInterval if not available).

## Usage

```javascript
/* Create an instance of an animator. */
let animator = new Animator();

/** Register an animate listener to the animator.
 * Returns a function for unregistering event. */
animator.add(timeDiff => { ... });

/** Unregister an animate listener from the animator. */
animator.remove(timeDiff => { ... });

/** Unregister all animate listeners from the animator. */
animator.clear();

/** Set a specific frame rate for the animation. */
animator.setFPS(fps);

/** Start the animation loop. */
animator.start();

/** Pause the animation loop. */
animator.pause();

/** Resume the animation loop. */
animator.resume();

/** Add listener to the pause event. */
animator.onPause(() => { ... });

/** Remove listener to the pause event. */
animator.removePause(() => { ... });

/** Unregister all pause listeners from the animator. */
animator.clearPause();

/** Add listener to the resume event. */
animator.onResume(() => { ... });

/** Remove listener to the resume event. */
animator.removeResume(() => { ... });

/** Unregister all resume listeners from the animator. */
animator.clearResume();
```
