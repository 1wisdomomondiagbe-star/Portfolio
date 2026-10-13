const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const setMenu = (open) => {
  menuToggle?.classList.toggle('is-open', open);
  mobileMenu?.classList.toggle('is-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
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

const setContactModal = (open) => {
  contactModal?.classList.toggle('is-open', open);
  contactModal?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('modal-open', open);
  if (open) contactModal?.querySelector('.modal-close')?.focus();
};

contactTriggers.forEach((trigger) => trigger.addEventListener('click', (event) => {
  event.preventDefault();
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
  if (event.key === 'Escape') setContactModal(false);
});
