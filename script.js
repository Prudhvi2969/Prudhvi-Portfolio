/* ===================================================
   PORTFOLIO JS – Chaparla Prudhvi Harshith
   =================================================== */

'use strict';

/* ── DOM REFS ── */
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const navLinksEl   = document.getElementById('nav-links');
const navLinks     = document.querySelectorAll('.nav-link');
const carouselTrack= document.getElementById('carouselTrack');
const dots         = document.querySelectorAll('#carouselDots .dot');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const themeToggle  = document.getElementById('themeToggle');

/* =========================================
   0. THEME TOGGLE (dark ↔ light)
   ========================================= */
(function initTheme() {
  const root      = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  // Determine initial theme: saved > system preference > dark default
  const saved  = localStorage.getItem(STORAGE_KEY);
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initial = saved || system;

  if (initial === 'light') root.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';

    if (next === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem(STORAGE_KEY, next);
  });
})();

/* =========================================
   1. NAVBAR – scroll style + active link
   ========================================= */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ── Mobile hamburger ── */
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

/* Close mobile menu on link click */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* =========================================
   2. SCROLL-REVEAL (IntersectionObserver)
   ========================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 120);
        });
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================
   3. CERTIFICATE CAROUSEL
   ========================================= */
let currentSlide = 0;
const totalSlides = dots.length;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(+dot.dataset.index));
});

/* Auto-advance carousel every 4 seconds */
let carouselTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);

const carouselWrap = document.querySelector('.carousel-wrap');
carouselWrap.addEventListener('mouseenter', () => clearInterval(carouselTimer));
carouselWrap.addEventListener('mouseleave', () => {
  carouselTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
});

/* Touch/swipe support for carousel */
let touchStartX = 0;
carouselTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
carouselTrack.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
});

/* =========================================
   4. CONTACT FORM VALIDATION
   ========================================= */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');

  // Validate name
  if (!nameInput.value.trim()) {
    setError('name', true);
    valid = false;
  } else {
    setError('name', false);
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    setError('email', true);
    valid = false;
  } else {
    setError('email', false);
  }

  // Validate message
  if (!messageInput.value.trim()) {
    setError('message', true);
    valid = false;
  } else {
    setError('message', false);
  }

  if (valid) {
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending…';

    // Simulate sending (no backend)
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('show');
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Send Message';
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  }
});

function setError(fieldId, hasError) {
  const group = document.getElementById(fieldId).closest('.form-group');
  group.classList.toggle('has-error', hasError);
}

/* Clear errors on input */
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => setError(id, false));
});

/* =========================================
   5. SMOOTH SCROLL POLYFILL fallback
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================================
   6. SKILL TAG HOVER SPARKLE (micro-anim)
   ========================================= */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.08) translateY(-2px)';
    this.style.boxShadow = '0 4px 16px rgba(99,102,241,0.25)';
  });
  tag.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
});

/* =========================================
   7. HERO WORD-BY-WORD ANIMATION
   ========================================= */
(function initWordAnimation() {
  const container = document.getElementById('typed-title');
  if (!container) return;

  const phrase    = 'Data Analyst';
  const words     = phrase.split(' ');
  const WORD_GAP  = 380;   // ms between each word appearing
  const HOLD_MS   = 2600;  // ms to hold the full phrase before resetting
  const FADE_MS   = 300;   // ms for each word to fade out on reset

  /** Build the word <span> elements once */
  function buildWords() {
    container.innerHTML = '';
    return words.map(word => {
      const span = document.createElement('span');
      span.className = 'hero-word';
      span.textContent = word;
      container.appendChild(span);
      return span;
    });
  }

  /** Reveal words one at a time */
  function revealWords(spans) {
    return new Promise(resolve => {
      spans.forEach((span, i) => {
        setTimeout(() => {
          span.classList.add('visible');
          if (i === spans.length - 1) {
            // All words shown – wait, then resolve
            setTimeout(resolve, HOLD_MS);
          }
        }, i * WORD_GAP);
      });
    });
  }

  /** Fade out all words quickly */
  function hideWords(spans) {
    return new Promise(resolve => {
      spans.forEach(span => {
        span.style.transition = `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease, filter ${FADE_MS}ms ease`;
        span.classList.remove('visible');
      });
      setTimeout(resolve, FADE_MS + 80);
    });
  }

  /** Full animation loop */
  async function runLoop() {
    while (true) {
      const spans = buildWords();
      // Small rAF tick to let DOM paint before triggering transitions
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await revealWords(spans);
      await hideWords(spans);
    }
  }

  // Start after a short delay so the hero entrance animation finishes first
  setTimeout(runLoop, 900);
})();

/* ── Init ── */
updateActiveNav();
