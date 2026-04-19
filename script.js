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
const interactables = 'a, button, .project-card, .tool-item, .skill-tag, .achievement-card, .social-link, input, textarea, .tab-btn, .theme-toggle, .lightbox-backdrop, .lightbox-close, .lightbox-modal';
document.querySelectorAll(interactables).forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// Re-attach interactables after lightbox opens (dynamic elements)
function refreshCursorInteractables() {
  document.querySelectorAll(interactables).forEach(el => {
    el.removeEventListener('mouseenter', cursorHoverOn);
    el.removeEventListener('mouseleave', cursorHoverOff);
    el.addEventListener('mouseenter', cursorHoverOn);
    el.addEventListener('mouseleave', cursorHoverOff);
  });
}
function cursorHoverOn()  { dot.classList.add('hovered');    ring.classList.add('hovered'); }
function cursorHoverOff() { dot.classList.remove('hovered'); ring.classList.remove('hovered'); }

// Click state — always clean up on mouseup regardless of target
document.addEventListener('mousedown', () => { dot.classList.add('clicking'); ring.classList.add('clicking'); });
document.addEventListener('mouseup',   () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });
window.addEventListener('blur',        () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });

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

// ===== HERO SCROLL FADE =====
const heroSection  = document.querySelector('.hero');
const heroContent  = document.querySelector('.hero-content');
const heroScroll   = document.querySelector('.hero-scroll');
const orbs         = document.querySelectorAll('.orb');

window.addEventListener('scroll', () => {
  const sy         = window.scrollY;
  const heroH      = heroSection ? heroSection.offsetHeight : window.innerHeight;
  const progress   = Math.min(sy / (heroH * 0.55), 1); // 0 → 1 as you scroll half the hero

  if (heroContent) {
    const opacity   = 1 - progress;
    const scale     = 1 - progress * 0.06;          // subtle shrink
    const translateY = sy * 0.18;                    // gentle lift
    const blur      = progress * 6;                  // soft blur-out
    heroContent.style.opacity   = opacity;
    heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
    heroContent.style.filter    = `blur(${blur}px)`;
    heroContent.style.pointerEvents = progress > 0.8 ? 'none' : 'auto';
  }

  // Scroll indicator fades faster
  if (heroScroll) {
    heroScroll.style.opacity   = Math.max(0, 1 - progress * 3);
  }

  // Orbs drift at different speeds for depth
  orbs.forEach((orb, i) => {
    const speed = 0.06 + i * 0.05;
    orb.style.transform = `translateY(${sy * speed}px)`;
  });
}, { passive: true });

// ===== PORTFOLIO CAROUSEL =====
const portfolioGrid  = document.getElementById('portfolioGrid');
const portfolioOuter = document.getElementById('portfolioOuter');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const tabBtns = document.querySelectorAll('.tab-btn');
let allCards = Array.from(document.querySelectorAll('.project-card'));

// Shuffle cards randomly in DOM
function shuffleCards(grid, cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(cards[j]);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
shuffleCards(portfolioGrid, allCards);

const SCROLL_SPEED = 0.55; // slow visible drift

function getCardStep(outer) {
  const card = outer.querySelector('.project-card, .achievement-card');
  if (!card) return 320;
  const style = window.getComputedStyle(outer.firstElementChild);
  const gap = parseInt(style.gap) || 20;
  return card.offsetWidth + gap;
}

// --- Portfolio auto-scroll ---
let portPaused = false;
function portAutoScroll() {
  if (!portPaused) {
    portfolioOuter.scrollLeft += SCROLL_SPEED;
    if (portfolioOuter.scrollLeft >= portfolioOuter.scrollWidth - portfolioOuter.clientWidth - 2)
      portfolioOuter.scrollLeft = 0;
  }
  requestAnimationFrame(portAutoScroll);
}
portfolioOuter.addEventListener('mouseenter', () => portPaused = true);
portfolioOuter.addEventListener('mouseleave', () => portPaused = false);
prevBtn.addEventListener('click', () => {
  portPaused = true;
  portfolioOuter.scrollBy({ left: -getCardStep(portfolioOuter), behavior: 'smooth' });
  setTimeout(() => portPaused = false, 700);
});
nextBtn.addEventListener('click', () => {
  portPaused = true;
  portfolioOuter.scrollBy({ left: getCardStep(portfolioOuter), behavior: 'smooth' });
  setTimeout(() => portPaused = false, 700);
});

// Drag-to-scroll (portfolio)
let portDrag = false, portStartX = 0, portStartScroll = 0;
portfolioGrid.addEventListener('mousedown', e => { portDrag=true; portPaused=true; portStartX=e.pageX; portStartScroll=portfolioOuter.scrollLeft; portfolioGrid.style.cursor='grabbing'; });
document.addEventListener('mousemove', e => { if(portDrag) portfolioOuter.scrollLeft = portStartScroll-(e.pageX-portStartX); });
document.addEventListener('mouseup', () => { if(portDrag){portDrag=false;portPaused=false;portfolioGrid.style.cursor='grab';} });

// Tab filter
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    allCards.forEach(card => {
      const show = tab === 'all' || card.dataset.category === tab;
      card.classList.toggle('hidden', !show);
    });
    portfolioOuter.scrollLeft = 0;
  });
});
portAutoScroll();

// ===== ACHIEVEMENTS CAROUSEL =====
const achGrid  = document.getElementById('achGrid');
const achOuter = document.getElementById('achOuter');
const achPrev  = document.getElementById('achPrev');
const achNext  = document.getElementById('achNext');

if (achGrid && achOuter) {
  let achCards = Array.from(achGrid.querySelectorAll('.achievement-card'));
  shuffleCards(achGrid, achCards);

  let achPaused = false;
  function achAutoScroll() {
    if (!achPaused) {
      achOuter.scrollLeft += SCROLL_SPEED;
      if (achOuter.scrollLeft >= achOuter.scrollWidth - achOuter.clientWidth - 2)
        achOuter.scrollLeft = 0;
    }
    requestAnimationFrame(achAutoScroll);
  }
  achOuter.addEventListener('mouseenter', () => achPaused = true);
  achOuter.addEventListener('mouseleave', () => achPaused = false);
  achPrev.addEventListener('click', () => {
    achPaused = true;
    achOuter.scrollBy({ left: -getCardStep(achOuter), behavior: 'smooth' });
    setTimeout(() => achPaused = false, 700);
  });
  achNext.addEventListener('click', () => {
    achPaused = true;
    achOuter.scrollBy({ left: getCardStep(achOuter), behavior: 'smooth' });
    setTimeout(() => achPaused = false, 700);
  });

  // Drag-to-scroll (achievements)
  let achDrag = false, achStartX = 0, achStartScroll = 0;
  achGrid.addEventListener('mousedown', e => { achDrag=true; achPaused=true; achStartX=e.pageX; achStartScroll=achOuter.scrollLeft; achGrid.style.cursor='grabbing'; });
  document.addEventListener('mousemove', e => { if(achDrag) achOuter.scrollLeft = achStartScroll-(e.pageX-achStartX); });
  document.addEventListener('mouseup', () => { if(achDrag){achDrag=false;achPaused=false;achGrid.style.cursor='grab';} });

  achAutoScroll();
}


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



// ===== BACK TO TOP =====
document.getElementById('backToTop').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// CV links directly to CV.pdf - no handler needed

// ===== LIGHTBOX (Image + Video) =====
const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxImgWrap  = document.getElementById('lightboxImgWrap');
const lightboxVideo    = document.getElementById('lightboxVideo');
const lightboxVideoWrap= document.getElementById('lightboxVideoWrap');
const lightboxTitle    = document.getElementById('lightboxTitle');
const lightboxDesc     = document.getElementById('lightboxDesc');

function openLightbox(src, title, desc) {
  lightboxImgWrap.style.display  = '';
  lightboxVideoWrap.style.display= 'none';
  lightboxImg.src           = src;
  lightboxImg.alt           = title;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent  = desc;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  dot.classList.remove('clicking'); ring.classList.remove('clicking');
  refreshCursorInteractables();
}

function openVideoLightbox(src, title, desc) {
  lightboxImgWrap.style.display  = 'none';
  lightboxVideoWrap.style.display= '';
  lightboxVideo.src         = src;
  lightboxTitle.textContent = title;
  lightboxDesc.textContent  = desc;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  dot.classList.remove('clicking'); ring.classList.remove('clicking');
  refreshCursorInteractables();
  lightboxVideo.play();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  dot.classList.remove('clicking','hovered'); ring.classList.remove('clicking','hovered');
  setTimeout(() => {
    lightboxImg.src   = '';
    lightboxVideo.pause();
    lightboxVideo.src = '';
  }, 350);
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== VIDEO CARD HOVER PREVIEW =====
document.querySelectorAll('.video-card').forEach(card => {
  const vid = card.querySelector('.preview-video');
  if (!vid) return;
  card.addEventListener('mouseenter', () => {
    vid.currentTime = 0;
    vid.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    vid.pause();
    vid.currentTime = 0;
  });
});

