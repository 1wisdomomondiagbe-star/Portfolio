#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const rootId = '1OG_cL9qKZzV0xU4SD_T-uAXGaK7ywAhD';
const projectRoot = resolve(import.meta.dirname, '..');
const dataPath = join(projectRoot, 'public', 'drive-work-data.js');
const assetDir = join(projectRoot, 'public', 'assets', 'drive-work');
const fallbackByCategory = {
  'AI creative': 'assets/project-animate.webp',
  'Motion graphics': 'assets/project-animate.webp',
  'Video editing': 'assets/project-edit.webp',
  'Graphics design': 'assets/project-brand.webp',
  'Client work · Prism Legacy': 'assets/project-brand.webp'
};
const categoryByFolder = {
  'video edit': 'Video editing',
  'motion graphics': 'Motion graphics',
  'ai videos': 'AI creative',
  'graphics design': 'Graphics design',
  'the prism legacy - client work': 'Client work · Prism Legacy'
};

function gws(params) {
  const output = execFileSync('gws', [
    'drive', 'files', 'list',
    '--params', JSON.stringify(params),
    '--format', 'json'
  ], { cwd: projectRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  return JSON.parse(output);
}

function listChildren(parentId) {
  return gws({
    q: `'${parentId}' in parents and trashed = false`,
    pageSize: 1000,
    orderBy: 'name_natural',
    fields: 'files(id,name,mimeType,webViewLink,thumbnailLink,modifiedTime,size,parents)'
  }).files || [];
}

function sourceUrl(id, webViewLink) {
  return webViewLink || `https://drive.google.com/file/d/${id}/view?usp=drivesdk`;
}

function titleFromName(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function kindFromMime(mimeType) {
  return mimeType?.startsWith('video/') ? 'video' : 'image';
}

function downloadThumbnail(id, destination) {
  if (existsSync(destination) && statSync(destination).size > 500) return 'existing';
  mkdirSync(dirname(destination), { recursive: true });
  try {
    execFileSync('curl', ['-LfsS', `https://drive.google.com/thumbnail?id=${id}&sz=w1200`, '-o', destination], { stdio: 'ignore' });
    if (statSync(destination).size > 500) return 'downloaded';
  } catch {}
  try { if (existsSync(destination)) writeFileSync(destination, ''); } catch {}
  return 'fallback';
}

const folders = listChildren(rootId).filter((file) => file.mimeType === 'application/vnd.google-apps.folder');
const items = [];
for (const folder of folders) {
  const key = folder.name.trim().toLowerCase();
  const category = categoryByFolder[key];
  if (!category) {
    console.warn(`Skipping unrecognised Drive folder: ${folder.name}`);
    continue;
  }
  for (const file of listChildren(folder.id).filter((item) => item.mimeType !== 'application/vnd.google-apps.folder')) {
    const kind = kindFromMime(file.mimeType);
    const thumbPath = join(assetDir, `${file.id}.jpg`);
    const result = downloadThumbnail(file.id, thumbPath);
    items.push({
      id: file.id,
      title: titleFromName(file.name),
      category,
      kind,
      source: sourceUrl(file.id, file.webViewLink),
      thumbnail: result === 'fallback' ? (fallbackByCategory[category] || 'assets/project-edit.webp') : `assets/drive-work/${file.id}.jpg`,
      originalName: file.name,
      modifiedTime: file.modifiedTime || null
    });
  }
}
items.sort((a, b) => `${a.category}:${a.title}`.localeCompare(`${b.category}:${b.title}`));
writeFileSync(dataPath, `window.driveWorkItems = ${JSON.stringify(items, null, 2)};\n`);
console.log(`Wrote ${items.length} Drive work items to ${dataPath}`);
console.log(`Thumbnails stored in ${assetDir}`);
