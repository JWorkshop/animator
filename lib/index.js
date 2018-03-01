"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Set the request animation frame to the native event frame. */
var requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
}();

var min = Math.min,
    max = Math.max;

var Animator = function () {
  function Animator() {
    var _this = this;

    _classCallCheck(this, Animator);

    /* The animate listeners that are registered to this animator to trigger on each requestAnimFrame event. */
    this.animateListeners = [];

    /* The required frame rate of the animation in terms of frames per seconds, by default is 60 FPS. */
    this.FPS = 60;

    /* The minimum frame rate available for animation, by default is 10 FPS. */
    this.minFPS = 10;

    /* The maximum frame rate available for animation, by default is 60 FPS. */
    this.maxFPS = 60;

    /* The maximum time difference allowed for animation, which is 0.1 second. */
    this.maxTimeDiff = 1 / this.minFPS;

    /* The minimum time difference allowed for animation, which is roughly 0.017 second. */
    this.minTimeDiff = 1 / this.maxFPS;

    /* The actual frame rate of the animation in terms of frames per seconds. */
    this.actualFPS = 0;

    /* The starting time of the animation. */
    this.startTime = 0;

    /* The previous time which the animate functions were called. */
    this.previousAnimateTime = 0;

    /* The current time which the animate functions are called. */
    this.newAnimateTime = 0;

    /* The flag for determining whether the animator is paused. */
    this.isPaused = false;

    /* The flag for determining whether the animator is commanded to pause externally. */
    this.isPauseRequested = false;

    /* The flag for determining whether the animations are allowed to exceed the FPS range. */
    this.allowExceedFPSRange = false;

    /* The flag for determining whether the animations are to be time based,
    * which means each render is based on the time difference from the previous render.
    * If the animations are set not to be time-based, then the render function will always
    * have the standard FPS time difference as the parameter value. */
    this.isTimeBased = true;

    /* The flag for determining whether the animations should be paused when the browser window loses focus. */
    this.pauseOnHidden = false;

    /* The flag for determining whether the animations should be resume when the browser window gains focus. */
    this.resumeOnShown = false;

    /* The flag for determining whether the animations is currently requesting in order to avoid multiple requests. */
    this.requesting = false;

    /* The list of animator events. Each animator event will trigger the corresponding method of each listeners. */
    this.pauseEvents = [];
    this.resumeEvents = [];

    /** Adapt visibility change on the window for pausing and resuming. */
    /* Chrome 13+. */
    document.addEventListener("visibilitychange", function () {
      return _this._onWindowChange(document.hidden);
    });

    /* Firefox 10+. */
    document.addEventListener("mozvisibilitychange", function () {
      return _this._onWindowChange(document.mozHidden);
    });

    /* Opera 12.10+. */
    document.addEventListener("webkitvisibilitychange", function () {
      return _this._onWindowChange(document.webkitHidden);
    });

    /* Internet Explorer 10+. */
    document.addEventListener("msvisibilitychange", function () {
      return _this._onWindowChange(document.msHidden);
    });

    /* Internet Explorer 9 and lower. */
    document.onfocusin = function () {
      return _this._onWindowShow();
    };
    document.onfocusout = function () {
      return _this._onWindowHidden();
    };

    /* Other. */
    window.onpageshow = window.onfocus = function () {
      return _this._onWindowShow();
    };
    window.onpagehide = window.onblur = function () {
      return _this._onWindowHidden();
    };
  }

  _createClass(Animator, [{
    key: "_addEvent",
    value: function _addEvent(event, events) {
      var _this2 = this;

      if (typeof event === "function") {
        events.push(event);
        return function () {
          return _this2._removeEvent(event, events);
        };
      }
    }
  }, {
    key: "_removeEvent",
    value: function _removeEvent(event, events) {
      var index = events.indexOf(event);

      if (index !== -1) {
        events.splice(index, 1);
      }
    }
  }, {
    key: "_fireEvents",
    value: function _fireEvents(events) {
      for (var i = 0; i < events.length; i++) {
        events[i]();
      }
    }
  }, {
    key: "_firePauseEvent",
    value: function _firePauseEvent() {
      this._fireEvents(this.pauseEvents);
    }
  }, {
    key: "_fireResumeEvent",
    value: function _fireResumeEvent() {
      this._fireEvents(this.resumeEvents);
    }
  }, {
    key: "_onWindowHidden",
    value: function _onWindowHidden() {
      this.isFoused = false;

      if (this.pauseOnHidden) {
        this.pause(true);
      }
    }
  }, {
    key: "_onWindowShow",
    value: function _onWindowShow() {
      this.isFoused = true;

      if (this.resumeOnShown) {
        this.resume(true);
      }
    }

    /** Perform action for window change event, either hidden or show */

  }, {
    key: "_onWindowChange",
    value: function _onWindowChange(isWindowHidden) {
      if (isWindowHidden === true) {
        this._onWindowHidden();
      } else if (isWindowHidden === false) {
        this._onWindowShow();
      }
    }

    /** The iteration of the animation loop, each call depends on the animation frame of the browser. */

  }, {
    key: "_animate",
    value: function _animate() {
      var _this3 = this;

      /* Check if the animations are paused or the frame rate is equal or below 0. */
      if (this.requesting === false && this.isPaused === false && this.FPS > 0) {
        /* Set a time delay to compromise the desired FPS.
         * Since the requestAnimFrame callback method will cause a delay of roughly 4 milli seconds,
         * delay is reduced by that amount of time. */
        var timeDelay = 1000 / this.FPS - 4;

        this.requesting = true;

        setTimeout(function () {
          /* Request for the animation frame.
          /* (i.e.: this will set off another iterate of this function depending on the browser). */
          requestAnimFrame(function () {
            _this3.requesting = false;
            _this3._animate();
          });

          /* Render the registered animation objects. */
          _this3._render();
        }, timeDelay);
      }
    }

    /** Execute all the rendering functions. */

  }, {
    key: "_render",
    value: function _render() {
      /* Update the two time-stamps with the new time-stamp of the animation. */
      this.previousAnimateTime = this.newAnimateTime;
      this.newAnimateTime = Date.now();

      var timeDiff = 1 / this.FPS;

      if (this.isTimeBased) {
        /* Calculate the time difference between the previous time-stamp in terms of seconds. */
        timeDiff = (this.newAnimateTime - this.previousAnimateTime) / 1000;

        if (!this.allowExceedFPSRange) {
          /* Check if the time difference is too big, which could be caused by poor performance or a pause.
           * If so, then reset the time difference to prevent animation jump. */
          timeDiff = min(this.maxTimeDiff, max(this.minTimeDiff, timeDiff));
        }
      }

      /* Trigger all animate listeners from the animator. */
      var animateListeners = this.animateListeners;


      for (var i = 0; i < animateListeners.length; i++) {
        animateListeners[i](timeDiff);
      }
    }

    /** Bind an event handler to the animate event. */

  }, {
    key: "add",
    value: function add(animateListener) {
      return this._addEvent(animateListener, this.animateListeners);
    }

    /** Unbind an event handler from the animate event. */

  }, {
    key: "remove",
    value: function remove(animateListener) {
      this._removeEvent(animateListener, this.animateListeners);
    }

    /** Unbind all event handlers from the animate event. */

  }, {
    key: "clear",
    value: function clear() {
      this.animateListeners = [];
    }

    /** Set a specific frame rate for the animation. */

  }, {
    key: "setFPS",
    value: function setFPS(newFPS) {
      if (!this.allowExceedFPSRange) {
        /* Limit the FPS with the maximum FPS. */
        newFPS = min(max(newFPS, this.minFPS), this.maxFPS);
      }

      this.FPS = newFPS;
    }

    /** Start the animation loop. */

  }, {
    key: "start",
    value: function start() {
      var timestamp = Date.now();

      /* Record the time-stamp of the starting animation. */
      this.startTime = timestamp;

      /* Record the previous animation time-stamp as the starting animation. */
      this.previousAnimateTime = timestamp;
      this.newAnimateTime = timestamp;

      /* Start the animation loop. */
      this._animate();
    }

    /** Pause the animation loop.
     *  Note: quietMode is for window hide and show events only.
     */

  }, {
    key: "pause",
    value: function pause(quietMode) {
      if (quietMode !== true) {
        this.isPauseRequested = true;
      }

      if (this.isPaused === false) {
        this.isPaused = true;
        this._firePauseEvent();
      }
    }

    /** Resume the animation loop. */

  }, {
    key: "resume",
    value: function resume(quietMode) {
      if (quietMode !== true) {
        this.isPauseRequested = false;
      }

      if (this.isPauseRequested === false && this.isPaused === true) {
        this.isPaused = false;
        this._fireResumeEvent();

        /* Record the previous animation time-stamp as the starting animation. */
        this.previousAnimateTime = Date.now();
        this.newAnimateTime = Date.now();

        /* Re-initiate the animation loop. */
        this._animate();
      }
    }

    /** Bind an event handler to the pause event. */

  }, {
    key: "onPause",
    value: function onPause(pauseEvent) {
      return this._addEvent(pauseEvent, this.pauseEvents);
    }

    /** Unbind an event handler from the pause event. */

  }, {
    key: "removePause",
    value: function removePause(pauseEvent) {
      this._removeEvent(pauseEvent, this.pauseEvents);
    }

    /** Unbind all event handlers from the pause event. */

  }, {
    key: "clearPause",
    value: function clearPause() {
      this.pauseEvents = [];
    }

    /** Bind an event handler to the resume event. */

  }, {
    key: "onResume",
    value: function onResume(resumeEvent) {
      return this._addEvent(resumeEvent, this.resumeEvents);
    }

    /** Unbind an event handler from the resume event. */

  }, {
    key: "removeResume",
    value: function removeResume(resumeEvent) {
      this._removeEvent(resumeEvent, this.resumeEvents);
    }

    /** Unbind an event handler from the resume event. */

  }, {
    key: "clearResume",
    value: function clearResume() {
      this.resumeEvents = [];
    }
  }]);

  return Animator;
}();

exports.default = Animator;