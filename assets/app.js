import { SITE } from './site.js?v=20261013-unified-catalog';
import { el, linkAttrs, icon, themeToggle, initialCatalog, refreshCatalog, projectGroups, reducedMotion, boot } from './core.js?v=20261025-chat';

// 设计：Vibe Coding 就是聊天。右边是俊宏发出的想法，左边是做出来的成品。底部输入框可以直接搜。
let catalog, query = '';

function header() {
  const s = SITE.site;
  const nav = el('nav', 'bar__nav', { 'aria-label': '主导航' });
  SITE.nav.forEach(n => nav.append(el('a', null, Object.assign(linkAttrs(n.href), { text: n.label }))));
  nav.append(themeToggle('bar__theme'));
  return el('header', 'bar', null, [
    el('div', 'bar__who', null, [
      el('img', 'bar__avatar', { src: s.logo, alt: '', width: 36, height: 36 }),
      el('div', null, null, [el('h1', 'bar__name', { text: s.name + '和 AI' }), el('p', 'bar__sub', { id: 'barSub' })])
    ]),
    nav
  ]);
}

function pair(item, group) {
  const s = SITE.site;
  const idea = el('div', 'msg msg--me', null, [
    el('p', 'bubble bubble--me', { text: item.meta || item.name }),
    el('img', 'msg__avatar', { src: s.logo, alt: '', width: 40, height: 40, loading: 'lazy' })
  ]);
  const card = [
    el('span', 'reply__name', { text: item.name }),
    el('span', 'reply__kind', { text: group.title }),
    el('span', 'reply__action', { text: item.href ? '打开看看' : '在微信里搜「' + item.name + '」' })
  ];
  const reply = el('div', 'msg msg--it', null, [
    icon(item, 'msg__avatar msg__avatar--app', 40),
    item.href ? el('a', 'bubble bubble--it', linkAttrs(item.href), card) : el('div', 'bubble bubble--it is-static', null, card)
  ]);
  return el('li', 'turn', { 'data-search': (item.name + ' ' + item.meta + ' ' + group.title).toLowerCase() }, [idea, reply]);
}

function thread() {
  const groups = projectGroups(catalog);
  const list = el('ol', 'thread', { id: 'thread', 'aria-label': '成品记录' });
  list.append(el('li', 'note', null, [el('p', null, { text: SITE.site.title + ' ' + SITE.site.motto })]));
  list.append(el('li', 'msg msg--me intro', null, [
    el('p', 'bubble bubble--me', { text: '下面这些，都是我用大白话和 AI 一起做出来的。想找哪个，直接在底下输入框里打字。' }),
    el('img', 'msg__avatar', { src: SITE.site.logo, alt: '', width: 40, height: 40 })
  ]));
  let n = 0;
  groups.forEach(g => {
    list.append(el('li', 'divider', { id: 'g-' + g.id, 'data-group': g.id }, [el('h2', null, { text: g.title }), el('p', null, { text: (g.desc ? g.desc + '，' : '') + g.items.length + ' 个' })]));
    g.items.forEach(it => { const t = pair(it, g); t.dataset.group = g.id; if (n < 6) t.style.setProperty('--d', (0.25 + n * 0.12) + 's'); n++; list.append(t); });
  });
  list.append(el('li', 'empty', { id: 'empty', hidden: true }));
  return list;
}

function applyQuery() {
  const q = query.trim().toLowerCase();
  const turns = [...document.querySelectorAll('.turn')];
  const shownGroups = new Set();
  let hits = 0;
  turns.forEach(t => { const ok = !q || t.dataset.search.includes(q); t.hidden = !ok; if (ok) { hits++; shownGroups.add(t.dataset.group); } });
  document.querySelectorAll('.divider').forEach(d => { d.hidden = !shownGroups.has(d.dataset.group); });
  document.querySelector('.intro').hidden = document.querySelector('.thread .note').hidden = Boolean(q);
  const empty = document.getElementById('empty');
  empty.hidden = hits > 0;
  if (!hits) empty.textContent = '还没做过和「' + query.trim() + '」有关的东西。有想法的话，点右上角「联系我」告诉我。';
  document.getElementById('barSub').textContent = q ? '找到 ' + hits + ' 个' : catalog.projects.length + ' 个成品';
  document.getElementById('composerStatus').textContent = q ? (hits ? '找到 ' + hits + ' 个和「' + query.trim() + '」有关的成品' : '没有找到') : '';
}

function composer() {
  const input = el('input', 'composer__input', { type: 'search', placeholder: '搜一下：微信、通知、打印…', 'aria-label': '搜索成品', autocomplete: 'off', enterkeyhint: 'search' });
  input.addEventListener('input', () => { query = input.value; applyQuery(); if (query) scrollTo({ top: 0, behavior: 'auto' }); });
  const chips = el('div', 'chips', { role: 'list', 'aria-label': '跳到分类' });
  const paintChips = () => chips.replaceChildren(...projectGroups(catalog).map(g => el('a', 'chip', { role: 'listitem', href: '#g-' + g.id, text: g.title, onclick: () => { if (query) { input.value = query = ''; applyQuery(); } } })));
  paintChips();
  const form = el('form', 'composer', { role: 'search', onsubmit: e => { e.preventDefault(); document.querySelector('.turn:not([hidden]) .bubble--it')?.focus(); } }, [
    chips,
    el('div', 'composer__row', null, [input, el('button', 'composer__send', { type: 'submit', text: '搜索' })]),
    el('p', 'sr-only', { id: 'composerStatus', 'aria-live': 'polite' })
  ]);
  form.repaint = paintChips;
  return form;
}

function footer() {
  const s = SITE.site;
  if (!s.badge?.src) return null;
  return el('footer', 'foot', null, [el('a', null, linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, height: 16, width: 38, loading: 'lazy' })])]);
}

boot(() => {
  catalog = initialCatalog();
  const box = composer();
  const main = el('main', 'chat', { id: 'main' }, [thread(), footer()]);
  document.getElementById('app').append(header(), main, box);
  applyQuery();
  if (!reducedMotion()) document.body.classList.add('is-arriving');
  refreshCatalog(catalog, fresh => {
    catalog = fresh;
    document.getElementById('thread').replaceWith(thread());
    box.repaint(); applyQuery();
  });
});
