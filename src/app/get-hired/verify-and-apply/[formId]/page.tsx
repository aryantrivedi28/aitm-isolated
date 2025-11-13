"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function VerifyAndApplyPage() {
  const router = useRouter()
  const params = useParams()
  const formId = params.formId as string
  const [status, setStatus] = useState<"loading" | "success" | "needs-account">("loading")
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkAccount() {
      try {
        console.log("[v0] Starting account verification")

        const response = await fetch("/api/freelancer/check-account", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })

        console.log("[v0] Check account response status:", response.status)
        const data = await response.json()
        console.log("[v0] Check account response data:", data)

        if (!response.ok) {
          throw new Error(data.message || "Failed to check account")
        }

        if (data.accountExists) {
          console.log("[v0] Account exists, redirecting to form")
          setStatus("success")
          // Redirect to the application form
          setTimeout(() => {
            router.push(`/get-hired/freelancer/apply/${formId}`)
          }, 500)
        } else {
          console.log("[v0] Account does not exist, need to create account")
          setStatus("needs-account")
        }
      } catch (err) {
        console.log("[v0] Error checking account:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        setStatus("needs-account")
      }
    }

    checkAccount()
  }, [formId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-2">Verifying Account</h1>
            <p className="text-muted-foreground">Please wait while we verify your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-2 text-green-600">Account Verified!</h1>
            <p className="text-muted-foreground">Redirecting to application form...</p>
          </>
        )}

        {status === "needs-account" && (
          <>
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground mb-6">You need to create a freelancer account before applying.</p>
            <button
              onClick={() => router.push("/get-hired/freelancer/register")}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors mb-3"
            >
              Create Account
            </button>
            <button
              onClick={() => router.push("/get-hired/freelancer")}
              className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Sign In
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
