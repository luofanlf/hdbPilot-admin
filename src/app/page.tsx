"use client"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { login } = useAuth()  // 获取 login 函数

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/admin/user/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password}),
        credentials: 'include'  // 重要：让浏览器保存 cookie
      })

      const data = await response.json()
      
      // 根据你的BaseResponse结构判断
      if (data.code === 0) {
        // 登录成功
        console.log("login success", data.data)
        
        // 调用 AuthContext 的 login 函数，更新全局用户状态
        login()
        
        // 跳转到首页
        router.push("/admin/users")
      } else {
        // 失败：code != 0
        setError(data.message || "登录失败")
      }
    } catch {
      setError("Network error")
    }
  }

  return (
    <div className="bg-gray-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <p className="text-3xl font-bold text-gray-900">
            HDB<span className="text-blue-600">Pilot</span>
          </p>
        </a>
        <LoginForm onLogin={handleLogin} error={error} />
      </div>
    </div>
  )
}
