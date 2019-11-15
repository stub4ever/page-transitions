// ========================================================
// POLYFILL
// ========================================================

// ========================================================
// HASH
// ========================================================
function hashReplace(h) {
	if (h.substr(0, 1) != "#") h = "#" + h;
	typeof window.location.replace == "function"
		? window.location.replace(window.location.pathname + h)
		: (window.location.hash = h);
}

// ========================================================
// WINDOW RESIZE
// ========================================================
var SCREENSIZE = 0,
	WIDESCREEN = false;

function windowResize() {
	if (window.getComputedStyle != null) {
		SCREENSIZE = window
			.getComputedStyle(document.body, ":after")
			.getPropertyValue("content");
		SCREENSIZE = parseInt(SCREENSIZE.replace(/["']{1}/gi, ""));
		if (isNaN(SCREENSIZE)) SCREENSIZE = 0;
	}
}

// ========================================================
// GSAP TIMELINE - ADD DELAY
// ========================================================

/**
 * Add a delay at the end of the timeline (or at any label)
 * @param {number} delay    Seconds to wait
 * @param {string} position Label name where to start the delay
 *
 * Usage: tl.addDelay(4); //easy!
 */
TimelineMax.prototype.addDelay = function(delay, position) {
	var delayAttr;
	if (typeof delay === "undefined" || isNaN(delay)) {
		return this; //skip if invalid parameters
	}
	if (typeof position === "undefined") {
		delayAttr = "+=" + delay; //add delay at the end of the timeline
	} else if (typeof position === "string") {
		delayAttr = position + "+=" + delay; //add delay after label
	} else if (!isNaN(position)) {
		delayAttr = delay + position; //if they're both numbers, assume absolute position
	} else {
		return this; //nothing done
	}
	return this.set({}, {}, delayAttr);
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = 
		Element.prototype.msMatchesSelector ||
		Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {
	function CustomEvent(event, params) {
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		var evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(
			event,
			params.bubbles,
			params.cancelable,
			params.detail
		);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function(t, b, c, d) {
	t /= d / 2;
	if (t < 1) return (c / 2) * t * t + b;
	t--;
	return (-c / 2) * (t * (t - 2) - 1) + b;
};

/* JS Utility Classes */
(function() {
	// make focus ring visible only for keyboard navigation (i.e., tab key)
	var focusTab = document.getElementsByClassName("js-tab-focus");
	function detectClick() {
		if (focusTab.length > 0) {
			resetFocusTabs(false);
			window.addEventListener("keydown", detectTab);
		}
		window.removeEventListener("mousedown", detectClick);
	}

	function detectTab(event) {
		if (event.keyCode !== 9) return;
		resetFocusTabs(true);
		window.removeEventListener("keydown", detectTab);
		window.addEventListener("mousedown", detectClick);
	}

	function resetFocusTabs(bool) {
		var outlineStyle = bool ? "" : "none";
		for (var i = 0; i < focusTab.length; i++) {
			focusTab[i].style.setProperty("outline", outlineStyle);
		}
	}
	window.addEventListener("mousedown", detectClick);
})();
