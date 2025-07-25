# 页面强制刷新器 Chrome 扩展

一个简单易用的Chrome浏览器扩展，用于强制刷新当前页面，清除缓存并重新加载页面内容。

## 功能特点

- 🔄 一键强制刷新当前页面
- 🗑️ 清除页面缓存
- ⚡ 简洁快速的操作界面
- 🎨 现代化的UI设计

## 安装方法

### 开发者模式安装

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的文件夹
6. 扩展将会安装并出现在扩展列表中

## 使用方法

1. 点击浏览器工具栏中的扩展图标
2. 在弹出的窗口中点击"强制刷新"按钮
3. 当前页面将会被强制刷新，清除缓存

## 文件结构

```
当前页面强制刷新器/
├── manifest.json    # 扩展配置文件
├── background.js    # 后台脚本
├── popup.html       # 弹出窗口HTML
├── popup.js         # 弹出窗口脚本
└── README.md        # 说明文档
```

## 技术说明

- **Manifest Version**: 3 (最新版本)
- **权限**: `activeTab` - 仅访问当前活动标签页
- **兼容性**: Chrome 88+

## 开发说明

### 主要功能实现

- 使用 `chrome.tabs.reload()` API 实现页面刷新
- 通过 `bypassCache: true` 参数强制清除缓存
- 采用现代化的扩展架构（Manifest V3）

### 自定义修改

如需修改扩展功能，可以编辑以下文件：
- `popup.html` - 修改界面布局
- `popup.js` - 修改前端逻辑
- `background.js` - 修改后台功能

## 许可证

本项目采用 MIT 许可证。

## 作者

chenwenkun

## 更新日志

### v1.0.0
- 初始版本发布
- 实现基本的页面强制刷新功能
- 现代化UI设计 