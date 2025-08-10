"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// 定义用户信息的类型
interface User {
  id: number
  username: string
  // 可以根据后端返回的数据添加更多字段
}

// 定义 AuthContext 的类型
interface AuthContextType {
  user: User | null          // 当前登录的用户信息，null 表示未登录
  loading: boolean           // 是否正在加载用户状态
  login: () => void         // 登录成功后调用，更新用户状态
  logout: () => void        // 登出函数
  checkAuth: () => void     // 检查当前登录状态
}

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider 组件：包装整个应用，提供用户状态
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)  // 初始状态为加载中
  const router = useRouter()

  // 检查当前登录状态的函数
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/current', {
        method: 'GET',
        credentials: 'include', // 重要：包含 cookie
      })
      
      const data = await response.json()
      
      if (data.code === 0) {
        // 登录状态有效，设置用户信息
        setUser(data.data)
      } else {
        // 未登录或登录已过期
        setUser(null)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setUser(null)
    } finally {
      setLoading(false)  // 无论成功失败，都结束加载状态
    }
  }

  // 登录成功后调用（在登录页面调用）
  const login = () => {
    checkAuth()  // 重新获取用户信息
  }

  // 登出函数
  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (data.data === true) {
        // 只有后端确认登出成功，才清除前端状态
        setUser(null)
        router.push('/')
      } else {
        console.error('登出失败:', data.message)
        // 可以显示错误提示给用户
      }
    } catch (error) {
      console.error('登出请求失败:', error)
      // 网络错误时，可以询问用户是否强制登出
    }
  }

  // 组件挂载时检查登录状态
  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定义 Hook：在组件中使用用户状态
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用')
  }
  return context
} 