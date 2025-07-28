module.exports = {
  apps: [
    {
      name: 'hdbpilot-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/hdbpilot-admin/current',
      instances: 1, // t3.medium可以考虑2个实例，但先用1个稳定运行
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '800M', // 适合t2.micro的内存限制
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:8080'
      },
      error_file: '/var/www/hdbpilot-admin/shared/logs/error.log',
      out_file: '/var/www/hdbpilot-admin/shared/logs/out.log',
      log_file: '/var/www/hdbpilot-admin/shared/logs/combined.log',
      time: true,
      autorestart: true,
      max_restarts: 5, // 减少重启次数
      min_uptime: '10s'
    }
  ]
} 