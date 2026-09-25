/* ==========================================================================
   站点内容配置 —— 只改这个文件就能更新主页
   --------------------------------------------------------------------------
   每个分组（groups 里的一项）：
     id      : 唯一英文 id，用于锚点，如 #web
     title   : 分组标题（显示在区块左上角）
     desc    : 可选，分组副标题
     items   : 作品数组

   每个作品（items 里的一项）：
     name    : 作品名（必填）
     meta    : 灰色小字（只有「软件」分组在用，其他分组不需要）
     href    : 点击跳转的链接。不填 = 渲染成不可点击的静态卡片
     icon    : 可选，图标图片路径（建议 80x80 方图）
              不填则自动用作品名首字母生成占位图标
     cover   : 可选，预览大图路径。填了这张卡会变成跨两列的横向大卡
   ========================================================================== */

var GH = "https://github.com/5hux1n/";
var APT = "https://apt.mjh.im/"; // 越狱源，插件都从这里装
var MAIL = "mailto:mail@mjh.im";

window.SITE = {
  /* ---------- 站点信息 ---------- */
  site: {
    name: "俊宏",
    logo: "touxiang.jpg",
    title: "我做的东西",
    motto: "Ideas used to be limited by skills. Not anymore.", // 首屏座右铭，不想要就删掉这行
    year: null, // 留 null 自动取当前年份

    // 页脚的徽章，不想要就删掉这一项
    badge: {
      href: "https://noshakeads.com/10000",
      src: "https://noshakeads.com/badge.svg",
      alt: "NSAA",
      width: 52,
      height: 22,
    },
  },

  /* ---------- 顶栏导航 ---------- */
  nav: [
    { label: "GitHub", href: GH, external: true },
    { label: "越狱源", href: APT, external: true },
    { label: "联系我", href: MAIL },
  ],

  /* ---------- 页脚链接 ----------
     这几个入口顶栏右上角已经有了，页脚就不再重复。
     想让页脚也显示，把下面这段取消注释即可。 */
  // footer: [
  //   { label: "GitHub", href: GH, external: true },
  //   { label: "越狱源", href: APT, external: true },
  //   { label: "Email", href: MAIL },
  // ],

  /* ---------- 作品分组 ---------- */
  groups: [
    {
      id: "tweak",
      title: "iOS 越狱插件",
      desc: "给越狱设备写的功能增强插件，都能在越狱源里装到",
      items: [
        { name: "番茄净化", href: APT + "depiction/web/fanqiefn.html" },
        { name: "咸鱼助手", href: APT + "depiction/web/im.mjh.xianyuhelper.html" },
        { name: "虚拟权限", href: APT + "depiction/web/im.mjh.fakeperm.html" },
        { name: "wclocate", href: APT + "depiction/web/im.mjh.wclocate.html" },
        { name: "弹幕助手", href: APT + "depiction/web/danmutool.html" },
        { name: "Alipay2NFC", href: APT + "depiction/web/im.mjh.alipay2nfc.html" },
      ],
    },
    {
      id: "web",
      title: "网站项目",
      desc: "线上可访问的站点",
      items: [
        { name: "noshakeads.com", href: "https://noshakeads.com" },
        { name: "relaxin.dev", href: "https://relaxin.dev" },
        { name: "resetit.lol", href: "https://resetit.lol" },
        { name: "is.baby", href: "https://is.baby" },
        { name: "tengzhou.ren", href: "https://tengzhou.ren" },
      ],
    },
    {
      id: "miniapp",
      title: "小程序",
      desc: "微信里直接打开的小工具",
      items: [
        { name: "网购退货截图生成器" },
        { name: "cc 你又想挨揍了" },
        { name: "抢谷子" },
        { name: "OB 播放器" },
        { name: "方方格子离线登录授权" },
        { name: "抓小猫" },
      ],
    },
    {
      id: "software",
      title: "软件",
      desc: "装在你设备上的成品",
      items: [
        { name: "CodexM", meta: "Mac" }, // 没有公开仓库，暂不挂链接
        { name: "OB 播放器", meta: "Mac · Windows · Android · iOS", href: GH + "obplayer" },
      ],
    },
    {
      id: "opensource",
      title: "开源项目",
      desc: "公开在 GitHub 上的仓库",
      items: [
        { name: "Silex", href: GH + "Silex" },
        { name: "apush", href: GH + "apush" },
        { name: "pdd-ship-bot", href: GH + "pdd-ship-bot" },
        { name: "个体户税费计算器", href: GH + "SolePropYearEndCalc" },
      ],
    },
  ],
};
