# HDBPilot 管理后台

## 项目介绍

HDBPilot 管理后台是一个基于 Next.js 15 开发的现代化 Web 应用程序，提供用户管理、认证授权等核心功能。项目采用 TypeScript 开发，使用 Tailwind CSS 进行样式设计，集成了 Radix UI 组件库，确保良好的用户体验和可访问性。

## 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架，支持 App Router
- **React 19** - 用户界面库
- **TypeScript 5** - 静态类型检查

### 样式和UI
- **Tailwind CSS 4** - 原子化CSS框架
- **shadcn/ui** - 基于 Radix UI 和 Tailwind CSS 的现代化组件库
- **Radix UI** - 无样式、可访问的UI组件库（shadcn/ui 底层依赖）
- **Lucide React** - 图标库
- **Class Variance Authority** - 条件类名管理

### 开发工具
- **ESLint 9** - 代码质量检查
- **Turbopack** - 快速构建工具
- **PostCSS** - CSS处理工具

## 项目结构

```
hdbPilot-admin/
├── public/                 # 静态资源文件
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/               # App Router 页面目录
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局组件
│   │   ├── page.tsx       # 首页
│   │   ├── login/         # 登录页面
│   │   ├── signup/        # 注册页面
│   │   └── start/         # 开始页面
│   ├── components/        # 可复用组件
│   │   ├── login-form.tsx # 登录表单
│   │   ├── signup-form.tsx# 注册表单
│   │   ├── navbar.tsx     # 导航栏
│   │   └── ui/            # 基础UI组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── navigation-menu.tsx
│   ├── contexts/          # React Context
│   │   └── AuthContext.tsx# 用户认证上下文
│   └── lib/               # 工具库
│       └── utils.ts       # 通用工具函数
├── components.json        # shadcn/ui 组件库配置
├── eslint.config.mjs      # ESLint 配置
├── next.config.ts         # Next.js 配置
├── package.json           # 项目依赖
├── postcss.config.mjs     # PostCSS 配置
├── tailwind.config.ts     # Tailwind CSS 配置
└── tsconfig.json          # TypeScript 配置
```

## 功能模块

### 用户认证系统
- **登录/注册** - 用户账户管理
- **身份验证** - JWT Token 验证
- **权限控制** - 基于角色的访问控制
- **会话管理** - 自动登录状态检查

### 核心功能
- **响应式设计** - 适配移动端和桌面端
- **导航系统** - 统一的导航栏组件
- **表单验证** - 客户端表单验证
- **错误处理** - 统一的错误处理机制

## 开始使用

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
npm run build
npm run start
```

### 代码检查

```bash
npm run lint
```

## 开发规范

### 代码风格

#### TypeScript 规范
- 使用 TypeScript 进行开发，避免使用 `any` 类型
- 为所有函数参数和返回值定义类型
- 使用 interface 定义对象类型，使用 type 定义联合类型

```typescript
// ✅ 推荐
interface User {
  id: number
  username: string
  email: string
}

const getUserById = async (id: number): Promise<User | null> => {
  // 实现逻辑
}

// ❌ 避免
const getUser = (id: any): any => {
  // 实现逻辑
}
```

#### React 组件规范
- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- 文件名使用 kebab-case
- 为所有 props 定义 TypeScript 接口
- 优先使用 shadcn/ui 组件，需要自定义UI时基于 shadcn/ui 进行扩展

```typescript
// ✅ 推荐 - 使用 shadcn/ui 组件
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserCardProps {
  user: {
    name: string
    email: string
  }
  onEdit: () => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{user.email}</p>
        <Button onClick={onEdit} variant="outline" className="mt-4">
          编辑用户
        </Button>
      </CardContent>
    </Card>
  )
}
```

#### 样式规范
- 优先使用 Tailwind CSS 原子类
- 避免内联样式，使用组件变体管理条件样式
- 使用响应式设计前缀 (sm:, md:, lg:, xl:)

```typescript
// ✅ 推荐
<div className="flex flex-col md:flex-row gap-4 p-6">
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
    提交
  </button>
</div>
```

### 文件组织

#### 组件结构
- 每个组件独立文件
- 复杂组件可以创建子目录
- 共享组件放在 `components/ui/` 目录

#### 命名约定
- 组件文件：`component-name.tsx`
- 页面文件：`page.tsx`
- 工具函数：`utils.ts`
- 类型定义：`types.ts`

### 状态管理

#### Context 使用
- 使用 React Context 管理全局状态
- 每个 Context 提供对应的自定义 Hook
- 避免在 Context 中存储过多状态

```typescript
// ✅ 推荐
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
}
```

### API 交互

#### 网络请求
- 使用 `fetch` 进行 API 调用
- 统一错误处理
- 包含适当的请求头和凭据

```typescript
// ✅ 推荐
const response = await fetch('/api/users', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

const data = await response.json()
```

### 代码提交

#### Git 规范
- 提交信息使用中文
- 遵循约定式提交格式：`类型: 描述`
- 常用类型：`feat`(新功能)、`fix`(修复)、`docs`(文档)、`style`(格式)、`refactor`(重构)

```bash
# ✅ 推荐
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复导航栏样式问题"
git commit -m "docs: 更新README文档"
```

## 部署说明

### 环境变量
创建 `.env.local` 文件配置环境变量：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 生产部署
推荐使用 Vercel 进行部署：

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

## 常见问题

### 网络请求失败
如果遇到 "Failed to fetch" 错误：
1. 确保后端服务正在运行（默认端口 8080）
2. 检查 CORS 配置
3. 验证 API 地址是否正确

### 样式不生效
1. 检查 Tailwind CSS 类名是否正确
2. 确保导入了全局样式文件
3. 清除浏览器缓存

**HDBPilot Team** ©2024
