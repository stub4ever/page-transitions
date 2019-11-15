import Util from "./utils/Util";

// https://tympanus.net/codrops/2019/01/24/layer-motion-slideshow/
// https://tympanus.net/Development/LayerMotionSlideshow/


// Learn the basic

(function() {
	var Cslider = function(opts) {
		this.options = csliderAssignOptions(Cslider.defaults , opts);
		this.element = this.options.element;
		this.prevBtn = this.element.querySelector('.js-cslider-prev'); 
		this.nextBtn = this.element.querySelector('.js-cslider-next'); 
		
		this.list = [];	
		for (var i = 0, l = this.options.content.length; i < l; i++) {			
			this.list[i] = {	
				content: new CSliderContent(i, this.options.content[i], this),
				image: new CSliderImage(i, this.options.image[i], this)
			}
		}
		
		this.index = this.options.selected; // index slide
		this.itemsLength = this.list.length;
		
		this.isChanging = false;
		// this.autoplayId = false;
		// this.autoplayPaused = false;
		this.navigation = false;
		// this.navCurrentLabel = false;
		// this.ariaLive = false;
		this.moveFocus = false;
		this.animating = false;
		// this.supportAnimation = Util.cssSupports('transition');
		
		initCslider(this);
		initCsliderEvents(this);
		initAnimationEndEvents(this);
		
		this.setActiveSlide();
	};
	
	Cslider.prototype.showNext = function() {
		this.changeSlide(this.index + 1, 'next');
	};
	
	Cslider.prototype.showPrev = function() {
		this.changeSlide(this.index - 1, 'prev');
	};
	
	
	Cslider.prototype.setActiveSlide = function() {
		this.currentSlide = this.list[this.index];
		
		Util.addClass(this.currentSlide.image.element, 'slideshow__item--selected');
		Util.addClass(this.currentSlide.content.element, 'slideshow__item--selected');
	}
	
	
	Cslider.prototype.changeSlide = function(Index, bool) {
		if (this.isChanging) return;

		
		this.isChanging = true;
		if (this.currentSlide) {
			Util.addClass(this.currentSlide.image.element, 'slideshow__item--selected');
			Util.addClass(this.currentSlide.content.element, 'slideshow__item--selected');	
		}
		this.prevSlide = this.list[this.index];
		var exitItemClass = getExitItemClass(bool, this.prevSlide, Index);
		var enterItemClass = getEnterItemClass(bool, this.prevSlide, Index);
		
		clearStatus(this);
		
		// Do something before changing
		// this.settings.onBeforeChange.apply(this, arguments);
		
		this.index = (Index % this.itemsLength + this.itemsLength) % this.itemsLength;
		
		// transition between slides
		Util.addClass(this.prevSlide.image.element, exitItemClass);	
		Util.addClass(this.prevSlide.content.element, exitItemClass);	
		Util.addClass(this.list[this.index].image.element, enterItemClass);	
		Util.addClass(this.list[this.index].content.element, enterItemClass);	
		
		this.setActiveSlide();


		// reset slider navigation appearance
		resetCsliderNav(this, this.currentSlide.image.selected, this.prevSlide.image.selected);
		
		// Set onchange duration
		// setTimeout(function() {
		// 	this.settings.onChangeComplete.apply(this, arguments);
		// }.bind(this), this.settings.changeDuration/4);
		

		// reset controls/navigation color themes
		resetCsliderTheme(this, this.currentSlide.image.selected);

		this.isChanging = false;

		emitCsliderEvent(this, 'newItemSelected', this.currentSlide.image.selected);
	}
	
	
	var CSliderImage = function(index, element, parent) {
		this.selected = index;
		this.element = element;
		this.cslider = parent;
		
		// Add crazy animation here in the future or set callbacks
	};
	
	var CSliderContent = function(index, element, parent) {
		this.selected = index;
		this.element = element;
		this.cslider = parent;
	};
	
	
	function csliderAssignOptions(defaults, opts) {
		// initialize the object options
		var mergeOpts = {};
		mergeOpts.element = (typeof opts.element !== "undefined") ? opts.element : defaults.element;
		mergeOpts.image = (typeof opts.image !== "undefined") ? opts.image : defaults.image;
		mergeOpts.content = (typeof opts.content !== "undefined") ? opts.content : defaults.content;
		
		
		mergeOpts.selected = (typeof opts.selected !== "undefined") ? opts.selected : defaults.selected;
		
		mergeOpts.navigation = (typeof opts.navigation !== "undefined") ? opts.navigation : defaults.navigation;
		// mergeOpts.autoplay = (typeof opts.autoplay !== "undefined") ? opts.autoplay : defaults.autoplay;
		// mergeOpts.autoplayInterval = (typeof opts.autoplayInterval !== "undefined") ? opts.autoplayInterval : defaults.autoplayInterval;
		mergeOpts.swipe = (typeof opts.swipe !== "undefined") ? opts.swipe : defaults.swipe;
		return mergeOpts;
	};
	
	
	
	// Cslider.prototype.showItem = function(index) {
	// 	change(this, index, false);
	// };
	
	
	
	function initCslider(cslider) { // basic Cslider settings
		// if no slide has been selected -> select the first one
		
		// // create an element that will be used to announce the new visible slide to SR
		// var srLiveArea = document.createElement('div');
		// Util.setAttributes(srLiveArea, {'class': 'sr-only js-Cslider__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
		// Cslider.element.appendChild(srLiveArea);
		// Cslider.ariaLive = srLiveArea;
	};
	
	function initCsliderEvents(cslider) {
		// if slideshow navigation is on -> create navigation HTML and add event listeners
		if(cslider.options.navigation) {
			var navigation = document.createElement('ol'),
			navChildren = '';
			
			navigation.setAttribute('class', 'slideshow__navigation');
			for(var i = 0; i < cslider.itemsLength; i++) {
				var className = (i == cslider.index) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-cslider__nav-item"' :  'class="slideshow__nav-item js-cslider__nav-item"',
				navCurrentLabel = (i == cslider.index) ? '<span class="sr-only js-cslider__nav-current-label">Current Item</span>' : '';
				navChildren = navChildren + '<li '+className+'><a href="#early-life" class="reset" data-hover><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</a></li>';
			}
			
			navigation.innerHTML = navChildren;
			cslider.navCurrentLabel = navigation.getElementsByClassName('js-cslider__nav-current-label')[0]; 
			cslider.element.appendChild(navigation);
			cslider.navigation = cslider.element.getElementsByClassName('js-cslider__nav-item');
			
			navigation.addEventListener('click', function(event){
				navigateSlide(cslider, event, true);
			});
			navigation.addEventListener('keyup', function(event){
				navigateSlide(cslider, event, (event.key.toLowerCase() == 'enter'));
			});
		}
		
		
		cslider.prevBtn.addEventListener('click', function(event){
			event.preventDefault();
			cslider.showPrev();
			// updateAriaLive(cslider);
		});
		
		cslider.nextBtn.addEventListener('click', function(event){
			event.preventDefault();
			cslider.showNext();
			// updateAriaLive(cslider);
		});
		
		// swipe events
		if(!cslider.options.swipe) {
			//init swipe
			new SwipeContent(cslider.element.querySelector("[data-swipe]"));
			cslider.element.querySelector("[data-swipe]").addEventListener('swipeLeft', function(event){
				cslider.showNext();
			});
			cslider.element.querySelector("[data-swipe]").addEventListener('swipeRight', function(event){
				cslider.showPrev();
			});
		}
	};
	
	
	function initAnimationEndEvents(cslider) {
		// remove animation classes at the end of a slide transition
		for( var i = 0; i < cslider.itemsLength; i++) {
			(function(i){
				cslider.list[i].image.element.addEventListener('animationend', function(){resetAnimationEnd(cslider, cslider.list[i].image.element);});
				cslider.list[i].image.element.addEventListener('transitionend', function(){resetAnimationEnd(cslider, cslider.list[i].image.element);});
				
				cslider.list[i].content.element.addEventListener('animationend', function(){resetAnimationEnd(cslider, cslider.list[i].content.element);});
				cslider.list[i].content.element.addEventListener('transitionend', function(){resetAnimationEnd(cslider, cslider.list[i].content.element);});
			})(i);
		}
	};
	
	function resetAnimationEnd(cslider, item) {
		setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
			
			if(Util.hasClass(item,'slideshow__item--selected')) {
				if(cslider.moveFocus) Util.moveFocus(item);
				emitCsliderEvent(cslider, 'newItemVisible', cslider.index);
				cslider.moveFocus = false;
			}
			
			Util.removeClass(item, 'slideshow__item--slide-out-left slideshow__item--slide-out-right slideshow__item--slide-in-left slideshow__item--slide-in-right');
			item.removeAttribute('aria-hidden');
			cslider.animating = false;
		}, 100);
	};
	
	
	
	function getExitItemClass(bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--slide-out-right' : 'slideshow__item--slide-out-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--slide-out-left' : 'slideshow__item--slide-out-right';
		}
		return className;
	};
	
	function getEnterItemClass(bool, oldIndex, newIndex) {
		var className = '';
		if(bool) {
			className = (bool == 'next') ? 'slideshow__item--slide-in-right' : 'slideshow__item--slide-in-left'; 
		} else {
			className = (newIndex < oldIndex) ? 'slideshow__item--slide-in-left' : 'slideshow__item--slide-in-right';
		}
		return className;
	};
	
	
	function clearStatus(cslider) {
		for (var i = 0, l = cslider.itemsLength; i < l; i++) {
			Util.removeClass(cslider.list[i].image.element, 'slideshow__item--selected');
			Util.removeClass(cslider.list[i].content.element, 'slideshow__item--selected');
		}
	}
	
	
	function navigateSlide(cslider, event, keyNav) { 
		// user has interacted with the cslider navigation -> update visible slide
		var target = ( Util.hasClass(event.target, 'js-cslider__nav-item') ) ? event.target : event.target.closest('.js-cslider__nav-item');
		if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
			event.preventDefault;
			cslider.changeSlide(Util.getIndexInArray(cslider.navigation, target));
			cslider.moveFocus = true;			
		}
	};
	
	
	function resetCsliderNav(cslider, newIndex, oldIndex) {
		if(cslider.navigation) {
			Util.removeClass(cslider.navigation[oldIndex], 'slideshow__nav-item--selected');
			Util.addClass(cslider.navigation[newIndex], 'slideshow__nav-item--selected');
			cslider.navCurrentLabel.parentElement.removeChild(cslider.navCurrentLabel);
			cslider.navigation[newIndex].getElementsByTagName('a')[0].appendChild(cslider.navCurrentLabel);
		}
	};
	
	function resetCsliderTheme(cslider, newIndex) {
		var dataTheme = cslider.list[newIndex].image.element.getAttribute('data-theme');
		if(dataTheme) {
			if(cslider.navigation) cslider.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
		} else {
			if(cslider.navigation) cslider.navigation[0].parentElement.removeAttribute('data-theme');
		}
	};
	
	function emitCsliderEvent(Cslide, eventName, detail) {
		var event = new CustomEvent(eventName, {detail: detail});
		Cslide.element.dispatchEvent(event);
	};
	
	// function updateAriaLive(slideshow) {
	// 	slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selected + 1)+' of '+slideshow.textItems.length;
	// };
	
	Cslider.defaults = {
		element : '',
		navigation : true,
		// autoplay : false,
		// autoplayInterval: 5000,
		swipe: false
	};
	
	window.Cslider = Cslider;
}());

export default Cslider;
