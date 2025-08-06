import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

export function LoginForm({
  className,
  onLogin,
  error, // 添加error prop
  ...props
}: React.ComponentProps<"div">&{
  onLogin?: (username: string, password: string) => Promise<void>
  error?: string // 添加这个类型
}) {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(onLogin){
      await onLogin(username,password)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-gray-900">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-gray-300 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-white text-gray-500 relative z-10 px-2">
                  Continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <Input
                    id="username"
                    type="text"  // 改为text
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
                    >
                      {/* Forgot your password? */}
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {error && (
                    <div className="text-sm text-red-600 mt-1">
                      {error}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 text-blue-600 hover:text-blue-700">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-gray-500 *:[a]:hover:text-blue-600 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#" className="text-blue-600">Terms of Service</Link>{" "}
        and <Link href="#" className="text-blue-600">Privacy Policy</Link>.
      </div>
    </div>
  )
}
