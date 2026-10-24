import { SITE } from './site.js?v=20261013-unified-catalog';
import { el, linkAttrs, icon, themeToggle, initialCatalog, refreshCatalog, projectGroups, reducedMotion, boot } from './core.js?v=20261025-springboard';

// 设计：iPhone 主屏幕。个人资料是小组件，每个分类是一个文件夹，导航放在 Dock，搜索是 Spotlight。
let catalog, groups = [];
const DOCK_GLYPHS = {
  GitHub: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" fill="currentColor"/>',
  博客: '<path d="M4 20h4L19 9l-4-4L4 16v4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="2"/>',
  联系我: '<path d="M4 5h16v11H9l-5 4V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  search: '<circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
};
const glyph = name => '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">' + (DOCK_GLYPHS[name] || DOCK_GLYPHS['博客']) + '</svg>';

/* ---------- 状态栏 ---------- */
function statusBar() {
  const time = el('time', 'status__time');
  const tick = () => { const d = new Date(); time.textContent = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }); time.dateTime = d.toISOString(); };
  tick(); setInterval(tick, 15000);
  return el('header', 'status', null, [
    time,
    el('span', 'status__right', null, [
      el('span', 'status__carrier', { text: SITE.site.name, 'aria-hidden': 'true' }),
      el('span', 'status__battery', { 'aria-hidden': 'true' }),
      themeToggle('status__theme')
    ])
  ]);
}

/* ---------- 小组件 ---------- */
function widget() {
  const s = SITE.site;
  const count = el('p', 'widget__count', { id: 'widgetCount' });
  const w = el('section', 'widget', { 'aria-label': '关于' + s.name }, [
    el('div', 'widget__top', null, [
      el('img', 'widget__avatar', { src: s.logo, alt: '', width: 56, height: 56 }),
      el('div', null, null, [el('h1', 'widget__name', { text: s.name }), el('p', 'widget__title', { text: s.title })])
    ]),
    el('p', 'widget__motto', { text: s.motto }),
    count
  ]);
  if (s.badge?.src) w.append(el('a', 'widget__badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, height: 15, width: 36, loading: 'lazy' })]));
  return w;
}
function paintCount() {
  const n = catalog.projects.length;
  const c = document.getElementById('widgetCount');
  if (c) c.textContent = n + ' 个成品，分在 ' + groups.length + ' 个文件夹里';
}

/* ---------- 文件夹 ---------- */
function folder(group) {
  const preview = el('span', 'folder__preview', { 'aria-hidden': 'true' });
  group.items.slice(0, 9).forEach(it => preview.append(icon(it, 'folder__mini', 20)));
  const btn = el('button', 'folder', { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': group.title + '，' + group.items.length + ' 个' }, [
    preview,
    el('span', 'app__label', { text: group.title })
  ]);
  if (group.items.length > 1) btn.append(el('span', 'app__badge', { text: group.items.length, 'aria-hidden': 'true' }));
  btn.addEventListener('click', () => openFolder(group, btn));
  return btn;
}

function appTile(item) {
  const label = el('span', 'app__label', { text: item.name });
  const meta = item.meta ? el('span', 'app__meta', { text: item.meta }) : null;
  const body = [icon(item, 'app__icon', 64), label, meta];
  if (item.href) return el('a', 'app', Object.assign(linkAttrs(item.href), { 'data-project': item.slug }), body);
  return el('div', 'app is-static', { 'data-project': item.slug, title: '在微信里搜索「' + item.name + '」打开' }, body.concat(el('span', 'app__hint', { text: '微信内打开' })));
}

/* ---------- 文件夹展开 ---------- */
const sheet = el('dialog', 'sheet', { 'aria-labelledby': 'sheetTitle' });
function openFolder(group, from) {
  const r = from.getBoundingClientRect();
  sheet.style.setProperty('--ox', r.left + r.width / 2 + 'px');
  sheet.style.setProperty('--oy', r.top + r.height / 2 + 'px');
  const grid = el('div', 'sheet__grid');
  group.items.forEach(it => grid.append(appTile(it)));
  sheet.replaceChildren(
    el('div', 'sheet__panel', null, [
      el('div', 'sheet__head', null, [
        el('h2', 'sheet__title', { id: 'sheetTitle', text: group.title }),
        el('button', 'sheet__close', { type: 'button', 'aria-label': '关闭文件夹', html: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>', onclick: () => sheet.close() })
      ]),
      group.desc ? el('p', 'sheet__desc', { text: group.desc }) : null,
      grid
    ])
  );
  sheet._from = from;
  sheet.showModal();
}
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
sheet.addEventListener('close', () => sheet._from?.focus());

/* ---------- Spotlight ---------- */
const spot = el('dialog', 'spot', { 'aria-label': '搜索作品' });
const spotInput = el('input', 'spot__input', { type: 'search', placeholder: '搜索作品，比如：微信、通知、打印', 'aria-label': '搜索作品', autocomplete: 'off' });
const spotList = el('ul', 'spot__list', { role: 'list' });
spot.append(el('div', 'spot__panel', null, [
  el('div', 'spot__bar', null, [el('span', 'spot__glass', { html: glyph('search'), 'aria-hidden': 'true' }), spotInput]),
  spotList
]));
spot.addEventListener('click', e => { if (e.target === spot) spot.close(); });
function renderSpot() {
  const q = spotInput.value.trim().toLowerCase();
  const names = Object.fromEntries(catalog.categories.map(c => [c.id, c.name]));
  const hits = catalog.projects.filter(p => !q || (p.name + ' ' + p.description + ' ' + names[p.category]).toLowerCase().includes(q));
  spotList.replaceChildren(...hits.slice(0, 40).map(p => {
    const item = { slug: p.slug, name: p.name, meta: p.description, href: p.official_url, icon: p.image_url };
    const row = [icon(item, 'spot__icon', 36), el('span', 'spot__text', null, [el('span', 'spot__name', { text: p.name }), el('span', 'spot__meta', { text: p.description || names[p.category] })]), el('span', 'spot__cat', { text: names[p.category] })];
    return el('li', null, null, [item.href ? el('a', 'spot__row', linkAttrs(item.href), row) : el('div', 'spot__row is-static', null, row)]);
  }));
  if (!hits.length) spotList.append(el('li', 'spot__empty', { text: '没有找到「' + spotInput.value.trim() + '」。换个关键词，或者去 GitHub 看看。' }));
}
spotInput.addEventListener('input', renderSpot);
function openSpot() { spotInput.value = ''; renderSpot(); spot.showModal(); spotInput.focus(); }
addEventListener('keydown', e => {
  if (e.target.matches?.('input, textarea')) return;
  if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); if (!spot.open) openSpot(); }
});

/* ---------- Dock ---------- */
function dock() {
  const d = el('nav', 'dock', { 'aria-label': '主导航' });
  SITE.nav.forEach(n => d.append(el('a', 'dock__app', Object.assign(linkAttrs(n.href), { 'aria-label': n.label, title: n.label, 'data-app': n.label }), [el('span', 'dock__icon', { html: glyph(n.label) }), el('span', 'dock__label', { text: n.label })])));
  d.append(el('button', 'dock__app', { type: 'button', 'aria-label': '搜索作品（快捷键 /）', title: '搜索（/）', 'data-app': 'search', onclick: openSpot }, [el('span', 'dock__icon', { html: glyph('search') }), el('span', 'dock__label', { text: '搜索' })]));
  return d;
}

/* ---------- 组装 ---------- */
function paintFolders() {
  groups = projectGroups(catalog);
  document.getElementById('folders').replaceChildren(...groups.map(folder));
  paintCount();
}

boot(() => {
  catalog = initialCatalog();
  const root = document.getElementById('app');
  const wall = el('div', 'wallpaper', { 'aria-hidden': 'true' }, [el('span', null, { text: 'Go' }), el('span', null, { text: 'for' }), el('span', null, { text: 'it!' })]);
  const home = el('main', 'home', { id: 'main' }, [widget(), el('div', 'folders', { id: 'folders' })]);
  root.append(wall, statusBar(), home, dock(), sheet, spot);
  paintFolders();
  if (!reducedMotion()) document.body.classList.add('is-waking');
  refreshCatalog(catalog, fresh => { catalog = fresh; paintFolders(); });
});
