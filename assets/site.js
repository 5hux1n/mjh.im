// 个人资料。三个设计共用这一份文案，改这里即可。作品列表不在这里，统一由 PingMe 维护。
export const SITE = {
  site: {
    name: '俊宏',
    handle: '5hux1n',
    signature: 'junhong',
    city: '山东滕州',
    logo: 'touxiang.jpg',
    title: 'Go for it!',
    motto: 'Ideas used to be limited by skills. Not anymore.',
    quote: '如果一件事还没开始你就考虑失败了怎么办，那干脆就别做了。',
    quoteNote: 'No bb, one two three, go',
    copyright: '5huX1n',
    credit: 'Designed with Claude'
  },
  // 头像下面的几条基本信息：icon 可选 pin / age / male / work
  facts: [
    { icon: 'pin', text: '山东滕州' },
    { icon: 'age', text: '90后' },
    { icon: 'male', text: '男' },
    { icon: 'work', text: '自由职业' }
  ],
  // 自我介绍，一句一段
  intro: [
    '90后终于赶上了 AI 这个黄金时代。'
  ],
  // 现在在做的事
  now: [
    { title: '越狱插件', text: '维护自己的插件源，给常用 App 做增强和修复。', href: 'https://apt.mjh.im/', host: 'apt.mjh.im' },
    { title: 'PingMe', text: '所有项目的反馈都汇总在这里，也是作品的完整目录。', href: 'https://pingme.pm/', host: 'pingme.pm' },
    { title: '书信', text: '在自己写的微博客上记日常和逆向笔记。', href: 'https://shuxin.my/', host: 'shuxin.my' }
  ],
  // 作品入口：首页只放这一个入口，数字来自 PingMe 目录
  works: { href: 'https://pingme.pm/', label: '看看我做过的全部作品' },
  links: [
    { label: 'GitHub', href: 'https://github.com/5hux1n/', host: 'github.com/5hux1n' },
    { label: '博客', href: 'https://shuxin.my/', host: 'shuxin.my' },
    { label: '插件源', href: 'https://apt.mjh.im/', host: 'apt.mjh.im' },
    { label: '联系我', href: 'https://pingme.pm/about', host: 'pingme.pm' }
  ]
};
