#!/bin/bash

# 手动部署脚本 - 当自动化部署失败时使用
set -e

echo "🚀 开始手动部署 HDBPilot 管理后台..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 设置变量
APP_DIR="/var/www/hdbpilot-admin"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RELEASE_DIR="$APP_DIR/releases/manual-$TIMESTAMP"

echo "📦 构建项目..."
# 安装依赖
npm ci

# 构建项目
npm run build

echo "📁 准备部署目录..."
# 创建部署目录
ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "mkdir -p $APP_DIR/releases"

echo "📤 上传文件到服务器..."
# 创建临时部署包
tar -czf deploy-manual.tar.gz .next public package.json package-lock.json next.config.ts ecosystem.config.js

# 上传到服务器
scp -o StrictHostKeyChecking=no deploy-manual.tar.gz ubuntu@$EC2_HOST:$APP_DIR/

echo "🔧 在服务器上部署..."
# 在服务器上执行部署
ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST << EOF
cd $APP_DIR

# 创建版本目录
mkdir -p $RELEASE_DIR

# 解压文件
cd $RELEASE_DIR
tar -xzf ../deploy-manual.tar.gz

# 重新生成package-lock.json（如果需要）
if [ ! -f "package-lock.json" ] || ! npm ci --dry-run 2>/dev/null; then
    echo "重新生成package-lock.json..."
    rm -f package-lock.json
    npm install --package-lock-only
fi

# 安装生产依赖
npm install --only=production

# 返回应用目录
cd $APP_DIR

# 更新当前版本链接
ln -sfn $RELEASE_DIR current

# 重启PM2
pm2 stop hdbpilot-admin 2>/dev/null || true
pm2 delete hdbpilot-admin 2>/dev/null || true
pm2 start current/ecosystem.config.js
pm2 save

# 重新加载nginx
sudo nginx -t && sudo systemctl reload nginx

# 清理
rm -f deploy-manual.tar.gz

echo "✅ 手动部署完成！"
EOF

# 清理本地文件
rm -f deploy-manual.tar.gz

echo "🎉 部署成功！"
echo "🔗 访问地址: http://$EC2_HOST"

# 检查部署状态
echo "📊 检查服务状态..."
ssh ubuntu@$EC2_HOST "pm2 status && curl -s http://localhost:3000 >/dev/null && echo '✅ 前端服务正常' || echo '❌ 前端服务异常'" 