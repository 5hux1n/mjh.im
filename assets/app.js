/* ==========================================================================
   渲染器 —— 读取 projects.js 里的 window.SITE 生成页面
   一般不需要改这个文件
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || {};

  /* ---------- 小工具 ---------- */
  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === undefined || v === null) return;
        // textContent / html 是 DOM 属性，不能走 setAttribute
        if (k === "textContent") {
          node.textContent = v;
        } else if (k === "html") {
          node.innerHTML = v;
        } else {
          node.setAttribute(k, v);
        }
      });
    }
    return node;
  }

  function external(href) {
    return /^https?:\/\//i.test(href || "");
  }

  function initial(name) {
    var s = String(name || "?").trim();
    // 取第一个字符；中文名也能正常显示
    return s ? s.charAt(0) : "?";
  }

  /* ---------- 主题切换：auto → light → dark → auto ---------- */
  var THEME_KEY = "homepage-theme";
  var THEMES = ["auto", "light", "dark"];
  var ICONS = {
    auto: '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/><path d="M12 3v18"/>',
    light:
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  };

  function readTheme() {
    try {
      var v = localStorage.getItem(THEME_KEY);
      return THEMES.indexOf(v) >= 0 ? v : "auto";
    } catch (e) {
      return "auto";
    }
  }

  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      /* 隐私模式下忽略 */
    }
  }

  /* ---------- 顶栏 ---------- */
  function buildHeader() {
    var s = SITE.site || {};
    var header = el("header", "header");

    var brand = el("a", "brand", { href: "#main", "aria-label": s.name || "首页" });
    if (s.logo) {
      brand.appendChild(el("img", "brand__logo", { src: s.logo, alt: "", width: 20, height: 20 }));
    }
    brand.appendChild(el("span", "brand__name", { textContent: s.name || "" }));
    header.appendChild(brand);

    var nav = el("nav", "nav", { "aria-label": "主导航" });
    (SITE.nav || []).forEach(function (item) {
      var attrs = { href: item.href };
      if (item.external || external(item.href)) {
        attrs.target = "_blank";
        attrs.rel = "noreferrer";
      }
      nav.appendChild(el("a", null, Object.assign(attrs, { textContent: item.label })));
    });

    var toggle = el("button", "theme-toggle", {
      type: "button",
      "aria-label": "切换配色",
      title: "切换配色：跟随系统 / 浅色 / 深色",
    });
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>';
    var svg = toggle.firstChild;

    function paint(mode) {
      svg.innerHTML = ICONS[mode];
      toggle.setAttribute("data-mode", mode);
    }

    var mode = readTheme();
    applyTheme(mode);
    paint(mode);

    toggle.addEventListener("click", function () {
      mode = THEMES[(THEMES.indexOf(mode) + 1) % THEMES.length];
      applyTheme(mode);
      paint(mode);
    });

    nav.appendChild(toggle);
    header.appendChild(nav);
    return header;
  }

  /* ---------- 卡片 ---------- */
  function buildCard(item) {
    var isBig = Boolean(item.cover) || item.featured === true;
    // 没有链接的作品（比如微信小程序）渲染成静态卡片，不做成点了没反应的假链接
    var hasLink = Boolean(item.href);
    var cls = "card" + (isBig ? " card--featured" : "") + (hasLink ? "" : " card--static");
    var card = hasLink ? el("a", cls, { href: item.href }) : el("div", cls);
    if (hasLink && external(item.href)) {
      card.setAttribute("target", "_blank");
      card.setAttribute("rel", "noreferrer");
    }

    var row = card;
    if (isBig) {
      if (item.cover) {
        var cover = el("span", "card__cover");
        var img = el("img", null, { src: item.cover, alt: "", loading: "lazy" });
        cover.appendChild(img);
        card.appendChild(cover);
      }
      row = el("span", "card__row");
      card.appendChild(row);
    }

    if (item.icon) {
      row.appendChild(
        el("img", "card__icon", { src: item.icon, alt: "", width: 40, height: 40, loading: "lazy" })
      );
    } else {
      var letter = el("span", "card__icon card__icon--letter", { "aria-hidden": "true" });
      letter.textContent = initial(item.name);
      row.appendChild(letter);
    }

    var body = el("span", "card__body");
    body.appendChild(el("span", "card__title", { textContent: item.name || "" }));
    if (item.meta) {
      body.appendChild(el("span", "card__meta", { textContent: item.meta }));
    }
    row.appendChild(body);

    if (hasLink) {
      var arrow = el("span", "card__arrow");
      arrow.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14">' +
        '<path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
      row.appendChild(arrow);
    }

    return card;
  }

  /* ---------- 分组 ---------- */
  function buildGroup(group, index) {
    var items = (group.items || []).filter(Boolean);
    if (!items.length) return null;

    var section = el("section", "reveal");
    section.style.animationDelay = 0.16 + index * 0.1 + "s";
    section.setAttribute("aria-labelledby", group.id + "-title");

    var head = el("div", "group__head");
    head.appendChild(el("h2", "group__title", { id: group.id + "-title", textContent: group.title }));
    head.appendChild(
      el("span", "group__count", { textContent: String(items.length).padStart(2, "0") })
    );
    section.appendChild(head);

    if (group.desc) {
      section.appendChild(el("p", "group__desc", { textContent: group.desc }));
    }

    var grid = el("div", "grid");
    items.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });
    section.appendChild(grid);

    return section;
  }

  /* ---------- 页脚 ---------- */
  function buildFooter() {
    var s = SITE.site || {};
    var footer = el("footer", "footer reveal");
    footer.style.animationDelay = "0.36s";

    // 第一行：个性签名（可选）
    if (s.sign) {
      footer.appendChild(el("p", "footer__sign", { textContent: s.sign }));
    }

    // 第二行：链接（可选，顶栏已有这些入口时留空即可）
    var items = SITE.footer || [];
    if (items.length) {
      var links = el("nav", "footer__links", { "aria-label": "页脚导航" });
      items.forEach(function (item, i) {
        if (i > 0) {
          links.appendChild(el("span", "footer__sep", { "aria-hidden": "true", textContent: "·" }));
        }
        var attrs = { href: item.href, textContent: item.label };
        if (item.external || external(item.href)) {
          attrs.target = "_blank";
          attrs.rel = "noreferrer";
        }
        links.appendChild(el("a", null, attrs));
      });
      footer.appendChild(links);
    }

    // 底行：版权 + 徽章，同一行右对齐
    var bottom = el("div", "footer__bottom");

    var year = s.year || new Date().getFullYear();
    var copy = el("span", "footer__copy");
    copy.appendChild(el("span", "footer__c", { "aria-hidden": "true", textContent: "©" }));
    copy.appendChild(document.createTextNode(" " + year + " " + (s.name || "")));
    if (s.footerNote) {
      copy.appendChild(el("span", "footer__sep", { "aria-hidden": "true", textContent: "·" }));
      copy.appendChild(document.createTextNode(s.footerNote));
    }
    bottom.appendChild(copy);

    // 徽章（可选）
    if (s.badge && s.badge.src) {
      var badgeLink = el("a", "footer__badge", { href: s.badge.href || "#" });
      if (external(s.badge.href)) {
        badgeLink.setAttribute("target", "_blank");
        badgeLink.setAttribute("rel", "noreferrer");
      }
      badgeLink.appendChild(
        el("img", null, {
          src: s.badge.src,
          alt: s.badge.alt || "",
          width: s.badge.width || 52,
          height: s.badge.height || 22,
          loading: "lazy",
        })
      );
      bottom.appendChild(badgeLink);
    }

    footer.appendChild(bottom);

    return footer;
  }

  /* ---------- 组装 ---------- */
  function render() {
    var s = SITE.site || {};
    var root = document.getElementById("app");
    if (!root) return;

    document.title = s.name ? s.name : "我的主页";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s.subtitle) metaDesc.setAttribute("content", s.subtitle);

    root.appendChild(buildHeader());

    var main = el("main", null, { id: "main" });

    var hero = el("section", "hero reveal");
    hero.style.animationDelay = "0.06s";
    hero.appendChild(el("h1", "hero__title", { textContent: s.title || "" }));
    if (s.motto) {
      hero.appendChild(el("p", "hero__motto", { textContent: s.motto }));
    }
    if (s.subtitle) {
      hero.appendChild(el("p", "hero__subtitle", { textContent: s.subtitle }));
    }
    main.appendChild(hero);

    var groups = el("div", "groups");
    (SITE.groups || []).forEach(function (group, i) {
      var node = buildGroup(group, i);
      if (node) groups.appendChild(node);
    });
    main.appendChild(groups);

    main.appendChild(buildFooter());
    root.appendChild(main);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
