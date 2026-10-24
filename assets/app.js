import { SITE } from './site.js?v=20261013-unified-catalog';
import { el, linkAttrs, icon, themeToggle, initialCatalog, refreshCatalog, projectGroups, reducedMotion, boot } from './core.js?v=20261025-poster';

// 设计：一张「想做就做」的海报，往下是全部成品的大字索引。
let catalog, active = 'all';

function topbar() {
  const s = SITE.site;
  const nav = el('nav', 'top__nav', { 'aria-label': '主导航' });
  SITE.nav.forEach(n => nav.append(el('a', null, Object.assign(linkAttrs(n.href), { text: n.label }))));
  nav.append(themeToggle('top__theme'));
  return el('header', 'top', null, [
    el('a', 'top__brand', { href: '#main' }, [el('img', null, { src: s.logo, alt: '', width: 28, height: 28 }), el('span', null, { text: s.name })]),
    nav
  ]);
}

function hero() {
  const s = SITE.site;
  const chars = el('h1', 'hero__chars', { 'aria-label': '想做就做' });
  [...'想做就做'].forEach((c, i) => chars.append(el('span', 'hero__char', { text: c, style: '--i:' + i, 'aria-hidden': 'true' })));
  return el('section', 'hero', { 'aria-labelledby': 'heroLine' }, [
    chars,
    el('div', 'hero__foot', null, [
      el('p', 'hero__line', { id: 'heroLine' }, [el('strong', null, { text: s.title }), document.createTextNode(' ' + s.motto)]),
      el('a', 'hero__jump', { href: '#index', id: 'heroJump' })
    ])
  ]);
}

function row(item, cat) {
  const cells = [
    icon(item, 'row__icon', 56),
    el('span', 'row__name', { text: item.name }),
    el('span', 'row__meta', { text: item.meta || cat.title }),
    el('span', 'row__go', { 'aria-hidden': 'true', text: item.href ? '打开' : '微信内' })
  ];
  return el('li', null, null, [item.href ? el('a', 'row', linkAttrs(item.href), cells) : el('div', 'row is-static', null, cells)]);
}

function filters(groups) {
  const bar = el('div', 'filters', { role: 'toolbar', 'aria-label': '按类型筛选' });
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const chip = (id, label, n) => el('button', 'chip', { type: 'button', 'aria-pressed': String(active === id), 'data-id': id, onclick: () => { active = id; paint(); } }, [el('span', null, { text: label }), el('sup', null, { text: n })]);
  bar.append(chip('all', '全部', total), ...groups.map(g => chip(g.id, g.title, g.items.length)));
  return bar;
}

function paint() {
  const groups = projectGroups(catalog);
  if (active !== 'all' && !groups.some(g => g.id === active)) active = 'all';
  const shown = active === 'all' ? groups : groups.filter(g => g.id === active);
  const list = el('div', 'chapters');
  shown.forEach(g => {
    const ul = el('ul', 'rows', { role: 'list' });
    g.items.forEach(it => ul.append(row(it, g)));
    list.append(el('section', 'chapter', { 'aria-labelledby': 'ch-' + g.id }, [
      el('header', 'chapter__head', null, [
        el('h2', 'chapter__title', { id: 'ch-' + g.id, text: g.title }),
        el('p', 'chapter__desc', { text: (g.desc ? g.desc + '，' : '') + '共 ' + g.items.length + ' 个' })
      ]),
      ul
    ]));
  });
  const index = document.getElementById('index');
  const chipFocused = document.activeElement?.classList.contains('chip');
  index.replaceChildren(filters(groups), list);
  if (chipFocused) {
    index.querySelector('.chip[aria-pressed="true"]')?.focus({ preventScroll: true });
    if (index.getBoundingClientRect().top < 0) index.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
  const jump = document.getElementById('heroJump');
  jump.textContent = '往下看 ' + catalog.projects.length + ' 个成品';
}

function footer() {
  const s = SITE.site;
  const f = el('footer', 'end', null, [
    el('p', 'end__big', { text: '想做，就去做。' }),
    el('p', 'end__small', { text: '这些都是用自然语言和 AI 一起写出来的。有想法或者遇到问题，来找我聊。' })
  ]);
  const links = el('nav', 'end__links', { 'aria-label': '页脚导航' });
  SITE.nav.forEach(n => links.append(el('a', null, Object.assign(linkAttrs(n.href), { text: n.label }))));
  if (s.badge?.src) links.append(el('a', 'end__badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, height: 16, width: 38, loading: 'lazy' })]));
  f.append(links);
  return f;
}

boot(() => {
  catalog = initialCatalog();
  const root = document.getElementById('app');
  root.append(topbar(), el('main', null, { id: 'main' }, [hero(), el('section', 'index', { id: 'index', 'aria-label': '全部成品' })]), footer());
  paint();
  if (!reducedMotion()) document.body.classList.add('is-stamping');
  refreshCatalog(catalog, fresh => { catalog = fresh; paint(); });
});
