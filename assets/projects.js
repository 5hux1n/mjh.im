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
     meta    : 可选，灰色小字，用于功能或平台说明
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
    title: "Go for it!",
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
      desc: "给越狱设备写的功能增强插件，官网提供介绍与安装方式",
      items: [
        { name: "番茄净化", icon: "assets/project-icons/fanqie.svg", href: "https://fanqie.goforit.si/" },
        { name: "红果净化", icon: "assets/project-icons/hongguo.svg", href: "https://hongguo.goforit.si/" },
        { name: "闲鱼助手", icon: "assets/project-icons/xianyu.png", href: "https://xianyu.goforit.si/" },
        { name: "虚拟权限", icon: "assets/project-icons/fakeperm.png", href: "https://xnqx.goforit.si/" },
        { name: "WcLocate", icon: "assets/project-icons/wclocate.png", href: APT + "depiction/web/im.mjh.wclocate.html" },
        { name: "弹幕助手", icon: "assets/project-icons/danmu.png", href: APT + "depiction/web/danmutool.html" },
        { name: "Alipay2NFC", icon: "assets/project-icons/alipay2nfc.png", href: APT + "depiction/web/im.mjh.alipay2nfc.html" },
      ],
    },
    {
      id: "web",
      title: "网站项目",
      desc: "线上可访问的站点",
      items: [
        { name: "挠一挠", icon: "assets/project-icons/scratch.svg", href: "https://nao.goforit.si/" },
        { name: "DomainCheck", icon: "assets/project-icons/domaincheck.svg", meta: "域名批量查询", href: "https://domain.goforit.si/" },
        { name: "GoForIt.si", icon: "assets/project-icons/goforit.svg", href: "https://goforit.si/" },
        { name: "NoShakeAds.com", icon: "assets/project-icons/noshakeads.svg", href: "https://noshakeads.com" },
        { name: "Relaxin.dev", icon: "assets/project-icons/relaxin.png", href: "https://relaxin.dev" },
        { name: "ResetIt.lol", icon: "assets/project-icons/resetit.svg", href: "https://resetit.lol" },
        { name: "Is.baby", icon: "assets/project-icons/isbaby.svg", href: "https://is.baby" },
        { name: "Tengzhou.ren", icon: "assets/project-icons/tengzhou.svg", href: "https://tengzhou.ren" },
      ],
    },
    {
      id: "miniapp",
      title: "小程序",
      desc: "微信里直接打开的小工具",
      items: [
        { name: "网购退货截图生成器", icon: "assets/project-icons/return-shot.svg" },
        { name: "CC 你又想挨揍了", icon: "assets/project-icons/cc.svg" },
        { name: "抢谷子", icon: "assets/project-icons/guzi.png" },
        { name: "OBPlayer", icon: "assets/project-icons/obplayer.png" },
        { name: "方方格子离线登录授权", icon: "assets/project-icons/ffcell.ico" },
        { name: "抓小猫", icon: "assets/project-icons/catchcat.png" },
      ],
    },
    {
      id: "software",
      title: "软件",
      desc: "装在你设备上的成品",
      items: [
        { name: "CherryMac", icon: "assets/project-icons/cherrymac.svg", meta: "Mac · 网页键盘配置", href: "https://cherrymac.goforit.si/" },
        { name: "NSImg 助手", icon: "assets/project-icons/nsimg.png", meta: "浏览器扩展 · 用户脚本", href: "https://nsimg.goforit.si/" },
        { name: "CodexM", icon: "assets/project-icons/codexm.png", meta: "Mac", href: "https://codexm.goforit.si/" },
        { name: "OBPlayer", icon: "assets/project-icons/obplayer.png", meta: "直播播放器 · 多平台开发中", href: "https://obplayer.goforit.si/" },
      ],
    },
    {
      id: "opensource",
      title: "开源项目",
      desc: "项目介绍与公开的 GitHub 仓库",
      items: [
        { name: "印先森 M04S", icon: "assets/project-icons/m04s.svg", meta: "网页蓝牙打印 · Mac 驱动", href: "https://bleprint.goforit.si/" },
        { name: "WcSy", icon: "assets/project-icons/wcsy.svg", meta: "微信情景分析插件 · 实验中", href: "https://wcsy.goforit.si/" },
        { name: "Silex", icon: "assets/project-icons/silex.png", href: GH + "Silex" },
        { name: "APush", icon: "assets/project-icons/apush.svg", href: "https://apush.cn/" },
        { name: "PddShipBot", icon: "assets/project-icons/pdd-ship-bot.svg", href: GH + "pdd-ship-bot" },
        { name: "个体户税费计算器", icon: "assets/project-icons/soleprop-calc.svg", href: GH + "SolePropYearEndCalc" },
      ],
    },
  ],
};
