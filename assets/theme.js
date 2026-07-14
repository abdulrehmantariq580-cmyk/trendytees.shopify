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



  // --- Sticky Header Logic ---
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
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

  // --- Mobile Drawer Logic ---
  const menuToggle = document.querySelector('.site-header__menu-toggle');
  const mobileMenu = document.getElementById('MobileMenu');
  const drawerClosers = document.querySelectorAll('[data-drawer-close]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    drawerClosers.forEach(closer => {
      closer.addEventListener('click', () => {
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Page Transitions ---
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 100);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    if (
      link.target === '_blank' ||
      link.getAttribute('href').startsWith('#') ||
      link.getAttribute('href').startsWith('mailto:') ||
      link.getAttribute('href').startsWith('tel:') ||
      link.getAttribute('href').includes('javascript') ||
      link.hostname !== window.location.hostname ||
      e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.defaultPrevented
    ) {
      return;
    }

    e.preventDefault();
    const href = link.getAttribute('href');

    document.body.classList.remove('is-loaded');
    document.body.classList.add('is-transitioning');

    setTimeout(() => {
      window.location.href = href;
    }, 400); // Wait for CSS transition
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.body.classList.remove('is-transitioning');
      document.body.classList.add('is-loaded');
    }
  });

  // --- Footer Stagger Animation ---
  if (typeof gsap !== 'undefined') {
    gsap.from('.footer-block', {
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }
});
