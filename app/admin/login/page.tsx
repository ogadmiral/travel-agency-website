import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import LoginForm from "./login-form"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
