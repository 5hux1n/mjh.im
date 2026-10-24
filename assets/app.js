import { SITE } from './site.js?v=20261025-glass';
import { el, linkAttrs, themeToggle, worksCount, reducedMotion, boot } from './core.js?v=20261025-glass';

// 设计：iOS 26 液态玻璃。背后是一张大字壁纸，玻璃浮在上面；
// 在支持的浏览器里，玻璃边缘用位移贴图真实地折射背后的字，其他浏览器退回清透的毛玻璃。

const ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';

function nav() {
  const s = SITE.site;
  const links = el('div', 'nav__links');
  SITE.links.forEach(l => links.append(el('a', null, Object.assign(linkAttrs(l.href), { text: l.label }))));
  return el('header', 'navwrap', null, [
    el('nav', 'lg lg--clear nav', { 'aria-label': '主导航' }, [
      el('a', 'nav__me', { href: '#main', 'aria-label': s.name }, [el('img', null, { src: s.logo, alt: '', width: 28, height: 28 }), el('span', null, { text: s.name })]),
      links
    ]),
    themeToggle('lg lg--clear nav__theme')
  ]);
}

function hero() {
  const s = SITE.site;
  const [first, ...rest] = SITE.intro;
  return el('section', 'lg sheet hero', { 'aria-labelledby': 'heroTitle' }, [
    el('img', 'hero__avatar', { src: s.logo, alt: '', width: 72, height: 72 }),
    el('h1', 'hero__title', { id: 'heroTitle', text: first }),
    ...rest.map(t => el('p', 'hero__text', { text: t }))
  ]);
}

function now() {
  const list = el('ul', 'now__list', { role: 'list' });
  SITE.now.forEach(n => list.append(el('li', null, null, [
    el('a', 'now__row', linkAttrs(n.href), [
      el('span', 'now__title', { text: n.title }),
      el('span', 'now__text', { text: n.text }),
      el('span', 'now__host', { text: n.host })
    ])
  ])));
  return el('section', 'lg sheet now', { 'aria-labelledby': 'nowTitle' }, [el('h2', 'now__head', { id: 'nowTitle', text: '现在在做' }), list]);
}

function works() {
  return el('a', 'lg lg--tint works', linkAttrs(SITE.works.href), [
    el('span', 'works__label', { text: SITE.works.label }),
    el('span', 'works__count', { id: 'worksCount', text: '在 PingMe' }),
    el('span', 'works__arrow', { html: ARROW })
  ]);
}

function footer() {
  const s = SITE.site;
  return el('footer', 'foot', null, [
    el('blockquote', 'lg sheet foot__quote', null, [el('p', null, { text: s.quote }), el('p', 'foot__by', { text: '写在我的博客签名里' })]),
    el('div', 'foot__row', null, [
      el('p', null, { text: s.title + ' ' + s.motto }),
      s.badge?.src ? el('a', 'foot__badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, width: 38, height: 16, loading: 'lazy' })]) : null
    ])
  ]);
}

/* ---------- 折射：为每块玻璃生成一张边缘位移贴图 ---------- */
// 只有 Chromium 能把 SVG 滤镜用在 backdrop-filter 上；其他浏览器保持 CSS 里的毛玻璃。
const canLens = () => /Chrome\//.test(navigator.userAgent) && CSS.supports('backdrop-filter', 'url(#a) blur(1px)');
const SVGNS = 'http://www.w3.org/2000/svg';
let defs, lensId = 0;

function radiusOf(node) { return parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0; }

// R 通道是水平位移，G 通道是垂直位移；128 表示不动。离边越近，往里推得越多，像透镜的厚边。
function mapFor(w, h, r, band) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  r = Math.min(r, w / 2, h / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // 到圆角矩形边的距离与向内的法线
      const qx = Math.max(r - x, 0, x - (w - 1 - r));
      const qy = Math.max(r - y, 0, y - (h - 1 - r));
      let dist, nx = 0, ny = 0;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        dist = r - len;
        nx = (x < w / 2 ? 1 : -1) * qx / len;
        ny = (y < h / 2 ? 1 : -1) * qy / len;
      } else {
        const dl = x, dr = w - 1 - x, dt = y, db = h - 1 - y;
        dist = Math.min(dl, dr, dt, db);
        if (dist === dl) nx = 1; else if (dist === dr) nx = -1; else if (dist === dt) ny = 1; else ny = -1;
      }
      const t = Math.max(0, 1 - dist / band);
      const k = t * t * (3 - 2 * t); // smoothstep
      const i = (y * w + x) * 4;
      d[i] = 128 + nx * k * 127;
      d[i + 1] = 128 + ny * k * 127;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function lens(node) {
  const id = 'lens-' + (++lensId);
  const filter = document.createElementNS(SVGNS, 'filter');
  filter.setAttribute('id', id);
  filter.setAttribute('x', '0'); filter.setAttribute('y', '0');
  filter.setAttribute('width', '100%'); filter.setAttribute('height', '100%');
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  const image = document.createElementNS(SVGNS, 'feImage');
  image.setAttribute('result', 'map'); image.setAttribute('preserveAspectRatio', 'none');
  const blur = document.createElementNS(SVGNS, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic'); blur.setAttribute('stdDeviation', node.classList.contains('sheet') ? '7' : '0.6'); blur.setAttribute('result', 'soft');
  const disp = document.createElementNS(SVGNS, 'feDisplacementMap');
  disp.setAttribute('in', 'soft'); disp.setAttribute('in2', 'map');
  disp.setAttribute('xChannelSelector', 'R'); disp.setAttribute('yChannelSelector', 'G');
  filter.append(image, blur, disp);
  defs.append(filter);
  const paint = () => {
    const w = Math.round(node.offsetWidth), h = Math.round(node.offsetHeight);
    if (!w || !h) return;
    const band = Math.min(26, h / 2.5);
    image.setAttribute('width', w); image.setAttribute('height', h);
    image.setAttribute('href', mapFor(w, h, radiusOf(node), band));
    disp.setAttribute('scale', String(Math.round(band * 1.6)));
  };
  paint();
  new ResizeObserver(() => paint()).observe(node);
  node.style.setProperty('--lens', `url(#${id})`);
  node.classList.add('has-lens');
}

function setupLenses() {
  if (!canLens() || reducedMotion()) return;
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  defs = document.createElementNS(SVGNS, 'defs');
  svg.append(defs);
  document.body.append(svg);
  document.querySelectorAll('.lg').forEach(lens);
}

// 高光随指针移动，像光照在玻璃上
function specular() {
  if (reducedMotion() || !matchMedia('(hover: hover)').matches) return;
  addEventListener('pointermove', e => {
    document.querySelectorAll('.lg').forEach(g => {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }, { passive: true });
}

boot(() => {
  const wall = el('div', 'wall', { 'aria-hidden': 'true' }, [el('span', 'wall__go', { text: 'Go' }), el('span', 'wall__for', { text: 'for' }), el('span', 'wall__it', { text: 'it!' })]);
  document.getElementById('app').append(
    wall,
    nav(),
    el('main', 'page', { id: 'main' }, [hero(), el('div', 'pair', null, [now(), works()])]),
    footer()
  );
  worksCount(n => { document.getElementById('worksCount').textContent = n + ' 个作品，在 PingMe'; });
  const go = () => { setupLenses(); specular(); };
  // 等壁纸字体就位再算贴图，避免第一次测量的尺寸不准
  (document.fonts?.ready || Promise.resolve()).then(go);
});
