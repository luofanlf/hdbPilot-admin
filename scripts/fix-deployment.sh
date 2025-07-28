#!/bin/bash

# 紧急修复部署问题脚本
set -e

echo "🔧 开始修复 HDBPilot 部署问题..."

# 切换到应用目录
cd /var/www/hdbpilot-admin

echo "📁 检查并创建目录结构..."
# 确保目录结构正确
mkdir -p releases shared
sudo chown -R $USER:$USER /var/www/hdbpilot-admin

# 如果有部署文件，尝试重新部署
if [ -f "deploy.tar.gz" ]; then
    echo "📦 发现部署文件，开始重新部署..."
    
    # 创建新版本目录
    RELEASE_DIR="releases/manual-fix-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $RELEASE_DIR
    
    # 解压文件
    echo "📂 解压部署文件..."
    tar -xzf deploy.tar.gz -C $RELEASE_DIR
    
    # 进入版本目录
    cd $RELEASE_DIR
    
    # 检查是否有package-lock.json
    if [ ! -f "package-lock.json" ]; then
        echo "⚠️  缺少 package-lock.json，创建新的..."
        npm install --package-lock-only
    fi
    
    # 安装依赖
    echo "📦 安装生产依赖..."
    npm ci --omit=dev
    
    # 返回应用根目录
    cd /var/www/hdbpilot-admin
    
    # 更新当前版本链接
    echo "🔗 更新当前版本链接..."
    ln -sfn $RELEASE_DIR current
    
    # 停止旧的PM2进程
    echo "🛑 停止旧的PM2进程..."
    pm2 stop hdbpilot-admin 2>/dev/null || true
    pm2 delete hdbpilot-admin 2>/dev/null || true
    
    # 启动新的PM2应用
    echo "🚀 启动PM2应用..."
    pm2 start current/ecosystem.config.js
    pm2 save
    
    echo "✅ 部署修复完成！"
else
    echo "❌ 未找到部署文件 deploy.tar.gz"
    echo "请先从GitHub Actions重新部署，或手动上传部署文件"
fi

# 检查nginx配置
echo "🌐 检查nginx配置..."
if sudo nginx -t; then
    echo "✅ Nginx配置正确"
    sudo systemctl reload nginx
else
    echo "❌ Nginx配置有误，请检查配置文件"
fi

# 显示服务状态
echo ""
echo "📊 当前服务状态："
echo "=== PM2 状态 ==="
pm2 status
echo ""
echo "=== Nginx 状态 ==="
sudo systemctl status nginx --no-pager -l
echo ""
echo "=== 端口占用情况 ==="
sudo netstat -tlnp | grep -E ':80|:3000|:8080'

echo ""
echo "🔍 故障排除："
echo "1. 检查PM2日志: pm2 logs hdbpilot-admin"
echo "2. 检查Nginx日志: sudo tail -f /var/log/nginx/error.log"
echo "3. 检查应用是否响应: curl http://localhost:3000"
echo "4. 检查后端服务: curl http://localhost:8080/api/health"

echo ""
echo "✅ 修复脚本执行完成！" 