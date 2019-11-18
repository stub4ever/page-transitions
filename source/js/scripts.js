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
    },
  ],
});
