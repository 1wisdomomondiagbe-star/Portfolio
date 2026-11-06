const categoryConfig = {
  edit: {
    index: '01 / Edit',
    title: 'Editing work.',
    lead: 'Cuts, colour, and sound shaped for the moment after the scroll.',
    note: 'Open any project to view the original file in Google Drive.'
  },
  animate: {
    index: '02 / Animate',
    title: 'AI worlds in motion.',
    lead: 'AI videos and motion graphics built to make an idea impossible to ignore.',
    note: 'Open any project to view the original file in Google Drive.'
  },
  build: {
    index: '03 / Build',
    title: 'Interfaces with intent.',
    lead: 'Web design showcases with a clear route from first click to next step.',
    note: 'Working website examples and source projects from Wisdom’s GitHub work.'
  },
  brand: {
    index: '04 / Brand',
    title: 'Identity, in detail.',
    lead: 'Graphic systems, layouts, and client work that give a brand somewhere to stand.',
    note: 'Open any project to view the original file in Google Drive.'
  }
};

const route = document.body.dataset.category;
const config = categoryConfig[route] || categoryConfig.edit;
const items = Array.isArray(window.driveWorkItems) ? window.driveWorkItems : [];
const isBrand = (item) => item.category.toLowerCase().startsWith('graphic') || item.category === 'Client work · Prism Legacy' && item.kind !== 'video';
const routeFor = (item) => {
  if (item.category === 'AI creative' || item.category === 'Motion graphics') return 'animate';
  if (isBrand(item)) return 'brand';
  if (item.category === 'Client work · Prism Legacy') return 'edit';
  return 'edit';
};
const routeItems = route === 'build' ? [] : items.filter((item) => routeFor(item) === route);
const buildProjects = [
  {
    title: 'Omondiagbe Portfolio',
    label: 'Live website · GitHub Pages',
    href: 'https://1wisdomomondiagbe-star.github.io/Portfolio/',
    image: '../../assets/project-build.webp',
    alt: 'Cinematic portfolio website interface'
  },
  {
    title: 'DIVERSMINDS Therapy',
    label: 'Website project · GitHub',
    href: 'https://github.com/1wisdomomondiagbe-star/diversminds-Manus',
    image: '../../assets/hero-studio.webp',
    alt: 'DIVERSMINDS Therapy website project'
  }
];

const title = document.querySelector('[data-category-title]');
const index = document.querySelector('[data-category-index]');
const lead = document.querySelector('[data-category-lead]');
const note = document.querySelector('[data-category-note]');
const count = document.querySelector('[data-category-count]');
const grid = document.querySelector('[data-category-grid]');
index.textContent = config.index;
title.innerHTML = config.title.replace(' ', '<br />');
lead.textContent = config.lead;
note.textContent = config.note;
count.textContent = route === 'build' ? `${buildProjects.length} website projects` : `${routeItems.length} linked projects`;

const renderDriveCard = (item, i) => {
  const link = document.createElement('a');
  link.className = 'drive-card category-card';
  link.href = item.source;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `Open ${item.title} in Google Drive`);
  link.innerHTML = `<div class="drive-card-media"><img src="../../${item.thumbnail}" alt="${item.title} thumbnail" loading="lazy" decoding="async" /><span class="drive-card-kind">${item.kind === 'video' ? 'Video · Drive' : 'Image · Drive'}</span><span class="drive-card-arrow" aria-hidden="true">↗</span></div><div class="drive-card-caption"><div><strong>${item.title}</strong><small>${item.category === 'Client work · Prism Legacy' ? 'Client work' : item.category}</small></div><span class="drive-card-index">${String(i + 1).padStart(2, '0')}</span></div>`;
  return link;
};
const renderBuildCard = (project, i) => {
  const link = document.createElement('a');
  link.className = 'drive-card category-card';
  link.href = project.href;
  link.target = '_blank';
  link.rel = 'noopener';
  link.setAttribute('aria-label', `Open ${project.title}`);
  link.innerHTML = `<div class="drive-card-media"><img src="${project.image}" alt="${project.alt}" loading="lazy" decoding="async" /><span class="drive-card-kind">${project.label}</span><span class="drive-card-arrow" aria-hidden="true">↗</span></div><div class="drive-card-caption"><div><strong>${project.title}</strong><small>Build · Web design · UX</small></div><span class="drive-card-index">${String(i + 1).padStart(2, '0')}</span></div>`;
  return link;
};
if (grid) grid.replaceChildren(...(route === 'build' ? buildProjects.map(renderBuildCard) : routeItems.map(renderDriveCard)));

document.querySelectorAll('.category-menu-toggle').forEach((button) => button.addEventListener('click', () => document.querySelector('.category-mobile-menu')?.classList.toggle('is-open')));
