import { SITE } from './site.js?v=20261025-hexdump';
import { el, linkAttrs, themeToggle, worksCount, boot } from './core.js?v=20261025-hexdump';

// 设计：十六进制查看器。左边是每一行文字真实的 UTF-8 字节，右边是解码后的文字。
// 指针或键盘停在一行上，两边同时高亮。分段名借用 Mach-O 的写法，给做逆向的人看。

const enc = new TextEncoder();
const hex = b => b.toString(16).padStart(2, '0').toUpperCase();
const off = n => '0x' + n.toString(16).padStart(5, '0').toUpperCase();
let offset = 0;

function line(text, opts = {}) {
  const bytes = enc.encode(text);
  const start = offset;
  offset += bytes.length + 1; // 每行末尾算一个换行符 0A
  const hexCell = el('span', 'l__hex', { 'aria-hidden': 'true' });
  [...bytes, 0x0a].forEach((b, i) => hexCell.append(el('span', b === 0x0a && i === bytes.length ? 'b is-nl' : 'b', { text: hex(b) })));
  const textCell = opts.href
    ? el('a', 'l__text is-link', linkAttrs(opts.href), [el('span', null, { text }), opts.note ? el('span', 'l__note', { text: opts.note }) : null])
    : el(opts.tag || 'span', 'l__text' + (opts.cls ? ' ' + opts.cls : ''), { text });
  const row = el('div', 'l', { 'data-off': off(start) }, [el('span', 'l__off', { 'aria-hidden': 'true', text: off(start) }), hexCell, textCell]);
  if (opts.id) textCell.id = opts.id;
  return row;
}

function segment(name, summary, rows) {
  return el('section', 'seg', { 'aria-label': summary }, [
    el('p', 'seg__name', { 'aria-hidden': 'true' }, [el('span', null, { text: name }), el('span', 'seg__sum', { text: summary })]),
    ...rows
  ]);
}

function bytesOf(n) { return n.toLocaleString('en-US'); }

boot(() => {
  const s = SITE.site;
  offset = 0;
  const nameBytes = [...enc.encode(s.name)].map(hex).join(' ');

  const head = el('header', 'top', null, [
    el('p', 'top__file', null, [el('img', null, { src: s.logo, alt: '', width: 22, height: 22 }), el('span', null, { text: 'about.txt' })]),
    el('p', 'top__meta', { id: 'fileMeta' }),
    themeToggle('top__theme')
  ]);

  const hero = el('section', 'hero', { 'aria-labelledby': 'heroName' }, [
    el('p', 'hero__bytes', { 'aria-hidden': 'true', text: nameBytes }),
    el('h1', 'hero__name', { id: 'heroName', text: s.name }),
    el('p', 'hero__handle', { text: s.handle })
  ]);

  const intro = segment('__TEXT.__intro', '自我介绍', SITE.intro.map((t, i) => line(t, { tag: i === 0 ? 'strong' : 'span' })));
  const now = segment('__DATA.__now', '现在在做', SITE.now.map(n => line(n.title + '：' + n.text, { href: n.href, note: n.host })));
  const worksRow = line(SITE.works.label, { href: SITE.works.href, note: 'pingme.pm', cls: 'is-works' });
  worksRow.classList.add('l--works');
  worksRow.querySelector('.l__note').id = 'worksNote';
  const works = segment('__DATA.__works', '作品入口', [worksRow]);
  const links = segment('__LINKEDIT.__links', '在别处', SITE.links.map(l => line(l.label, { href: l.href, note: l.host })));
  const sig = segment('__TEXT.__cstring', '签名', [line(s.quote), line(s.title + ' ' + s.motto)]);

  const dump = el('main', 'dump', { id: 'main' }, [hero, intro, now, works, links, sig]);
  const foot = el('footer', 'foot', null, [
    el('p', null, { text: '左边是右边每一行文字的 UTF-8 编码，0A 是换行。' }),
    s.badge?.src ? el('a', 'foot__badge', linkAttrs(s.badge.href), [el('img', null, { src: s.badge.src, alt: s.badge.alt, width: 38, height: 16, loading: 'lazy' })]) : null
  ]);
  document.getElementById('app').append(head, dump, foot);
  document.getElementById('fileMeta').textContent = 'UTF-8，' + bytesOf(offset) + ' 字节';

  worksCount(n => { document.getElementById('worksNote').textContent = n + ' 个，在 pingme.pm'; });

  // 键盘聚焦到链接时，整行也高亮
  dump.addEventListener('focusin', e => e.target.closest('.l')?.classList.add('is-focus'));
  dump.addEventListener('focusout', e => e.target.closest('.l')?.classList.remove('is-focus'));
});
