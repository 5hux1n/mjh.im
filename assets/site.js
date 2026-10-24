// 个人资料。三个设计共用这一份文案，改这里即可。作品列表不在这里，统一由 PingMe 维护。
export const SITE = {
  site: {
    name: '俊宏',
    handle: '5hux1n',
    city: '山东滕州',
    logo: 'touxiang.jpg',
    title: 'Go for it!',
    motto: 'Ideas used to be limited by skills. Not anymore.',
    quote: '活着就别考虑那么多条条框框，又不是写作文一样有人给你打分。',
    badge: { href: 'https://noshakeads.com/10000', src: 'https://noshakeads.com/badge.svg', alt: 'NSAA', width: 52, height: 22 }
  },
  // 自我介绍，一句一段
  intro: [
    '我是俊宏，在山东滕州，网上常用的名字是 5hux1n。',
    '两年前开始做 iOS 越狱插件和 App 逆向，现在也写网站、微信小程序和 Mac 小工具。',
    '这些东西大多是我用大白话和 AI 一起写出来的。以前想法受限于技术，现在不会了。'
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
