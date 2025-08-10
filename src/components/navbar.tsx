"use client"

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const { user, loading, logout } = useAuth()

  // 渲染右侧按钮区域
  const renderAuthButtons = () => {//定义了一个名为renderAuthButton的函数
    if (loading) {
      // 加载中状态：显示占位内容，避免页面闪烁
      return (
        <NavigationMenuItem>
          <NavigationMenuLink className="hover:text-blue-400 text-base">
            <Button variant="outline" disabled className="border-gray-300 text-gray-500">
              加载中...
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      )
    }

    if (user) {
      // 已登录状态：显示用户名和登出按钮
      return (
        <>
          {/* <NavigationMenuItem>
            <NavigationMenuLink className="hover:text-blue-400 text-base px-3 text-gray-700">
              Welcome, {user.username}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button 
                variant="outline" 
                onClick={logout}
                className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Logout
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </>
      )
    } else {
      // 未登录状态：显示登录和注册按钮
      return (
        <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="hover:text-blue-600 text-base">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Log in</Button>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          
        </>
      )
    }
  }

  return (
    <div className="w-full border-b border-gray-200 bg-white px-6 pt-2.5 pb-1 shadow-sm">
      <div className="flex items-baseline justify-between w-full">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="hover:text-blue-600">
                  <b className="text-3xl font-bold text-gray-900">
                    HDB<span className="text-blue-600">Pilot</span>
                  </b>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

           

            
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            {renderAuthButtons()}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
  