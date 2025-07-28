module.exports = {
  apps: [
    {
      name: 'hdbpilot-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/hdbpilot-admin/current',
      instances: 'max', // 根据CPU核心数自动创建实例
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:8080' // 将会被nginx代理
      },
      error_file: '/var/www/hdbpilot-admin/shared/logs/error.log',
      out_file: '/var/www/hdbpilot-admin/shared/logs/out.log',
      log_file: '/var/www/hdbpilot-admin/shared/logs/combined.log',
      time: true,
      // 自动重启配置
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // 优雅停止
      kill_timeout: 5000,
      // 健康检查
      health_check_http: {
        url: 'http://localhost:3000',
        interval: 30000,
        timeout: 5000
      }
    }
  ]
} 