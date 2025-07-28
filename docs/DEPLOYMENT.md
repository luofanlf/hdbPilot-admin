# HDBPilot 管理后台部署指南

本文档详细说明如何在 EC2 服务器上配置自动化部署流程。

## 📋 部署架构

```
GitHub Repository
      ↓ (push触发)
GitHub Actions
      ↓ (SSH部署)
EC2 Server
├── Nginx (80/443端口) → 反向代理
├── Next.js App (3000端口) → 前端应用
└── Backend API (8080端口) → 后端服务
```

## 🛠 环境要求

### EC2 服务器要求
- **操作系统**: Ubuntu 20.04 LTS 或更高版本
- **实例类型**: 建议 t3.small 或更高
- **存储**: 至少 20GB EBS 存储
- **安全组配置**:
  - SSH (22端口): 您的IP地址
  - HTTP (80端口): 0.0.0.0/0
  - HTTPS (443端口): 0.0.0.0/0
  - 自定义TCP (8080端口): 内网访问

### 本地要求
- GitHub 账户和仓库
- SSH 密钥对

## 🚀 快速开始

### 步骤 1: 配置 EC2 服务器

1. **连接到 EC2 服务器**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **运行环境配置脚本**
```bash
# 下载配置脚本
wget https://raw.githubusercontent.com/your-repo/hdbpilot-admin/main/scripts/setup-ec2.sh
chmod +x setup-ec2.sh

# 运行配置脚本
./setup-ec2.sh
```

3. **配置完成后**，脚本会输出您的 EC2 公网IP，记录下来用于后续配置。

### 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets：

1. 进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**

2. 添加以下 Secrets：

| Secret Name | 描述 | 示例值 |
|-------------|------|--------|
| `EC2_HOST` | EC2 公网IP或域名 | `54.123.456.789` |
| `EC2_USER` | EC2 用户名 | `ubuntu` |
| `EC2_SSH_KEY` | SSH 私钥内容 | `-----BEGIN RSA PRIVATE KEY-----...` |
| `EC2_SSH_PORT` | SSH 端口 (可选) | `22` |

**获取 SSH 私钥内容：**
```bash
# 在本地查看私钥内容
cat ~/.ssh/your-key.pem

# 复制整个内容（包括 BEGIN 和 END 行）到 EC2_SSH_KEY
```

### 步骤 3: 配置 GitHub Actions 工作流

1. **更新工作流配置**
   
   编辑 `.github/workflows/deploy.yml`，修改以下配置：
   ```yaml
   env:
     NEXT_PUBLIC_API_URL: http://your-domain.com  # 替换为您的域名或IP
   ```

2. **推送代码触发部署**
   ```bash
   git add .
   git commit -m "feat: 配置CI/CD部署流程"
   git push origin main
   ```

## 📁 项目结构（服务器端）

部署后，EC2 服务器上的目录结构：

```
/var/www/hdbpilot-admin/
├── current/              # 当前版本的软链接
├── releases/             # 历史版本目录
│   ├── 20240101-120000/  # 版本目录（按时间戳）
│   └── 20240101-130000/
├── shared/               # 共享文件目录
└── backup-*/             # 备份目录
```

## 🔧 nginx 配置详解

### 配置文件位置
- 主配置: `/etc/nginx/sites-available/hdbpilot-admin`
- 启用配置: `/etc/nginx/sites-enabled/hdbpilot-admin`

### 关键配置说明

```nginx
# 前端应用代理 (Next.js 运行在 3000 端口)
location / {
    proxy_pass http://127.0.0.1:3000;
    # ... 其他代理设置
}

# API 代理到后端 (8080 端口)
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    # ... 其他代理设置
}
```

### 常用 nginx 命令
```bash
# 测试配置
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

## 🔄 PM2 进程管理

### 常用 PM2 命令
```bash
# 查看应用状态
pm2 status

# 查看应用日志
pm2 logs hdbpilot-admin

# 重启应用
pm2 restart hdbpilot-admin

# 停止应用
pm2 stop hdbpilot-admin

# 删除应用
pm2 delete hdbpilot-admin

# 保存 PM2 配置
pm2 save
```

### PM2 配置文件
位置: `ecosystem.config.js`

关键配置：
- **instances**: 'max' - 根据CPU核心数自动创建实例
- **exec_mode**: 'cluster' - 集群模式
- **max_memory_restart**: '1G' - 内存超限自动重启

## 🔍 故障排除

### 1. 部署失败
```bash
# 检查 GitHub Actions 日志
# 在 GitHub 仓库的 Actions 标签页查看详细日志

# 在服务器上检查
pm2 logs hdbpilot-admin --lines 50
sudo tail -f /var/log/nginx/error.log
```

### 2. 应用无法访问
```bash
# 检查服务状态
sudo systemctl status nginx
pm2 status

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080
```

### 3. 权限问题
```bash
# 检查文件权限
ls -la /var/www/hdbpilot-admin/

# 修复权限
sudo chown -R ubuntu:ubuntu /var/www/hdbpilot-admin/
```

### 4. SSL 配置（可选）
```bash
# 使用 Certbot 自动配置 SSL
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 监控和日志

### 应用日志位置
- **PM2 日志**: `/var/log/pm2/hdbpilot-admin.log`
- **Nginx 访问日志**: `/var/log/nginx/access.log`
- **Nginx 错误日志**: `/var/log/nginx/error.log`

### 监控脚本
```bash
#!/bin/bash
# 创建监控脚本 monitor.sh

echo "=== 系统状态 ==="
df -h
free -h

echo "=== 服务状态 ==="
sudo systemctl status nginx
pm2 status

echo "=== 最近错误日志 ==="
sudo tail -n 10 /var/log/nginx/error.log
pm2 logs hdbpilot-admin --lines 10
```

## 🔄 版本回滚

如果新版本出现问题，可以快速回滚到上一个版本：

```bash
# 查看可用版本
ls -la /var/www/hdbpilot-admin/releases/

# 回滚到指定版本
cd /var/www/hdbpilot-admin
ln -sfn releases/20240101-120000 current
pm2 restart hdbpilot-admin
```

## ⚡ 性能优化

### 1. nginx 缓存配置
```nginx
# 静态文件缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. PM2 集群优化
```javascript
// ecosystem.config.js
{
  instances: 'max',        // 使用所有CPU核心
  exec_mode: 'cluster',    // 集群模式
  max_memory_restart: '1G' // 内存限制
}
```

### 3. 系统级优化
```bash
# 增加文件描述符限制
echo "* soft nofile 65535" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65535" | sudo tee -a /etc/security/limits.conf
```

## 📚 相关文档

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [PM2 官方文档](https://pm2.keymetrics.io/docs/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 🆘 技术支持

如遇到问题，请：
1. 查看本文档的故障排除部分
2. 检查 GitHub Actions 部署日志
3. 联系开发团队

---

**部署愉快！** 🎉 