/* ══════════════════════════════════════════
   APP.JS — Three.js 3D, GSAP, particles, interactions
══════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

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
    { pct: 18,  msg: 'LOADING PROFILE...' },
    { pct: 42,  msg: 'SCANNING SKILLS...' },
    { pct: 68,  msg: 'LOADING PROJECTS...' },
    { pct: 88,  msg: 'STARTING ZORO...' },
    { pct: 100, msg: 'READY. WELCOME.' },
  ];

  let i = 0;
  function next() {
    if (i >= steps.length) return;
    const s = steps[i++];
    bar.style.width = s.pct + '%';
    status.textContent = s.msg;
    if (i < steps.length) setTimeout(next, 350 + Math.random() * 200);
    else setTimeout(dismiss, 500);
  }
  setTimeout(next, 200);

  function dismiss() {
    gsap.to(loader, {
      opacity: 0, duration: 0.8, ease: 'power2.inOut',
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

  document.addEventListener('mousemove', e => {
    gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
    gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.22, ease: 'power2.out' });
  });

  document.querySelectorAll('a, button, .tilt-card, .zoro-chip, .zoro-fab, .mission-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ══════════════════════════════════════════
   3. THREE.JS HERO SCENE
══════════════════════════════════════════ */
(function initThreeScene() {
  const hero = document.getElementById('hero');
  if (!hero || typeof THREE === 'undefined') return;

  // Remove old 2D canvas if present
  const old = document.getElementById('heroCanvas');
  if (old) old.remove();

  let W = hero.offsetWidth;
  let H = hero.offsetHeight;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  /* Renderer */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '0'
  });
  hero.insertBefore(renderer.domElement, hero.firstChild);

  /* Scene & Camera */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
  camera.position.set(0, 0, 38);

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.15));

  const lights = [
    { color: 0xff9a8b, intensity: 4, range: 80, pos: [18, 18, 12] },   // coral
    { color: 0x7dd9b2, intensity: 3, range: 80, pos: [-18, -14, 8]  },  // mint
    { color: 0xf4a7b9, intensity: 2, range: 60, pos: [-6,  20, -6]  },  // rose
    { color: 0x6ecbce, intensity: 2, range: 60, pos: [14, -18, -4]  },  // sky
  ].map(l => {
    const pl = new THREE.PointLight(l.color, l.intensity, l.range);
    pl.position.set(...l.pos);
    scene.add(pl);
    return pl;
  });

  /* ── Floating wireframe shapes ─────────── */
  const shapeDefs = [
    { Geo: THREE.IcosahedronGeometry, args: [3.2, 0],  color: 0xffb5a7, x: -14, y:  7, z: -8  },  // coral
    { Geo: THREE.OctahedronGeometry,  args: [2.4, 0],  color: 0x7dd9b2, x:  15, y: -5, z: -12 },  // mint
    { Geo: THREE.IcosahedronGeometry, args: [2.0, 0],  color: 0xfda4af, x:  -7, y: -9, z: -4  },  // rose
    { Geo: THREE.TetrahedronGeometry, args: [2.8, 0],  color: 0xa8dadc, x:  12, y: 12, z: -14 },  // sky
    { Geo: THREE.OctahedronGeometry,  args: [1.8, 0],  color: 0xffc9a0, x: -16, y: -1, z: -16 },  // peach
    { Geo: THREE.IcosahedronGeometry, args: [1.4, 0],  color: 0xffb5a7, x:   6, y:-13, z: -6  },  // coral
    { Geo: THREE.TetrahedronGeometry, args: [1.6, 0],  color: 0xa8e6cf, x:  18, y:  4, z: -10 },  // mint
    { Geo: THREE.OctahedronGeometry,  args: [2.6, 0],  color: 0xf4a7b9, x:  -4, y: 14, z: -18 },  // rose
  ];

  const shapes = shapeDefs.map(d => {
    const geo = new d.Geo(...d.args);
    const mat = new THREE.MeshPhongMaterial({
      color: d.color,
      emissive: d.color,
      emissiveIntensity: 0.08,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.x, d.y, d.z);
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
    scene.add(mesh);
    return {
      mesh,
      rx: (Math.random() - 0.5) * 0.007,
      ry: (Math.random() - 0.5) * 0.009,
      initY: d.y,
      floatAmp: 0.8 + Math.random() * 0.6,
      floatOff: Math.random() * Math.PI * 2,
      floatSpd: 0.25 + Math.random() * 0.2,
    };
  });

  /* ── Solid (non-wireframe) inner shapes for depth ── */
  const solidDefs = [
    { Geo: THREE.IcosahedronGeometry, args: [1.6, 1], color: 0xe05a47, x: -10, y:  3, z: -20 },
    { Geo: THREE.OctahedronGeometry,  args: [1.2, 0], color: 0x0d6e5c, x:  9,  y: -8, z: -22 },
  ];
  solidDefs.forEach(d => {
    const geo = new d.Geo(...d.args);
    const mat = new THREE.MeshPhongMaterial({
      color: d.color, transparent: true, opacity: 0.18, wireframe: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.x, d.y, d.z);
    scene.add(mesh);
    shapes.push({ mesh, rx: 0.003, ry: 0.004, initY: d.y, floatAmp: 0.5, floatOff: Math.random() * Math.PI * 2, floatSpd: 0.15 });
  });

  /* ── Particle field ─────────────────────── */
  const PCOUNT = isMobile() ? 120 : 280;
  const pPos   = new Float32Array(PCOUNT * 3);
  const pColors = new Float32Array(PCOUNT * 3);
  const palette = [
    [1.0, 0.60, 0.55],  // coral
    [0.49, 0.85, 0.70], // mint
    [0.95, 0.65, 0.72], // rose
    [0.43, 0.79, 0.81], // sky
  ];
  for (let i = 0; i < PCOUNT; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 90;
    pPos[i*3+1] = (Math.random() - 0.5) * 70;
    pPos[i*3+2] = (Math.random() - 0.5) * 30 - 5;
    const c = palette[Math.floor(Math.random() * palette.length)];
    pColors[i*3] = c[0]; pColors[i*3+1] = c[1]; pColors[i*3+2] = c[2];
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.22, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true,
  });
  const particleField = new THREE.Points(pGeo, pMat);
  scene.add(particleField);

  /* ── Mouse tracking ─────────────────────── */
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouseX = ((e.clientX - r.left) / W - 0.5) * 2;
    mouseY = ((e.clientY - r.top)  / H - 0.5) * 2;
  });

  /* ── Resize ─────────────────────────────── */
  window.addEventListener('resize', () => {
    W = hero.offsetWidth;
    H = hero.offsetHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });

  /* ── Animation loop ─────────────────────── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Smooth camera parallax on mouse
    targetX += (mouseX * 4 - targetX) * 0.025;
    targetY += (-mouseY * 2.5 - targetY) * 0.025;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(scene.position);

    // Orbit lights
    lights[0].position.x = Math.sin(t * 0.4) * 22;
    lights[0].position.y = Math.cos(t * 0.28) * 18;
    lights[1].position.x = Math.cos(t * 0.35) * 20;
    lights[1].position.y = Math.sin(t * 0.5)  * 15;

    // Rotate & float each shape
    shapes.forEach(s => {
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      s.mesh.position.y = s.initY + Math.sin(t * s.floatSpd + s.floatOff) * s.floatAmp;
    });

    // Slowly drift particle field
    particleField.rotation.y += 0.0006;
    particleField.rotation.x += 0.0002;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ══════════════════════════════════════════
   4. HERO ENTRANCE & TYPING
══════════════════════════════════════════ */
function initHeroEntrance() {
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
  if (!el) return;

  function typeLoop() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
    }
    setTimeout(typeLoop, deleting ? 52 : 88);
  }
  typeLoop();

  // Stagger hero elements in
  document.querySelectorAll('#hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 100 + i * 150);
  });

  initScrollReveals();
}

/* ══════════════════════════════════════════
   5. SCROLL REVEALS
══════════════════════════════════════════ */
function initScrollReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal-up:not(#hero *), .reveal-left, .reveal-right')
    .forEach(el => obs.observe(el));

  /* Skill XP bars */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width;
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-xp-fill').forEach(b => barObs.observe(b));

  /* Counters */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); cntObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number[data-count]').forEach(c => cntObs.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const start  = performance.now();
  const dur    = 1600;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })(performance.now());
}

/* ══════════════════════════════════════════
   6. NAVBAR
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    const sy = window.scrollY + 120;
    let cur = '';
    ['about','skills','experience','projects','services','contact'].forEach(id => {
      const s = document.getElementById(id);
      if (s && s.offsetTop <= sy) cur = id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }, { passive: true });

  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('mobileClose');
  if (burger && menu && close) {
    burger.addEventListener('click', () => menu.classList.add('open'));
    close.addEventListener('click',  () => menu.classList.remove('open'));
    document.querySelectorAll('.mobile-link').forEach(l =>
      l.addEventListener('click', () => menu.classList.remove('open')));
  }
})();

/* ══════════════════════════════════════════
   7. 3D TILT on cards
══════════════════════════════════════════ */
(function initTilt() {
  if (isMobile()) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(900px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
      setTimeout(() => (card.style.transition = ''), 550);
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
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
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
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const txt = btn.querySelector('.btn-text');
    txt.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      txt.textContent = 'Send Message';
      if (success) {
        success.style.display = 'block';
        gsap.from(success, { opacity: 0, y: 8, duration: 0.4 });
        setTimeout(() => (success.style.display = 'none'), 5000);
      }
    }, 1400);
  });
})();

/* ══════════════════════════════════════════
   10. SMOOTH ANCHOR SCROLL
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════════════════════════════════════
   11. HERO PARALLAX
══════════════════════════════════════════ */
(function () {
  if (isMobile()) return;
  const content = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (content) content.style.transform = `translateY(${window.scrollY * 0.16}px)`;
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   12. ZORO FAB
══════════════════════════════════════════ */
window.openZoro  = () => document.getElementById('zoroPanel')?.classList.add('open');
window.closeZoro = () => document.getElementById('zoroPanel')?.classList.remove('open');

document.getElementById('zoroFab')?.addEventListener('click', () => {
  const panel = document.getElementById('zoroPanel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open'))
    setTimeout(() => document.getElementById('zoroInput')?.focus(), 360);
});

document.getElementById('heroZoroBtn')?.addEventListener('click', () => {
  window.openZoro();
  setTimeout(() => document.getElementById('zoroInput')?.focus(), 400);
});
