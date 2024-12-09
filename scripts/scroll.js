'use strict';

const btnScrollTo = document.querySelector('#heroBtn');
const section1 = document.querySelector('#emergencyInfo');

// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);
  
    console.log(e.target.getBoundingClientRect());
  
    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  
    console.log(
      'height/width viewport',
      document.documentElement.clientHeight,
      document.documentElement.clientWidth
    );

  
    section1.scrollIntoView({ behavior: 'smooth' });
  });
   