/* eslint-disable no-undef */
// require('./polyfill');
import Util from './utils/Util';
// import Resizer from "./utils/Resizer";

import imagesLoaded from 'imagesloaded';

import barba from './vendor/barba';
import barbaCss from './vendor/barba-css';

const bodyTag = document.querySelector("body");

// tell Barba to use the css module
barba.use(barbaCss);

// init Barba
barba.init({
  // Views allow you to have some logic related to the content of a namespace
  views: [
    {
      namespace: 'feed',
      beforeEnter() {
        bodyTag.classList.add('feed');
      },
      beforeLeave() {
        bodyTag.classList.remove('feed');
      },
    },
  ],
  transitions: [
    {
      // css classes will look like `.fade-xxx-[-xxx]`
      name: 'anim-fade',
      // Data argument is an object passed to all transition hooks, view hooks subset and custom rules
      // eslint-disable-next-line no-unused-vars
      beforeEnter({ current, next, trigger }) { // Passed barba data agrument
        // Current - Current page related
        // Next - Next page related
        // Trigger - Link that triggered the transition

        // Get 3 current navlinks properties
        const headerLinks = document.querySelectorAll('header a');
        // Barba provide data agrument to get properties url object
        const hrefNextURLPath = next.url.path; // Getting the next page url path

        headerLinks.forEach((link) => {
          // Check if the next page link is equal to the right page
          // add selected class or remove
          if (link.getAttribute('href') === hrefNextURLPath) {
            link.classList.add('selected');
          } else {
            link.classList.remove('selected'); // clear all links
          }
        });

        // Add hooks before user go through other page scroll back to top => Prevent to stuck in the middle
        window.scrollTo({
          top: 0, // scroll to top 0 in a smooth way
          behavior: 'smooth',
        });
      },
    },
  ],
});

