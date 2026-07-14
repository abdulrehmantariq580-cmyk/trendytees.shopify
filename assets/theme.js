/* ============================================================================
   Theme Global JS Foundation - Trendy Tees
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Trendy Tees Theme - JS Initialized');

  // --- Initialize Lenis Smooth Scrolling ---
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
    console.log('Lenis Smooth Scroll Initialized');
  }



  // Register GSAP ScrollTrigger if GSAP is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('GSAP & ScrollTrigger Ready');
  }

  // Global utility functions for animations and interactions can be added here
  
  // Animation Helper: Reveal text smoothly
  window.animateTextReveal = (selector) => {
    if (typeof SplitType === 'undefined' || typeof gsap === 'undefined') return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const split = new SplitType(el, { types: 'lines, words, chars' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        }
      });
    });
  };
});
