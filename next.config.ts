import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 开发环境API代理配置
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8080/api/:path*'  // 开发环境代理到后端
          : '/api/:path*'  // 生产环境使用nginx代理
      }
    ];
  }
};

export default nextConfig;
