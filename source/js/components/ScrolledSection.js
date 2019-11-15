import ScrollMagic from "scrollmagic/scrollmagic/minified/ScrollMagic.min";
import "scrollmagic/scrollmagic/minified/plugins/animation.gsap.min";
import "scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min";

import TweenMax from "gsap/src/minified/TweenMax.min";
import TimelineMax from "gsap/src/minified/TimelineMax.min";
import "gsap/CSSPlugin";
import "gsap/ScrollToPlugin";

import Util from "utils/Util";

(function() {
	// Global variables
	var scrollMagicCtrl = new ScrollMagic.Controller({
		globalSceneOptions: { reverse: true } // reverse scenes, when scrolling top
	});
	var tl = new TimelineMax(); // Animation timeline
	var _startTimeline, _setTimeline, _newScene; // Animation Functions

	var ScrolledSection = function(opts) {
		this.options = Util.extend(ScrolledSection.defaults, opts);
		this.selector = document.querySelectorAll(this.options.selector);
		this.sections = [];

		// The apply method is used to bind the parent object to the scope of the callback
		this.options.onInit.apply(this, arguments);
		this.options.onCompleted.apply(this, arguments);

		this.initSection(this.selector);

		for (var i = 0; i < this.sections.length; i++) {
			_animatedSection(
				this.sections[i].section.node,
				this.sections[i].section.type
			);
			_stickySection(
				this.sections[i].section.node,
				this.sections[i].section.type
			);
			_setAnchorActive(this.sections[i].section.node, this.options);
		}

		_initScrollTo(this.options);
	};

	var ScrolledSectionItem = function(section) {
		this.node = section.node;
		this.type = this.node.dataset.scrolledSection;
	};

	ScrolledSection.prototype.initSection = function(sections) {
		// Get all id that contain 'section'
		if (sections.length > 0) {
			for (var i = 0; i < sections.length; i++) {
				this.sections[i] = {
					section: new ScrolledSectionItem({ node: sections[i] })
				};
			}
		}
	};

	function _animatedSection(section, type) {
		switch (type) {
			case "styleAnim":
				_newScene = new ScrollMagic.Scene({
					triggerElement: "#" + section.id,
					triggerHook: 0.7
				})
					.addIndicators({
						name: section.id + " Timeline",
						colorTrigger: "red",
						colorStart: "green",
						indent: 25
					})

					// add listeners
					.on("enter", function() {
						Util.removeClass(section, "is--invisible");
						Util.addClass(section, "is--visible");
					})
					// remove listeners
					.on("leave", function() {
						Util.removeClass(section, "is--visible");
						Util.addClass(section, "is--invisible");

						// Reset Animation end
						section.addEventListener("animationend", function() {
							setTimeout(function() {
								// add a delay between the end of animation and slideshow reset - improve animation performance
								Util.removeClass(section, "is--invisible");
							}, 100);
						});
					})
					.addTo(scrollMagicCtrl);
				break;

			default:
		}
	}

	function _stickySection(section, type) {
		switch (type) {
			case "subheader-sticky":
				_newScene = new ScrollMagic.Scene({
					triggerElement: "#" + section.id,
					triggerHook: 0
				})
					.setPin("#" + section.id)
					// .addIndicators({name: "2 (duration: 0)"}) // add indicators (requires plugin)

					// add listeners
					.on("enter", function() {
						section.classList.remove("scrolled-sticky--out");
						section.classList.add("scrolled-sticky--in");
					})
					// remove listeners
					.on("leave", function() {
						section.classList.remove("scrolled-sticky--in");
						section.classList.add("scrolled-sticky--out");
					})
					.addTo(scrollMagicCtrl);
				break;

			default:
		}
	}

	function _setAnchorActive(section, options) {
		_newScene = new ScrollMagic.Scene({
			triggerElement: "#" + section.id,
			duration: document.querySelector("#" + section.id).clientHeight, // Get the height duration of this section
			triggerHook: 0.7
		})
			// .addIndicators ({ name: section.id+' anchor', colorTrigger: 'red', colorStart: 'green', indent: 25 })

			.setClassToggle("#target-" + section.id, options.anchorActiveClass) // target id => #target-[name]
			.addTo(scrollMagicCtrl);
	}

	function _initScrollTo(options) {
		var headerOffsetY =
			options.headerSelector.length > 0
				? document.querySelector(options.headerSelector).clientHeight
				: 0; // if string is empty return 0

		// Change behaviour of controller
		// to animate scroll instead of jump
		scrollMagicCtrl.scrollTo(function(target) {
			TweenMax.to(window, 0.9, {
				scrollTo: {
					y: target, // allows user to kill scroll action smoothly
					offsetY: headerOffsetY, // Set offset from the header
					autoKill: false // allows user to kill scroll action smoothly
				},
				ease: Cubic.easeInOut
			});
		});

		document.addEventListener(
			"click",
			function(e) {
				var target = e.target,
					body = document.querySelector("body"),
					id = target.getAttribute("href"),
					regex = /(^#|[^&]#)([a-z0-9]+)/gi; // include hash #

				if (id !== null && id.match(regex)) {
					if (id.length > 0) {
						e.preventDefault();
						body.classList.remove("menu-is-active"); // remove menu active
						scrollMagicCtrl.scrollTo(id);

						// if(window.history && window.history.pushState) {
						//     history.pushState("", document.title, id);
						// }
					}
				}
			},
			false
		);
	}

	ScrolledSection.defaults = {
		selector: "[data-scrolled-section]",
		headerSelector: "",
		anchorActiveClass: "",
		onInit: function() {},
		onCompleted: function() {}
	};

	//initialize the ScrolledSection objects
	new ScrolledSection({
		anchorActiveClass: "s-tabs__item--selected"
		// headerSelector: '#sub-header'
	});

	window.ScrolledSection = ScrolledSection;
})();

export default ScrolledSection;

//         // PARALAX SCENE
//         // var _pFrom30 = section.querySelectorAll('.paralax-groupFrom30');
//         // new ScrollMagic.Scene({triggerElement: '#'+section.id, triggerHook: 1, duration: "100%"})
//         // .setTween(TweenMax.from(_pFrom30, 1, {y: '30px',  ease:Power0.easeNone}))
//         // .addTo(scrollMagicCtrl);

//         // https://codepen.io/karlovidek/pen/JvrZBG
//         // https://www.degordian.com/education/blog/web-animations-workflow-principle-gsap-timelinemax/
