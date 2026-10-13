# mjh.im

俊宏的个人主页：<https://mjh.im/>。原生 HTML、CSS 与 JavaScript，通过 GitHub Pages 发布。

## 项目目录

项目列表统一由 [PingMe 反馈中心](https://pingme.pm/admin) 的“项目管理”维护。名称、简介、官网、分类、分组说明、排序和图片自动同步；“个人主页展示”控制是否在本站出现。本站没有独立项目配置，也不重复保存项目图标。

页面先渲染随源码生成的目录快照，再在后台请求 `https://pingme.pm/api/catalog`。成功后更新目录并保存浏览器缓存；接口暂时不可用时继续显示已有目录。接口缓存最多 60 秒，刷新页面即可取得最新项目数据。

## 维护与发布

- 个人资料与导航：`assets/site.js`。
- 项目目录读取与校验：`assets/catalog.js`。
- 页面样式：`assets/styles.css`。
- 发布前运行 `npm run snapshot`，从反馈中心接口重新生成 index.html 中的回退快照，再推送源码。需要 Node.js 22+，无需安装第三方依赖。生成快照不作为项目编辑入口。
- GitHub Pages 发布 main 分支根目录；自定义域名保存在 CNAME。
