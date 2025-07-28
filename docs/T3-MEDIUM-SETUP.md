# t3.medium 实例配置指南

## 🎯 概述

这份指南将帮助您在全新的 t3.medium EC2 实例上配置 HDBPilot 管理后台的完整运行环境。

## 💻 t3.medium 规格

- **CPU**: 2 vCPU (可突发至基准性能的 20%)
- **内存**: 4 GB RAM
- **网络**: 中等性能，支持增强联网
- **存储**: EBS优化
- **适合**: 多服务应用，中等负载

## 🚀 完整配置步骤

### 步骤1: 连接到新实例

```bash
# 使用您的新密钥连接
ssh -i your-new-key.pem ubuntu@your-new-ec2-ip

# 验证实例类型
curl -s http://169.254.169.254/latest/meta-data/instance-type
# 应该显示: t3.medium
```

### 步骤2: 运行环境配置脚本

```bash
# 克隆或下载项目（如果还没有）
git clone https://github.com/your-username/hdbpilot-admin.git
cd hdbpilot-admin

# 运行环境配置脚本
chmod +x scripts/setup-ec2.sh
./scripts/setup-ec2.sh
```

**脚本将自动完成:**
- ✅ 系统更新和基础软件安装
- ✅ Node.js 18 和 PM2 安装
- ✅ Nginx 配置
- ✅ 系统参数优化（针对 t3.medium）
- ✅ 交换文件配置
- ✅ 文件描述符限制优化

### 步骤3: 配置 GitHub Secrets

在 GitHub 仓库中更新以下 Secrets：

| Secret Name | 新值 | 说明 |
|-------------|------|------|
| `EC2_HOST` | 新实例的公网IP | 例如: `54.123.456.789` |
| `EC2_USER` | `ubuntu` | 保持不变 |
| `EC2_SSH_KEY` | 新的SSH私钥内容 | 完整的私钥内容 |

**获取新私钥内容:**
```bash
# 在本地执行
cat your-new-key.pem
# 复制整个输出内容到 EC2_SSH_KEY
```

### 步骤4: 启动后端服务

在启动前端之前，确保您的后端服务正在运行：

#### Java 后端 (示例)
```bash
# 启动 Spring Boot 应用
nohup java -Xmx1200m -jar your-backend.jar > backend.log 2>&1 &

# 验证端口
netstat -tlnp | grep :8080
```

#### Python ML 模型 (示例)
```bash
# 启动 ML 服务
nohup python -u ml_server.py > ml.log 2>&1 &

# 验证服务
curl http://localhost:your-ml-port/health
```

#### 数据库服务
```bash
# 启动 MySQL (如果使用)
sudo systemctl start mysql
sudo systemctl enable mysql

# 或启动 PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 步骤5: 部署前端应用

```bash
# 推送代码触发部署
git add .
git commit -m "配置新的t3.medium实例"
git push origin main
```

### 步骤6: 验证部署

#### 检查服务状态
```bash
# 系统资源
free -h
top -bn1 | head -10

# PM2 状态
pm2 status

# Nginx 状态
sudo systemctl status nginx

# 端口监听
sudo netstat -tlnp | grep -E ':80|:3000|:8080'
```

#### 测试访问
```bash
# 本地测试
curl http://localhost:3000

# 外部访问
curl http://your-ec2-ip
```

## 🔧 服务管理命令

### PM2 管理
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs hdbpilot-admin

# 重启应用
pm2 restart hdbpilot-admin

# 监控
pm2 monit
```

### Nginx 管理
```bash
# 重新加载配置
sudo systemctl reload nginx

# 测试配置
sudo nginx -t

# 查看日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 系统监控
```bash
# 内存使用
free -h

# CPU 使用
htop

# 磁盘使用
df -h

# 最占资源的进程
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
```

## 🎯 性能优化建议

### 针对您的应用栈

1. **资源分配建议** (总计 4GB RAM):
   - Next.js 前端: 1GB
   - 后端 API: 1.2GB  
   - ML 模型: 1.5GB
   - 数据库: 600MB
   - 系统: 400MB

2. **启动顺序建议**:
   ```bash
   # 1. 先启动数据库
   sudo systemctl start mysql
   
   # 2. 等待2-3秒，启动后端
   java -jar backend.jar &
   
   # 3. 等待后端启动，再启动ML服务
   python ml_server.py &
   
   # 4. 最后部署前端
   git push origin main
   ```

3. **JVM 参数优化** (Java后端):
   ```bash
   java -Xms800m -Xmx1200m -XX:+UseG1GC your-backend.jar
   ```

4. **Python 内存优化** (ML模型):
   ```python
   # 在代码中限制内存使用
   import resource
   resource.setrlimit(resource.RLIMIT_AS, (1500*1024*1024, -1))  # 1.5GB
   ```

## 🚨 故障排除

### 常见问题

1. **内存不足**
   ```bash
   # 检查内存使用
   free -h
   
   # 清理缓存
   sudo sync && sudo sysctl vm.drop_caches=3
   ```

2. **CPU 过载**
   ```bash
   # 查看CPU占用
   top -bn1 | head -20
   
   # 限制进程CPU使用
   cpulimit -l 50 -p PID
   ```

3. **端口冲突**
   ```bash
   # 查看端口占用
   sudo netstat -tlnp | grep :PORT
   
   # 杀死占用进程
   sudo kill -9 PID
   ```

## 📊 监控和告警

### 设置基本监控
```bash
# 创建监控脚本
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== $(date) ==="
echo "Memory: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
echo "Services:"
pm2 status --no-colors
sudo systemctl is-active nginx mysql
echo "==================="
EOF

chmod +x monitor.sh

# 设置定时监控
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/hdbpilot-admin/monitor.sh >> /tmp/monitor.log") | crontab -
```

## ✅ 完成检查清单

- [ ] EC2 实例是 t3.medium
- [ ] 环境配置脚本运行成功
- [ ] GitHub Secrets 已更新
- [ ] 后端服务在 8080 端口运行
- [ ] ML 模型服务正常
- [ ] 数据库服务启动
- [ ] 前端部署成功
- [ ] Nginx 代理正常工作
- [ ] 所有端口监听正确
- [ ] 系统资源使用合理 (<80% 内存和CPU)

## 🎉 恭喜！

您的 t3.medium 实例现在已经完全配置好了，可以稳定运行您的完整应用栈！

**下一步**: 考虑设置域名、SSL证书和CDN来进一步优化用户体验。 