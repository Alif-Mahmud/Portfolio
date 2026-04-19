// ===== THEME TOGGLE =====
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') html.setAttribute('data-theme', 'light');
themeToggle.addEventListener('click', () => {
  const isLight = html.getAttribute('data-theme') === 'light';
  if (isLight) { html.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); }
  else { html.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); }
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => themeToggle.style.transform = '', 400);
});

// ===== PREMIUM LOADER =====
const loaderEl  = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPercent');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18 + 4;
  if (progress >= 100) { progress = 100; clearInterval(loadInterval); }
  loaderBar.style.width = progress + '%';
  loaderPct.textContent = Math.floor(progress) + '%';
  if (progress === 100) {
    setTimeout(() => {
      loaderEl.classList.add('hidden');
      document.body.style.overflow = '';
    }, 400);
  }
}, 80);
document.body.style.overflow = 'hidden'; // prevent scroll during load

// ===== CUSTOM CURSOR =====
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover state on interactive elements
const interactables = 'a, button, .project-card, .tool-item, .skill-tag, .achievement-card, .social-link, input, textarea, .tab-btn, .theme-toggle';
document.querySelectorAll(interactables).forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// Click state
document.addEventListener('mousedown', () => { dot.classList.add('clicking'); ring.classList.add('clicking'); });
document.addEventListener('mouseup',   () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });

// Hide when leaving window
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });


// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveLink();
});
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}

// ===== TYPED ROLES =====
const roles = ['Avionics Engineer', 'Graphic Designer', 'Video Editor', 'Creative Freelancer', 'Coder'];
let ri = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('dynamicRole');

function typeRole() {
  const current = roles[ri];
  if (!deleting) {
    roleEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeRole, 2000); return; }
  } else {
    roleEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 60 : 90);
}
typeRole();

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (Math.random() * 15 + 10) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  p.style.width = (Math.random() * 3 + 1) + 'px';
  p.style.height = p.style.width;
  particlesContainer.appendChild(p);
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let count = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = Math.floor(count);
    if (count >= target) clearInterval(timer);
  }, 25);
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Skill bars
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        // Counters
        entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right,.reveal-fade,.reveal-zoom').forEach(el => {
  revealObserver.observe(el);
});

// Also observe skill bars & counters in hero
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

// ===== PARALLAX SCROLL =====
const heroContent = document.querySelector('.hero-content');
const orbs = document.querySelectorAll('.orb');
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${sy * 0.25}px)`;
  orbs.forEach((orb, i) => {
    const speed = 0.08 + i * 0.04;
    orb.style.transform = `translateY(${sy * speed}px)`;
  });
}, { passive: true });

// ===== PORTFOLIO TABS =====
const tabBtns = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.project-card');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    projectCards.forEach(card => {
      const show = tab === 'all' || card.dataset.category === tab;
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      if (show) {
        card.classList.remove('hidden');
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.transition = 'all 0.4s ease';
        }, 50);
      } else {
        setTimeout(() => card.classList.add('hidden'), 400);
      }
    });
  });
});

// ===== EMAILJS SETUP =====
// ⚠️  PASTE YOUR KEYS BELOW (see setup guide)
const EMAILJS_PUBLIC_KEY  = 'OOQtyRPQIB92Xna4Q';
const EMAILJS_SERVICE_ID  = 'service_wh6ksbs';
const EMAILJS_TEMPLATE_ID = 'template_6z5zhcd';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');

  // Basic validation
  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const message = document.getElementById('formMessage').value.trim();
  if (!name || !email || !subject || !message) return;

  // Loading state
  btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  formSuccess.classList.remove('show');
  formError.classList.remove('show');

  // Send via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:    name,
    from_email:   email,
    subject:      subject,
    message:      message,
    to_name:      'Alif Mahmud Bijoy',
    reply_to:     email,
  })
  .then(() => {
    form.reset();
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    formError.classList.add('show');
    setTimeout(() => formError.classList.remove('show'), 6000);
  });
});


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== PROJECT CARD TRANSITIONS =====
projectCards.forEach(card => {
  card.style.transition = 'all 0.4s ease';
  card.style.opacity = '1';
  card.style.transform = 'scale(1)';
});

// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// CV links directly to CV.pdf - no handler needed

