import { SITE } from './site.js?v=20261013-unified-catalog';
import { el, linkAttrs, icon, themeToggle, initialCatalog, refreshCatalog, projectGroups, reducedMotion, boot } from './core.js?v=20261025-stickers';

// 设计：一台贴满作品贴纸的笔记本盖。头像在原本 logo 的位置发光，贴纸可以拖着玩。
let catalog;
const COLORS = ['white', 'yellow', 'pink', 'blue', 'lime', 'ink', 'white', 'orange'];
const SHAPES = ['rect', 'pill', 'round', 'rect', 'ticket'];

// 由 slug 得到稳定的伪随机数，同一个作品每次都贴在同样的角度
function seeded(str) {
  let h = 2166136261;
  for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return n => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000 * n; };
}

function sticker(item) {
  const r = seeded(item.slug);
  const shape = SHAPES[Math.floor(r(SHAPES.length))];
  const color = COLORS[Math.floor(r(COLORS.length))];
  const tilt = (r(14) - 7).toFixed(1);
  const nudge = (r(16) - 8).toFixed(0);
  const body = [
    icon(item, 'sticker__icon', 52),
    el('span', 'sticker__text', null, [
      el('span', 'sticker__name', { text: item.name }),
      shape === 'round' || !item.meta ? null : el('span', 'sticker__meta', { text: item.meta })
    ])
  ];
  const attrs = { 'data-project': item.slug, 'data-shape': shape, 'data-color': color, style: `--tilt:${tilt}deg;--nudge:${nudge}px;--d:${(order++ * 0.035).toFixed(3)}s`, title: item.meta || item.name };
  const node = item.href
    ? el('a', 'sticker', Object.assign(linkAttrs(item.href), attrs), body)
    : el('div', 'sticker is-static', attrs, body.concat(el('span', 'sticker__hint', { text: '微信小程序' })));
  makeDraggable(node);
  return node;
}

/* ---------- 拖动：移动超过 6px 才算拖，松手后不触发打开 ---------- */
let topZ = 10;
function makeDraggable(node) {
  let startX, startY, baseX = 0, baseY = 0, dragging = false, pid = null;
  node.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    pid = e.pointerId; startX = e.clientX; startY = e.clientY; dragging = false;
    baseX = parseFloat(node.dataset.x || 0); baseY = parseFloat(node.dataset.y || 0);
  });
  node.addEventListener('pointermove', e => {
    if (e.pointerId !== pid) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (!dragging && Math.hypot(dx, dy) > 6) {
      dragging = true; node.setPointerCapture(pid); node.classList.add('is-lifted'); node.style.zIndex = ++topZ;
    }
    if (dragging) { node.dataset.x = baseX + dx; node.dataset.y = baseY + dy; node.style.translate = `${baseX + dx}px ${baseY + dy}px`; }
  });
  const end = e => {
    if (e.pointerId !== pid) return;
    pid = null;
    if (dragging) { node.classList.remove('is-lifted'); node.dataset.justDragged = '1'; setTimeout(() => delete node.dataset.justDragged, 0); }
  };
  node.addEventListener('pointerup', end);
  node.addEventListener('pointercancel', end);
  node.addEventListener('click', e => { if (node.dataset.justDragged) e.preventDefault(); });
  node.addEventListener('dragstart', e => e.preventDefault());
}

function resetStickers() {
  document.querySelectorAll('.sticker').forEach(s => { delete s.dataset.x; delete s.dataset.y; s.style.translate = ''; s.style.zIndex = ''; });
}

function lid() {
  const s = SITE.site;
  const board = el('div', 'board', { id: 'board' });
  return el('main', 'lid', { id: 'main' }, [
    el('div', 'lid__logo', null, [el('img', null, { src: s.logo, alt: '', width: 84, height: 84 })]),
    el('div', 'nametag', { role: 'img', 'aria-label': '你好，我是' + s.name }, [
      el('span', 'nametag__band', { text: '你好，我是', 'aria-hidden': 'true' }),
      el('span', 'nametag__name', { text: s.name, 'aria-hidden': 'true' })
    ]),
    el('h1', 'slogan', null, [el('span', 'slogan__big', { text: s.title }), el('span', 'slogan__small', { text: s.motto })]),
    board
  ]);
}

let order = 0;
function paint() {
  order = 0;
  const board = document.getElementById('board');
  board.replaceChildren(...projectGroups(catalog).map(g => el('section', 'pack', { 'aria-labelledby': 'pk-' + g.id }, [
    el('h2', 'tape', { id: 'pk-' + g.id, text: g.title, title: g.desc || null }),
    ...g.items.map(sticker)
  ])));
  document.getElementById('countNote').textContent = '一共 ' + catalog.projects.length + ' 张贴纸，每张都是一个做完的东西。贴纸可以拖着玩，点一下打开。';
}

boot(() => {
  catalog = initialCatalog();
  const s = SITE.site;
  const nav = el('nav', 'desk__nav', { 'aria-label': '主导航' });
  SITE.nav.forEach(n => nav.append(el('a', null, Object.assign(linkAttrs(n.href), { text: n.label }))));
  nav.append(themeToggle('desk__theme'));
  const header = el('header', 'desk', null, [el('a', 'desk__home', { href: '#main', text: 'mjh.im' }), nav]);
  const foot = el('footer', 'desk__foot', null, [
    el('p', 'desk__note', { id: 'countNote' }),
    el('div', 'desk__tools', null, [
      el('button', 'peel', { type: 'button', text: '把贴纸放回原位', onclick: resetStickers }),
      s.badge?.src ? el('a', 'desk__badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, height: 16, width: 38, loading: 'lazy' })]) : null
    ])
  ]);
  document.getElementById('app').append(header, lid(), foot);
  paint();
  if (!reducedMotion()) document.body.classList.add('is-slapping');
  refreshCatalog(catalog, fresh => { catalog = fresh; paint(); });
});
