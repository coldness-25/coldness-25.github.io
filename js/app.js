/* ══════════════════════════════════════════
   APP.JS — Main interactions, animations, particles
══════════════════════════════════════════ */

/* ── GSAP registration ─────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── State ─────────────────────────────── */
const isMobile = () => window.innerWidth <= 768;

/* ══════════════════════════════════════════
   1. LOADING SCREEN
══════════════════════════════════════════ */
(function initLoader() {
  document.body.classList.add('loading');

  const bar    = document.getElementById('loaderBar');
  const status = document.getElementById('loaderStatus');
  const loader = document.getElementById('loader');

  const steps = [
    { pct: 15, msg: 'LOADING OPERATOR PROFILE...' },
    { pct: 38, msg: 'SCANNING SKILL MATRIX...' },
    { pct: 62, msg: 'DECRYPTING MISSION FILES...' },
    { pct: 84, msg: 'CALIBRATING ZORO INTELLIGENCE...' },
    { pct: 100, msg: 'SYSTEM READY — WELCOME.' },
  ];

  let i = 0;
  function next() {
    if (i >= steps.length) return;
    const s = steps[i++];
    bar.style.width = s.pct + '%';
    status.textContent = s.msg;
    if (i < steps.length) setTimeout(next, 380 + Math.random() * 220);
    else setTimeout(dismissLoader, 480);
  }
  setTimeout(next, 200);

  function dismissLoader() {
    gsap.to(loader, {
      opacity: 0, duration: 0.7, ease: 'power2.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        document.body.classList.remove('loading');
        initHeroEntrance();
      }
    });
  }
})();

/* ══════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════ */
(function initCursor() {
  if (isMobile()) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot,  { x: mx, y: my, duration: 0.08, ease: 'none' });
    gsap.to(ring, { x: mx, y: my, duration: 0.22, ease: 'power2.out' });
  });

  document.querySelectorAll('a, button, .tilt-card, .zoro-chip, .zoro-fab, .mission-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ══════════════════════════════════════════
   3. PARTICLE CANVAS (Hero)
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouseX = 0, mouseY = 0;
  const COUNT = isMobile() ? 60 : 110;
  const MAX_DIST = 130;
  const MOUSE_RADIUS = 160;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.6 + 0.5;
      this.alpha = Math.random() * 0.55 + 0.15;
      this.color = Math.random() > 0.6 ? '139,92,246' : Math.random() > 0.5 ? '6,214,160' : '240,171,252';
    }
    update() {
      // Slight mouse repulsion
      const dx = this.x - mouseX, dy = this.y - mouseY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.012;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      this.vx *= 0.985;
      this.vy *= 0.985;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ══════════════════════════════════════════
   4. HERO ENTRANCE
══════════════════════════════════════════ */
function initHeroEntrance() {
  // Typing animation
  const words = [
    'Business Analyst',
    'Strategic Consultant',
    'Problem Solver',
    'Data Storyteller',
    'Process Architect',
    'Change Driver',
  ];
  let wIdx = 0, cIdx = 0, deleting = false;
  const el = document.getElementById('heroTyped');

  function typeLoop() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
    }
    setTimeout(typeLoop, deleting ? 55 : 90);
  }
  typeLoop();

  // Staggered hero reveal
  const revealEls = document.querySelectorAll('#hero .reveal-up');
  revealEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 100 + i * 160);
  });

  // Scroll-based reveals for all other sections
  initScrollReveals();
}

/* ══════════════════════════════════════════
   5. SCROLL REVEALS
══════════════════════════════════════════ */
function initScrollReveals() {
  const allReveal = document.querySelectorAll('.reveal-up:not(#hero *), .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  allReveal.forEach(el => observer.observe(el));

  // Skill bar fills
  const xpBars = document.querySelectorAll('.skill-xp-fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.width;
        entry.target.style.width = target;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  xpBars.forEach(b => barObserver.observe(b));

  // Counter animations
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const cntObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        cntObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cntObserver.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // ease-out-cubic
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

/* ══════════════════════════════════════════
   6. NAVBAR
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    const sections = ['about','skills','experience','projects','services','contact'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  // Mobile menu
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('mobileClose');
  const mobLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => menu.classList.add('open'));
  close.addEventListener('click',  () => menu.classList.remove('open'));
  mobLinks.forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ══════════════════════════════════════════
   7. TILT CARDS
══════════════════════════════════════════ */
(function initTilt() {
  if (isMobile()) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX =  dy * -7;
      const rotY =  dx *  7;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
})();

/* ══════════════════════════════════════════
   8. MAGNETIC BUTTONS
══════════════════════════════════════════ */
(function initMagnetic() {
  if (isMobile()) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  });
})();

/* ══════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════ */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.querySelector('.btn-text');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    txt.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate sending (replace with Formspree/EmailJS endpoint)
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      txt.textContent = 'Send Message';
      success.style.display = 'block';
      gsap.from(success, { opacity: 0, y: 10, duration: 0.4 });
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1400);
  });
})();

/* ══════════════════════════════════════════
   10. SMOOTH SCROLL for anchor links
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   11. SECTION BACKGROUND PARALLAX (subtle)
══════════════════════════════════════════ */
(function initParallax() {
  if (isMobile()) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.18}px)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   12. ZORO FAB — Open/Close (wired in zoro.js too)
══════════════════════════════════════════ */
window.openZoro  = function() { document.getElementById('zoroPanel').classList.add('open'); };
window.closeZoro = function() { document.getElementById('zoroPanel').classList.remove('open'); };

document.getElementById('zoroFab').addEventListener('click', () => {
  const panel = document.getElementById('zoroPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    setTimeout(() => document.getElementById('zoroInput').focus(), 350);
  }
});

document.getElementById('heroZoroBtn').addEventListener('click', () => {
  window.openZoro();
  setTimeout(() => document.getElementById('zoroInput').focus(), 400);
});

/* ══════════════════════════════════════════
   13. CANVAS RESIZE on loader dismiss
══════════════════════════════════════════ */
// Handled inside initParticles via window resize listener.
// Force a resize event after fonts/layout settle.
window.addEventListener('load', () => {
  setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
});
