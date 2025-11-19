# 朝戈读书

> 📖 每一个短篇，都是一段完整的旅程

一个使用 React + Ant Design 构建的现代化短篇小说阅读平台。

## ✨ 项目简介

朝戈读书是一个专注于短篇小说阅读和分享的开放平台。无需登录注册，随时随地用碎片时间品味完整的故事，每篇小说阅读时间约 5-15 分钟。

### 核心特性

- 📚 **精选短篇** - 多种分类的优质短篇小说
- 🌐 **完全开放** - 无需注册登录，所有内容公开阅读
- 🎨 **现代化设计** - 简洁美观的阅读界面
- 📱 **全平台适配** - 完美支持手机、平板、PC多端访问
- 🔍 **便捷搜索** - 快速找到感兴趣的作品
- 💡 **分类浏览** - 爱情、悬疑、科幻、武侠等多种分类
- ⚡ **极速加载** - 基于Vite构建，访问体验流畅

## 🛠️ 技术栈

- ⚡️ **Vite 5** - 新一代前端构建工具
- ⚛️ **React 18** - 用于构建用户界面的 JavaScript 库
- 🎨 **Ant Design 5** - 企业级 UI 设计语言和 React 组件库
- 🔀 **React Router 6** - React 路由管理
- 📝 **ESLint** - 代码质量检查工具

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动，浏览器会自动打开。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
cf-novel/
├── public/           # 静态资源
│   └── vite.svg      # 网站图标
├── src/              # 源代码
│   ├── api/          # API接口
│   │   └── index.js  # API统一管理
│   ├── pages/        # 页面组件
│   │   ├── Home.jsx       # 首页
│   │   ├── BookDetail.jsx # 小说详情/阅读页
│   │   ├── Library.jsx    # 图书馆/搜索页
│   │   └── Ranking.jsx    # 排行榜页
│   ├── utils/        # 工具函数
│   │   └── seo.js    # SEO工具
│   ├── App.jsx       # 主应用组件（包含布局和路由）
│   ├── App.css       # 应用样式
│   ├── main.jsx      # 应用入口
│   └── index.css     # 全局样式
├── index.html        # HTML 模板
├── package.json      # 项目配置和依赖
├── vite.config.js    # Vite 配置
├── .eslintrc.cjs     # ESLint 配置
├── README.md         # 项目文档
└── RESPONSIVE.md     # 响应式设计说明
```

## 🎯 功能模块

### 已实现

- ✅ 响应式顶部导航栏（手机/平板/PC全适配）
- ✅ Banner 轮播展示
- ✅ 分类标签快速筛选（**已接入后端API**）
- ✅ 热门推荐小说展示（**已接入后端API**，显示12本）
- ✅ 最新更新列表（**已接入后端API**，显示4本）
- ✅ 小说卡片（封面、标题、作者、字数、简介）
- ✅ 小说详情页（**已实现**）
- ✅ 阅读页面（**已实现**，支持白天/黑夜模式切换）
- ✅ 图书馆/搜索页面（**已实现**，支持分类筛选和搜索）
- ✅ 页脚导航链接
- ✅ 移动端优化布局
- ✅ 无需登录，开放式阅读
- ✅ API接口统一管理
- ✅ 加载状态和错误处理
- ✅ 真实封面图片展示
- ✅ 字数格式化显示（万字/千字）
- ✅ SEO优化（动态设置页面标题和描述）
- ✅ 阅读体验优化（渐变遮罩、复制链接功能）

### 待开发

- ⬜ 排行榜页面（UI已完成，待接入数据）
- ⬜ 评论系统
- ⬜ 投稿功能
- ⬜ 分享功能增强

## 🔌 API 接入

项目已接入后端API，所有接口统一管理在 `src/api/index.js` 文件中。

### ✅ 已接入的接口

- **分类列表**: `GET /v1/category/list` - 获取所有分类
- **小说列表**: `GET /v1/book/list` - 获取小说列表（支持分页、分类筛选、搜索）
- **热门书籍**: `GET /v1/book/hot/list` - 获取热门书籍列表
- **小说详情**: `GET /v1/book/:id` - 获取小说详情和内容

### API 配置

API地址会根据环境自动切换：
- **开发环境**: `http://127.0.0.1:8090`（本地开发）
- **生产环境**: `https://api-manager.cffytech.com`（线上环境）

所有API调用都包含完整的错误处理和加载状态管理。

### 启动后端服务（开发环境）

确保后端服务运行在 `http://127.0.0.1:8090`，然后启动前端：

```bash
npm run dev
```

如果遇到跨域问题，可以在 `vite.config.js` 中配置代理。

## 💻 开发指南

### 添加新页面

1. 在 `src/pages` 目录下创建新的页面组件
2. 配置路由（使用 React Router）
3. 在导航菜单中添加对应链接

### 使用 Ant Design 组件

Ant Design 组件库已集成，可以直接导入使用：

```jsx
import { Button, Card, Typography } from 'antd';

function MyComponent() {
  return (
    <Card>
      <Typography.Title>标题</Typography.Title>
      <Button type="primary">按钮</Button>
    </Card>
  );
}
```

更多组件请参考 [Ant Design 官方文档](https://ant.design/components/overview-cn/)。

### 主题定制

在 `App.jsx` 中的 `ConfigProvider` 组件中可以自定义主题：

```jsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#667eea', // 主题色
      borderRadius: 8,         // 圆角
      // ... 更多配置
    },
  }}
>
  {/* 应用内容 */}
</ConfigProvider>
```

## 🎨 设计理念

- **开放自由** - 无需注册登录，让阅读回归纯粹
- **简洁优先** - 界面简洁，突出内容本身
- **阅读体验** - 优化排版和配色，提供舒适的阅读体验
- **快速加载** - 使用 Vite 确保快速的开发和构建体验
- **全平台支持** - 响应式设计，完美适配手机、平板、PC

## 📱 响应式适配

项目采用响应式设计，在不同设备上都有出色的体验：

- **PC端（>992px）**：完整导航栏 + 多列卡片布局
- **平板端（768px-992px）**：自适应导航 + 双列卡片布局  
- **手机端（<768px）**：折叠导航菜单 + 单列卡片布局

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**朝戈读书** - 每一个短篇，都是一段完整的旅程 ✨
