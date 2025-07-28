#!/bin/bash

# HDBPilot 管理后台 EC2 环境配置脚本
# 运行此脚本来配置 EC2 服务器环境

set -e  # 遇到错误立即退出

echo "🚀 开始配置 HDBPilot 管理后台 EC2 环境..."

# 更新系统
echo "📦 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装必要的系统包
echo "🔧 安装系统依赖..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# 安装 Node.js 18
echo "📦 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
echo "✅ Node.js 版本: $(node --version)"
echo "✅ NPM 版本: $(npm --version)"

# 安装 PM2
echo "🔄 安装 PM2..."
sudo npm install -g pm2

# 配置 PM2 开机自启
echo "⚙️ 配置 PM2 开机自启..."
pm2 startup
# 注意：这个命令会输出一个sudo命令，需要手动执行
echo "⚠️  请手动执行 PM2 输出的 sudo 命令来完成开机自启配置"

# 创建应用目录
echo "📁 创建应用目录..."
sudo mkdir -p /var/www/hdbpilot-admin/{releases,shared}
sudo chown -R $USER:$USER /var/www/hdbpilot-admin

# 创建日志目录
echo "📋 创建日志目录..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# 配置 nginx
echo "🌐 配置 Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default

# 创建 nginx 配置文件（如果不存在）
if [ ! -f /etc/nginx/sites-available/hdbpilot-admin ]; then
    echo "📄 创建 nginx 配置文件..."
    cat > /tmp/hdbpilot-admin.conf << 'EOF'
upstream frontend_backend {
    server 127.0.0.1:3000 fail_timeout=5s max_fails=3;
}

upstream api_backend {
    server 127.0.0.1:8080 fail_timeout=5s max_fails=3;
}

server {
    listen 80;
    server_name _;  # 接受所有域名，生产环境请替换为具体域名
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # API 代理到后端服务器 (8080端口)
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
        
        # 允许大文件上传
        client_max_body_size 10M;
    }
    
    # 前端应用代理
    location / {
        proxy_pass http://frontend_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 5s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # 健康检查端点
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

    sudo mv /tmp/hdbpilot-admin.conf /etc/nginx/sites-available/hdbpilot-admin
    sudo ln -sf /etc/nginx/sites-available/hdbpilot-admin /etc/nginx/sites-enabled/hdbpilot-admin
fi

# 测试 nginx 配置
echo "🧪 测试 nginx 配置..."
sudo nginx -t

# 启动并启用服务
echo "🔄 启动服务..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl enable ssh

# 配置防火墙（如果使用 ufw）
echo "🔒 配置防火墙..."
if command -v ufw >/dev/null 2>&1; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
fi

# 创建部署用户配置
echo "👤 配置部署用户..."
if [ ! -d ~/.ssh ]; then
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
fi

# 设置合适的权限
chmod 755 /home/$USER

echo "✅ EC2 环境配置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 在 GitHub 仓库中配置以下 Secrets:"
echo "   - EC2_HOST: 您的 EC2 公网 IP 或域名"
echo "   - EC2_USER: $USER"
echo "   - EC2_SSH_KEY: 您的 SSH 私钥内容"
echo "   - EC2_SSH_PORT: 22 (如果使用默认端口)"
echo ""
echo "2. 更新 GitHub Actions 工作流中的域名配置"
echo ""
echo "3. 确保您的后端服务正在 8080 端口运行"
echo ""
echo "4. 推送代码到 main 分支触发自动部署"
echo ""
echo "🌐 服务状态检查命令："
echo "   - Nginx: sudo systemctl status nginx"
echo "   - PM2 应用: pm2 status"
echo "   - 查看日志: pm2 logs hdbpilot-admin"
echo ""
echo "🔗 访问地址: http://$(curl -s ifconfig.me)" 