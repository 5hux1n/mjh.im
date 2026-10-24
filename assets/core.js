// 三个设计共用的底层：建节点、外链属性、主题切换、作品数量（来自 PingMe 目录）。
import { CATALOG_URL, CATALOG_CACHE_KEY, normalizeCatalog } from './catalog.js?v=20261014-plugin-catalog';

export function el(tag, className, attrs, children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  if (children) for (const c of [].concat(children)) if (c !== null && c !== undefined && c !== false) node.append(c);
  return node;
}

export const linkAttrs = href => (/^https?:\/\//i.test(href || '') ? { href, target: '_blank', rel: 'noreferrer' } : { href });

/* ---------- 主题：跟随系统 → 浅色 → 深色 ---------- */
const THEME_KEY = 'homepage-theme', THEMES = ['auto', 'light', 'dark'];
const NAMES = { auto: '跟随系统', light: '浅色', dark: '深色' };
const ICONS = {
  auto: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 3v18"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
};
export function themeToggle(className) {
  let mode;
  try { mode = localStorage.getItem(THEME_KEY); } catch {}
  if (!THEMES.includes(mode)) mode = 'auto';
  const btn = el('button', className, { type: 'button' });
  const apply = () => {
    if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch {}
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[mode] + '</svg>';
    btn.setAttribute('aria-label', '配色：' + NAMES[mode] + '，点击切换');
    btn.title = '配色：' + NAMES[mode];
  };
  apply();
  btn.addEventListener('click', () => { mode = THEMES[(THEMES.indexOf(mode) + 1) % 3]; apply(); });
  return btn;
}

/* ---------- 作品数量：先用缓存或快照，再后台向 PingMe 取最新 ---------- */
function count(catalog) { return catalog.projects.length; }
export function worksCount(onChange) {
  let current;
  try {
    const cached = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    if (cached?.source === CATALOG_URL) current = normalizeCatalog(cached.data);
  } catch {}
  try { current ||= normalizeCatalog(JSON.parse(document.getElementById('catalogSnapshot').textContent)); } catch {}
  if (current) onChange(count(current));
  fetch(CATALOG_URL, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(8000) })
    .then(r => { if (!r.ok) throw Error('Catalog unavailable'); return r.json(); })
    .then(raw => {
      const fresh = normalizeCatalog(raw);
      try { localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ source: CATALOG_URL, data: fresh })); } catch {}
      if (!current || count(fresh) !== count(current)) onChange(count(fresh));
    })
    .catch(() => console.info('作品数量暂时无法更新，继续使用已保存的数据。'));
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export function boot(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
