'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";

// 路由保护组件
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // 如果未登录，重定向到主页
      router.push('/');
    }
  }, [user, loading, router]);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果未登录，不渲染内容（会被重定向）
  if (!user) {
    return null;
  }

  // 如果已登录，渲染管理后台
  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div>
        {/* Fixed sidebar on the left with full height and fixed width */}
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white z-50">
          <Sidebar />
        </div>

        {/* Main content area with left margin to avoid overlap */}
        <main className="ml-64 p-6 bg-gray-50 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
