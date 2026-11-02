const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const setMenu = (open) => {
  menuToggle?.classList.toggle('is-open', open);
  mobileMenu?.classList.toggle('is-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
};
menuToggle?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 28), { passive: true });

const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => item.classList.toggle('is-selected', item === button));
  cards.forEach((card) => {
    const visible = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !visible);
  });
}));

const driveGrid = document.querySelector('[data-drive-work-grid]');
const driveFilters = document.querySelectorAll('[data-drive-filter]');
const driveItems = Array.isArray(window.driveWorkItems) ? window.driveWorkItems : [];
const driveCategoryLabel = (category) => category === 'Client work · Prism Legacy' ? 'Client work' : category;
const renderDriveWork = (filter = 'all') => {
  if (!driveGrid) return;
  const visible = driveItems.filter((item) => filter === 'all' || item.category === filter);
  driveGrid.replaceChildren(...visible.map((item, index) => {
    const link = document.createElement('a');
    link.className = 'drive-card reveal is-visible';
    link.href = item.source;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', `Open ${item.title} in Google Drive`);
    const media = document.createElement('div');
    media.className = 'drive-card-media';
    const image = document.createElement('img');
    image.src = item.thumbnail;
    image.alt = `${item.title} thumbnail`;
    image.loading = 'lazy';
    image.decoding = 'async';
    const kind = document.createElement('span');
    kind.className = 'drive-card-kind';
    kind.textContent = item.kind === 'video' ? 'Video · Drive' : 'Image · Drive';
    const arrow = document.createElement('span');
    arrow.className = 'drive-card-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    media.append(image, kind, arrow);
    const caption = document.createElement('div');
    caption.className = 'drive-card-caption';
    const title = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = item.title;
    const small = document.createElement('small');
    small.textContent = driveCategoryLabel(item.category);
    title.append(strong, small);
    const indexLabel = document.createElement('span');
    indexLabel.className = 'drive-card-index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');
    caption.append(title, indexLabel);
    link.append(media, caption);
    return link;
  }));
};
renderDriveWork();
driveFilters.forEach((button) => button.addEventListener('click', () => {
  driveFilters.forEach((item) => item.classList.toggle('is-selected', item === button));
  renderDriveWork(button.dataset.driveFilter);
}));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => anchor.addEventListener('click', (event) => {
  if (anchor.hasAttribute('data-contact-trigger')) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}));

const contactModal = document.querySelector('#contact-modal');
const contactTriggers = document.querySelectorAll('[data-contact-trigger]');
const contactClosers = document.querySelectorAll('[data-contact-close]');
const contactEmail = contactModal?.querySelector('[data-contact-email]');
const contactWhatsapp = contactModal?.querySelector('[data-contact-whatsapp]');
const getFocusable = (container) => [...container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
let lastContactTrigger = null;

const setContactModal = (open) => {
  contactModal?.classList.toggle('is-open', open);
  contactModal?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('modal-open', open);
  if (open) {
    contactModal?.querySelector('.modal-close')?.focus();
  } else {
    lastContactTrigger?.focus();
  }
};

contactTriggers.forEach((trigger) => trigger.addEventListener('click', (event) => {
  event.preventDefault();
  lastContactTrigger = trigger;
  setMenu(false);
  const service = trigger.dataset.service;
  const subject = service ? `${service} enquiry` : 'Project enquiry';
  const article = service && /^AI\b/i.test(service) ? 'an' : 'a';
  const message = service ? `Hello Wisdom, I’d like to discuss ${article} ${service.toLowerCase()} project.` : 'Hello Wisdom, I’d like to discuss a project.';
  if (contactEmail) contactEmail.href = `mailto:1wisdom.omondiagbe@gmail.com?subject=${encodeURIComponent(subject)}`;
  if (contactWhatsapp) contactWhatsapp.href = `https://wa.me/2349158506816?text=${encodeURIComponent(message)}`;
  setContactModal(true);
}));
contactClosers.forEach((closer) => closer.addEventListener('click', () => setContactModal(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (contactModal?.classList.contains('is-open')) setContactModal(false);
    if (mobileMenu?.classList.contains('is-open')) setMenu(false);
    return;
  }

  if (event.key !== 'Tab' || !contactModal?.classList.contains('is-open')) return;
  const focusable = getFocusable(contactModal);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
