// 各设计共用的底层：主题、目录加载与刷新、图标兜底。项目内容仍由 PingMe 维护。
import { CATALOG_URL, CATALOG_CACHE_KEY, normalizeCatalog, projectGroups } from './catalog.js?v=20261014-plugin-catalog';

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
  if (children) for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

export const isExternal = href => /^https?:\/\//i.test(href || '');
export function linkAttrs(href) {
  return isExternal(href) ? { href, target: '_blank', rel: 'noreferrer' } : { href };
}

// 图标加载失败时换成首字，避免出现破图
export function icon(item, className, size = 60) {
  const letter = () => el('span', className + ' is-letter', { 'aria-hidden': 'true', text: String(item.name || '?').trim().charAt(0) || '?' });
  if (!item.icon) return letter();
  const img = el('img', className, { src: item.icon, alt: '', width: size, height: size, decoding: 'async', loading: 'lazy', draggable: 'false' });
  img.addEventListener('error', () => img.replaceWith(letter()), { once: true });
  return img;
}

/* ---------- 主题：跟随系统 → 浅色 → 深色 ---------- */
const THEME_KEY = 'homepage-theme', THEMES = ['auto', 'light', 'dark'];
const THEME_ICONS = {
  auto: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 3v18"/>',
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'
};
const THEME_NAMES = { auto: '跟随系统', light: '浅色', dark: '深色' };
function readTheme() { try { const v = localStorage.getItem(THEME_KEY); return THEMES.includes(v) ? v : 'auto'; } catch { return 'auto'; } }
function applyTheme(mode) {
  if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', mode);
  try { localStorage.setItem(THEME_KEY, mode); } catch {}
}
export function themeToggle(className = 'theme-toggle') {
  let mode = readTheme();
  const btn = el('button', className, { type: 'button' });
  const paint = () => {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + THEME_ICONS[mode] + '</svg>';
    btn.setAttribute('aria-label', '配色：' + THEME_NAMES[mode] + '，点击切换');
    btn.title = '配色：' + THEME_NAMES[mode];
    btn.dataset.mode = mode;
  };
  applyTheme(mode); paint();
  btn.addEventListener('click', () => { mode = THEMES[(THEMES.indexOf(mode) + 1) % 3]; applyTheme(mode); paint(); });
  return btn;
}

/* ---------- 目录：先用缓存或快照渲染，再后台拉取最新 ---------- */
export function initialCatalog() {
  try {
    localStorage.removeItem('homepage-project-catalog-v1');
    const cached = JSON.parse(localStorage.getItem(CATALOG_CACHE_KEY));
    if (cached?.source === CATALOG_URL) return normalizeCatalog(cached.data);
  } catch {}
  return normalizeCatalog(JSON.parse(document.getElementById('catalogSnapshot').textContent));
}

export async function refreshCatalog(current, onChange) {
  try {
    const response = await fetch(CATALOG_URL, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw Error('Catalog unavailable');
    const fresh = normalizeCatalog(await response.json());
    try { localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify({ source: CATALOG_URL, data: fresh })); } catch {}
    if (JSON.stringify(fresh) !== JSON.stringify(current)) onChange(fresh);
  } catch { console.info('项目目录暂时无法更新，继续使用已保存的目录。'); }
}

export { projectGroups };
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function boot(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
}
