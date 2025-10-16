// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Theme toggle with persistence
const root = document.body;
const THEME_KEY = 'simplifit-theme';
const stored = localStorage.getItem(THEME_KEY);
if (stored === 'dark') root.classList.replace('theme-light', 'theme-dark');

const themeBtn = $('#themeToggle');
const setPressed = () => themeBtn.setAttribute('aria-pressed', root.classList.contains('theme-dark'));
setPressed();
themeBtn.addEventListener('click', () => {
  const dark = root.classList.toggle('theme-dark');
  if (dark) root.classList.remove('theme-light'); else root.classList.add('theme-light');
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  setPressed();
});

// Prevent horizontal scroll on mobile
function preventHorizontalScroll() {
  let startX = 0;
  let startY = 0;
  
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);
    
    // If horizontal movement is greater than vertical, prevent it
    if (diffX > diffY && !nav.classList.contains('open')) {
      e.preventDefault();
    }
  }, { passive: false });
}

// Mobile nav
const menuToggle = $('#menuToggle');
const nav = $('#main-nav');
function closeNav() {
  nav.classList.remove('open');
  menuToggle.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function toggleNav() {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', (e) => {
  e.preventDefault();
  if (nav.classList.contains('open')) {
    closeNav();
  } else {
    toggleNav();
  }
});

// Close when clicking a link or the overlay background
nav.addEventListener('click', (e) => {
  const clickedLink = e.target.closest('a');
  const clickedOutsidePanel = !e.target.closest('ul');
  if (clickedLink || clickedOutsidePanel) closeNav();
});

// Smooth scroll with header offset for internal nav links
$$('.main-nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    closeNav();
  });
});

// Slider
function createSlider(rootEl) {
  const slidesEl = $('.slides', rootEl);
  const images = $$('img', slidesEl);
  const nextBtn = $('.next', rootEl);
  const prevBtn = $('.prev', rootEl);
  const dotsEl = $('.slider-dots', rootEl);
  let index = 0;

  // Create dots
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const dots = $$('button', dotsEl);

  function update() {
    slidesEl.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  }

  function goTo(i) {
    index = (i + images.length) % images.length;
    update();
  }

  nextBtn.addEventListener('click', () => goTo(index + 1));
  prevBtn.addEventListener('click', () => goTo(index - 1));

  // Auto-play
  const auto = Number(rootEl.dataset.auto || 0);
  if (auto > 0) setInterval(() => goTo(index + 1), auto);

  update();
}

// Init slider(s)
$$('.slider').forEach(createSlider);

// Initialize horizontal scroll prevention
preventHorizontalScroll();

