# Autoplay 音乐定时播放

## To Use 使用它
需要安装[Git](https://git-scm.com/)和[Nodejs](https://nodejs.org/en/)，运行以下命令:

```bash
# Clone this repository
git clone https://github.com/mikehumix/autoplay
# Go into the repository
cd autoplay
# Install dependencies
npm install
# Run the app
npm start
# Package the app
npm run-script packager
```

Note: 安装的依赖模块有点大，建议用[npm淘宝镜像](https://npm.taobao.org/).



## 技术小栈
- `Electron` - Nodejs流行趋势模块，Build cross platform desktop apps with JavaScript, HTML, and CSS，会前端也可以开发桌面级别应用；
- `cron` - [cron](https://www.npmjs.com/package/cron)是服务器级别定时服务，‘cronTime: '* 0-57 8 * * *',’妥妥的，注意nodejs的cron服务和linux略有不同；
- `Aplayer` - [Aplayer](https://github.com/MoePlayer/APlayer)是HTML5音频播放最好开源库，api全面，支持网易云；
- `Weui & Weuijs` - [Weui](https://github.com/Tencent/weui)是微信ui体系，无需设计快速构建漂亮且体验好的移动应用；[Weuijs](https://github.com/Tencent/weui.js)是weui界面交互轻量级 js 封装，弹窗、提醒、表单等都有.



## 应用截图(请扫码)
![shots](screenshot/00.jpg)


## 延伸：基本的Electron应用需要以下文件：

- `package.json` - NodeJs模块依赖.
- `main.js` - 启动应用并且创建窗口，是应用的主进程.
- `index.html` - 应用的入口.

当然你可以去electron官方去查看如何快速构建electron应用 [Electron Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).


## License

[CC0 1.0 (Public Domain)](LICENSE.md)
