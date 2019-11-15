
// require('./polyfill');
import Util from "./utils/Util";
// import Resizer from "./utils/Resizer";

import imagesLoaded from 'imagesloaded';

// document.addEventListener('lazybeforeunveil', function(e){
//     var bg = e.target.getAttribute('data-bg');
//     if(bg){
//         e.target.style.backgroundImage = 'url(' + bg + ')';
//     }
// });

imagesLoaded( document.body, function() {        
    // Remove loading class from body 
    const loadingWrapper = document.querySelector('.loading__wrapper');
    if(Util.hasClass(document.body,'loading')) {
        Util.removeClass(loadingWrapper, 'is--visible');
        Util.addClass(loadingWrapper, 'is--invisible');
        Util.removeClass(document.body, 'loading');
    }    
});


