"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function SignupForm({
  className,
  onSignup,
  error,
  onError,
  ...props
}: {
  className?: string
  onSignup?: (username:string,password:string,confirmPassword:string) => Promise<void>
  error?: string
  onError?: (error: string) => void
} & Omit<React.ComponentProps<"div">, 'onError'>) {
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 校验密码是否一致
    if (password !== confirmPassword) {
      if (onError) {
        onError("password and confirm password do not match")
      }
      return // 停止提交
    }
    
    // 清空错误信息
    if (onError) {
      onError("")
    }
    
    if(onSignup){
      await onSignup(username,password,confirmPassword)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          {/* <CardDescription>
            Login with your Apple or Google account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                    </a>
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">ConfirmPassword</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                    </a>
                  </div>
                  <Input id="confirmPassword" type="password" value={confirmPassword} 
                  onChange={(e)=>setConfirmPassword(e.target.value)} required />
                  {error && (
                    <div className="text-sm text-red-600 mt-1">
                      {error}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
