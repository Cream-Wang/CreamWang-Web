# 王艺霖个人作品集

React + Vite 静态作品集，包含六类作品、36 张图片、简历下载，以及六段可直接在网页中播放的 MP4 视频。

## 本地开发

使用 Node.js 24，运行 `npm ci`，然后运行 `npm run dev`。开发页面位于终端显示地址的 `/CreamWang-Web/` 路径。

运行 `npm run build` 生成 `dist/`；运行 `npm run preview` 检查生产构建。不要直接双击入口 HTML。

## GitHub Pages

本项目的发布地址为 `https://cream-wang.github.io/CreamWang-Web/`。`vite.config.js` 为该子路径设置了资源前缀；图片、字体、视频和 PDF 均随构建发布。

仓库 Pages 发布来源使用 GitHub Actions。推送到 `main` 后，`.github/workflows/deploy.yml` 自动安装依赖、构建并发布。

## 视频

| 文件 | 展示位置 |
|---|---|
| `public/videos/the-shadow-of-success.mp4` | The Shadow of Success |
| `public/videos/sunnie-1357.mp4` | Sunnie#1357 |
| `public/videos/study-with-me.mp4` | 小红书代表视频 |
| `public/videos/huanggang-japan.mp4` | 黄刚频道代表视频 |
| `public/videos/hide-and-seek.mp4` | 校园活动快剪 |
| `public/videos/scmp-crisis-report.mp4` | SCMP 国际危机模拟报道 |

视频使用 H.264 视频与 AAC 音频，并将 MP4 索引移到文件开头，便于在线播放。原素材保存在本地，仓库仅包含发布版本。每个 MP4 均低于 100 MiB。

点击封面后才加载视频，支持原生播放、暂停、进度跳转和全屏；小红书竖屏视频保持竖屏比例。原来的外部观看链接作为备用入口保留。

## 素材和组件许可

图片与视频由网站所有者提供。简历沿用原打包 PDF，SHA-256 为 `ee18b7f693802083a3300a1890f684994d6270b312b68816d1cedd027da60860`。

`src/components/Magnet.jsx` 来自 DavidHDev/react-bits，保留 MIT + Commons Clause 许可，见 `licenses/React-Bits-LICENSE.md`。

手写字体使用 Google Fonts Ma Shan Zheng 的字形子集，许可见 `licenses/MaShanZheng-OFL.txt`。修改手写标题时应检查字形覆盖。

## 发布版大小与本地验证

六个发布版视频合计约 193.25 MB，源视频合计约 565.11 MB；生产构建含图片和简历约 201.06 MB。最大的单个视频约 60.48 MB。

已在本地 Chrome 验证六个视频的加载、实际播放、暂停、进度跳转、关闭及备用入口；375、390、768、1280、1440px 宽度无整页横向溢出，PDF 返回有效文件。该记录不代替正式网址或国内访问网络的验收。

## 视觉与动效

以暗房和放映室为视觉方向，采用近黑底、细颗粒、低对比投影微光、镜头环纹和肖像画框。作品主体分层入场，目录和章节随阅读位置反馈，肖像仅在精细指针设备上轻微倾斜；校园快剪和 SCMP 采用桌面影像／说明双栏、手机单栏。

页顶可关闭氛围动效；系统减少动态效果偏好会直接禁用它们。页面不可见时暂停背景循环。动效使用 CSS 与浏览器原生能力，无新增依赖或外部背景图片，也不自动加载电影。

设计参考：[Fernando Vilanova](https://www.fernandovilanova.com/) 的影像优先与低对比背景、[Anant Jain](https://www.anantjae.com/) 的图文字阶，以及 [React Bits Dark Veil](https://reactbits.dev/backgrounds/dark-veil) 的暗处缓慢光感。只参考方向，未复制参考网站的图片或代码。

本轮 25 项动效／响应式检查和 37 项视频／下载回归检查通过；320–1440px 无整页横向溢出。检查与截图保存在本地 `output/playwright/`，不提交发布。
