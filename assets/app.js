import { SITE } from './site.js?v=20261025-vertical';
import { el, linkAttrs, themeToggle, worksCount, reducedMotion, boot } from './core.js?v=20261025-vertical';

// 设计：竖排名片。像一张从右往左读的中文名帖：最右是大字名字和一枚印章，
// 往左依次是自我介绍、现在在做、作品入口、链接，最左是博客签名作题跋。

function seal(name) {
  // 两字名竖排成方印：俊在右，宏在左，按传统印文从右往左读
  const chars = [...name];
  return el('span', 'seal', { 'aria-hidden': 'true' }, chars.map(c => el('span', null, { text: c })));
}

boot(() => {
  const s = SITE.site;
  const scroll = el('main', 'scroll', { id: 'main', tabindex: '-1' });

  scroll.append(el('header', 'col col--name', null, [
    el('h1', 'name', { text: s.name }),
    el('p', 'handle', { text: s.handle }),
    seal(s.name)
  ]));

  scroll.append(el('section', 'col col--intro', { 'aria-label': '自我介绍' }, SITE.intro.map(t => el('p', null, { text: t }))));

  const now = el('section', 'col col--now', { 'aria-labelledby': 'nowTitle' }, [el('h2', 'col__head', { id: 'nowTitle', text: '现在在做' })]);
  SITE.now.forEach(n => now.append(el('a', 'now', linkAttrs(n.href), [el('strong', null, { text: n.title }), el('span', null, { text: n.text })])));
  scroll.append(now);

  scroll.append(el('section', 'col col--works', { 'aria-label': '作品' }, [
    el('a', 'works', linkAttrs(SITE.works.href), [el('span', 'works__label', { text: SITE.works.label }), el('span', 'works__count', { id: 'worksCount', text: '在 PingMe' })])
  ]));

  const links = el('nav', 'col col--links', { 'aria-label': '链接' }, [el('h2', 'col__head', { text: '在别处' })]);
  SITE.links.forEach(l => links.append(el('a', 'link', linkAttrs(l.href), [el('span', null, { text: l.label }), el('span', 'link__host', { text: l.host })])));
  scroll.append(links);

  scroll.append(el('footer', 'col col--quote', null, [
    el('blockquote', null, null, [el('p', null, { text: s.quote })]),
    el('p', 'motto', { lang: 'en', text: s.title + ' ' + s.motto }),
    s.badge?.src ? el('a', 'badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, width: 38, height: 16, loading: 'lazy' })]) : null
  ]));

  document.getElementById('app').append(themeToggle('theme'), scroll);
  worksCount(n => { document.getElementById('worksCount').textContent = '共 ' + n + ' 个，在 PingMe'; });
  if (!reducedMotion()) document.body.classList.add('is-stamping');
});
