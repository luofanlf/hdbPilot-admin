"use client"
import { SignupForm } from "@/components/signup-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSignup = async (username: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password, confirmPassword}),
        credentials: 'include'  // 支持 cookie
      })

      const data = await response.json()
      if (data.code === 0) {
        console.log("Signup success", data.data)
        // 注册成功后跳转到登录页
        router.push("/")
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (error) {
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
        <SignupForm onSignup={handleSignup} error={error} onError={setError}/>
      </div>
    </div>
  )
}

