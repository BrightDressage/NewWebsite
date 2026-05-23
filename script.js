// BRIGHT DRESSAGE - Interactive JS

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
if (window.scrollY > 60) {
navbar.style.background = 'rgba(10,10,10,0.98)';
navbar.style.borderBottom = '1px solid rgba(255,255,255,0.12)';
} else {
navbar.style.background = 'rgba(10,10,10,0.95)';
navbar.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
}
});

// Smooth active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
let current = '';
sections.forEach(sec => {
if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
});
navLinks.forEach(a => {
a.style.color = a.getAttribute('href') === '#' + current ? '#ffffff' : '';
});
});

// Hamburger mobile menu
const hamburger = document.getElementById('hamburger');
const mobileClose = document.getElementById('mobile-close');
const mobileNav = document.querySelector('.nav-links');

function openMenu() {
mobileNav.classList.add('open');
hamburger.innerHTML = '&#9776;';
document.body.style.overflow = 'hidden';
}

function closeMenu() {
mobileNav.classList.remove('open');
hamburger.innerHTML = '&#9776;';
document.body.style.overflow = '';
}

if (hamburger && mobileNav) {
hamburger.addEventListener('click', () => {
if (mobileNav.classList.contains('open')) {
closeMenu();
} else {
openMenu();
}
});
}

if (mobileClose) {
mobileClose.addEventListener('click', closeMenu);
}

document.querySelectorAll('.nav-links a').forEach(link => {
link.addEventListener('click', closeMenu);
});

// Animate elements on scroll (Intersection Observer)
const animateEls = document.querySelectorAll('.service-card, .testi-card, .pts-card, .coaching-card, .about-grid, .results-table');
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1 });

animateEls.forEach(el => {
el.style.opacity = '0';
el.style.transform = 'translateY(24px)';
el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
observer.observe(el);
});

// Stagger service cards
document.querySelectorAll('.service-card').forEach((card, i) => {
card.style.transitionDelay = (i * 0.08) + 's';
});

// Stagger points cards
document.querySelectorAll('.pts-card').forEach((card, i) => {
card.style.transitionDelay = (i * 0.05) + 's';
});

// Contact form submission handler
const form = document.querySelector('.contact-form form');
form && form.addEventListener('submit', (e) => {
e.preventDefault();
const btn = form.querySelector('.btn-submit');
btn.textContent = 'Message Sent ✓';
btn.style.background = '#2a7a2a';
btn.style.color = '#fff';
setTimeout(() => {
btn.textContent = 'Send Enquiry';
btn.style.background = '';
btn.style.color = '';
form.reset();
}, 3000);
});

// Animate hero stats counting up
function animateCount(el, target, duration) {
let start = 0;
const step = target / (duration / 16);
const timer = setInterval(() => {
start += step;
if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
el.textContent = Math.floor(start).toLocaleString();
}, 16);
}
setTimeout(() => {
const pointsEl = document.querySelector('.stat-num');
if (pointsEl && pointsEl.textContent.includes('2,922')) {
pointsEl.textContent = '0';
animateCount(pointsEl, 2922, 1800);
}
const resultsEl = document.querySelectorAll('.stat-num')[2];
if (resultsEl && resultsEl.textContent.includes('743')) {
resultsEl.textContent = '0';
animateCount(resultsEl, 743, 1600);
}
}, 600);
