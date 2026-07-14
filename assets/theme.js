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
});
