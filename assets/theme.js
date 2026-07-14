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

  // --- Custom Cursor Logic ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (cursorDot && cursorOutline && typeof gsap !== 'undefined') {
    gsap.set(cursorDot, {xPercent: -50, yPercent: -50});
    gsap.set(cursorOutline, {xPercent: -50, yPercent: -50});
    
    const xToDot = gsap.quickTo(cursorDot, "x", {duration: 0.1, ease: "power3"});
    const yToDot = gsap.quickTo(cursorDot, "y", {duration: 0.1, ease: "power3"});
    const xToOutline = gsap.quickTo(cursorOutline, "x", {duration: 0.6, ease: "power3.out"});
    const yToOutline = gsap.quickTo(cursorOutline, "y", {duration: 0.6, ease: "power3.out"});

    window.addEventListener("mousemove", (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToOutline(e.clientX);
      yToOutline(e.clientY);
    });

    document.body.addEventListener("mouseover", (e) => {
      if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')){
         cursorOutline.classList.add('hover');
      }
    });
    document.body.addEventListener("mouseout", (e) => {
      if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')){
         cursorOutline.classList.remove('hover');
      }
    });
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
