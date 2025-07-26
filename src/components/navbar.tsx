"use client"

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
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
          <NavigationMenuLink className="hover:text-accent-foreground text-base">
            <Button variant="outline" disabled>
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
          <NavigationMenuItem>
            <NavigationMenuLink className="hover:text-accent-foreground text-base px-3">
              Welcome, {user.username}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button 
                variant="outline" 
                onClick={logout}
                className="cursor-pointer"
              >
                Logout
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </>
      )
    } else {
      // 未登录状态：显示登录和注册按钮
      return (
        <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/login" className="hover:text-accent-foreground text-base">
                <Button variant="outline">Log in</Button>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/signup" className="hover:text-accent-foreground text-base">
                <Button>Sign up</Button>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </>
      )
    }
  }

  return (
    <div className="w-full border-b px-6 pt-2.5 pb-1">
      <div className="flex items-baseline justify-between w-full">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="hover:text-accent-foreground">
                  <b className="text-3xl">HDBPilot</b>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/start" className="hover:text-accent-foreground text-base">
                  start
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
  