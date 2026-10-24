# mjh.im

俊宏的个人主页：<https://mjh.im/>。原生 HTML、CSS 与 JavaScript，通过 GitHub Pages 发布。

> **设计方案 `home-glass`**：iOS 26 液态玻璃风格。背后是一张「Go for it!」大字壁纸，导航、自我介绍、「现在在做」和作品入口都是浮在上面的玻璃；在 Chrome / Edge 里玻璃边缘会用 SVG 位移贴图真实折射背后的字，其他浏览器退回清透的毛玻璃。
>
> 首页只介绍我是谁、在做什么；作品不在首页逐个列出，只留一个去 PingMe 的入口，入口上的作品数量仍来自 PingMe 目录（快照 + 后台刷新）。

## 项目目录

首页不再逐个展示项目，只显示作品数量和 PingMe 入口。项目列表统一由 [PingMe 反馈中心](https://pingme.pm/admin) 的“项目管理”维护。名称、简介、官网、分类、分组说明、排序和图片自动同步；“个人主页展示”控制是否在本站出现。本站没有独立项目配置，也不重复保存项目图标。

页面先渲染随源码生成的目录快照，再在后台请求 `https://pingme.pm/api/catalog`。成功后更新目录并保存浏览器缓存；接口暂时不可用时继续显示已有目录。接口缓存最多 60 秒，刷新页面即可取得最新项目数据。

## 维护与发布

- 个人资料、自我介绍、「现在在做」和链接：`assets/site.js`（三个设计共用同一份文案）。
- 页面结构：`assets/app.js`；共用逻辑（主题、作品数量）：`assets/core.js`。
- 项目目录读取与校验：`assets/catalog.js`。
- 页面样式：`assets/styles.css`。
- 发布前运行 `npm run snapshot`，从反馈中心接口重新生成 index.html 中的回退快照，再推送源码。需要 Node.js 22+，无需安装第三方依赖。生成快照不作为项目编辑入口。
- GitHub Pages 发布 main 分支根目录；自定义域名保存在 CNAME。
