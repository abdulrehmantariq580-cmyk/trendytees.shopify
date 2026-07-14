/* ============================================================================
   Theme Global JS Foundation - Trendy Tees
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Trendy Tees Theme - JS Initialized');

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
