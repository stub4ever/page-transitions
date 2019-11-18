/* eslint-disable no-undef */
// require('./polyfill');
import Util from './utils/Util';
// import Resizer from "./utils/Resizer";

import imagesLoaded from 'imagesloaded';

import barba from './vendor/barba';
import barbaCss from './vendor/barba-css';

// tell Barba to use the css module
barba.use(barbaCss);

// init Barba
barba.init({
  transitions: [
    {
      // css classes will look like `.fade-xxx-[-xxx]`
      name: 'anim-fade',
      beforeEnter() {
        // Add hooks before user go through other page scroll back to top => Prevent to stuck in the middle
        window.scrollTo({
          top: 0, // scroll to top 0 in a smooth way
          behavior: 'smooth',
        });
      },
    },
  ],
});
