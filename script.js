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

const driveItems = Array.isArray(window.driveWorkItems) ? window.driveWorkItems : [];
const driveCategoryLabel = (category) => category === 'Client work · Prism Legacy' ? 'Client work' : category;
const workRoute = document.querySelector('#work-route');
const routeGrid = document.querySelector('[data-route-grid]');
const routeIndex = document.querySelector('[data-route-index]');
const routeTitle = document.querySelector('[data-route-title]');
const routeNote = document.querySelector('[data-route-note]');
const routeCount = document.querySelector('[data-route-count]');
const routeMeta = {
  edit: { label: 'Edit', note: 'Video work and client edits. Open a card to view the original file in Google Drive.' },
  animate: { label: 'Animate', note: 'AI video and motion graphics experiments, linked to their original Drive files.' },
  build: { label: 'Build', note: 'Web design and digital systems. The linked Drive folder has no web-design files yet.' },
  brand: { label: 'Brand', note: 'Graphic design and Prism Legacy client work, linked to the original Drive files.' }
};
const routeForItem = (item) => {
  if (item.category === 'AI creative' || item.category === 'Motion graphics') return 'animate';
  if (item.category.toLowerCase().startsWith('graphic')) return 'brand';
  if (item.category === 'Client work · Prism Legacy') return item.kind === 'video' ? 'edit' : 'brand';
  return 'edit';
};
const routeItems = {
  edit: driveItems.filter((item) => routeForItem(item) === 'edit'),
  animate: driveItems.filter((item) => routeForItem(item) === 'animate'),
  build: [],
  brand: driveItems.filter((item) => routeForItem(item) === 'brand')
};
const renderRouteCard = (item, index) => {
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
};
const renderBuildCard = () => {
  const link = document.createElement('a');
  link.className = 'drive-card reveal is-visible build-route-card';
  link.href = '#contact';
  link.setAttribute('data-contact-trigger', '');
  link.setAttribute('data-service', 'Web design and development');
  link.setAttribute('aria-label', 'Start a web design project');
  link.innerHTML = '<div class="drive-card-media"><img src="assets/project-build.webp" alt="Web design project preview" loading="lazy" decoding="async" /><span class="drive-card-kind">Web design</span><span class="drive-card-arrow" aria-hidden="true">↗</span></div><div class="drive-card-caption"><div><strong>Interfaces in motion</strong><small>Build · Web design · UX</small></div><span class="drive-card-index">01</span></div>';
  return link;
};
const renderWorkRoute = (route, shouldScroll = true) => {
  if (!workRoute || !routeMeta[route]) return;
  const meta = routeMeta[route];
  const items = routeItems[route];
  routeIndex.textContent = `01 / ${meta.label}`;
  routeTitle.innerHTML = `Work in<br /><span>${meta.label.toLowerCase()}.</span>`;
  routeNote.textContent = meta.note;
  routeCount.textContent = route === 'build' ? '01 featured route' : `${items.length} linked ${items.length === 1 ? 'project' : 'projects'}`;
  const cardsToRender = route === 'build' ? [renderBuildCard()] : items.map(renderRouteCard);
  routeGrid.replaceChildren(...cardsToRender);
  workRoute.hidden = false;
  if (shouldScroll) workRoute.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
const routeFromHash = () => {
  const match = window.location.hash.match(/^#work\/(edit|animate|build|brand)$/);
  if (match) renderWorkRoute(match[1], false);
  else if (workRoute) workRoute.hidden = true;
};
document.querySelectorAll('[data-work-route]').forEach((card) => card.addEventListener('click', () => {
  renderWorkRoute(card.dataset.workRoute);
}));
window.addEventListener('hashchange', routeFromHash);
routeFromHash();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => anchor.addEventListener('click', (event) => {
  if (anchor.hasAttribute('data-contact-trigger')) return;
  if (anchor.matches('[data-work-route], .route-back')) return;
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
