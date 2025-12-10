"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, ArrowRight, ArrowLeft, Briefcase, AlertCircle, LogIn, UserPlus } from "lucide-react"

export default function FreelancerPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/freelancer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send OTP")
        return
      }

      setIsNewUser(data.isNewUser)
      setStep("otp")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/freelancer/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to verify OTP")
        return
      }

      // ✅ Redirect user according to profile completion
      if (data.redirectTo === "/get-hired/freelancer/onboarding") {
        // User is new or incomplete profile
        window.location.href = data.redirectTo
      } else {
        // User already completed profile
        window.location.href = data.redirectTo
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Button hover handler
  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1.03)'
    target.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
    target.style.boxShadow = '0 4px 12px rgba(36, 28, 21, 0.1)'
  }

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget
    target.style.transform = 'scale(1)'
    target.style.boxShadow = '0 2px 6px rgba(36, 28, 21, 0.05)'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#faf4e5' }}>
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-4" style={{ backgroundColor: '#f7af00' }}>
            <Briefcase className="h-10 w-10" style={{ color: '#050504' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#050504' }}>
            Freelancer Portal
          </h1>
          <p className="text-sm" style={{ color: '#31302f' }}>
            Access your freelance opportunities
          </p>
        </div>

        <Card className="border shadow-sm rounded-xl" style={{ backgroundColor: '#faf4e5', borderColor: '#241C15' }}>
          <CardHeader className="space-y-3 border-b pb-6" style={{ borderBottomColor: '#f7af00' }}>
            <div className="flex items-center justify-center space-x-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#f0eadd' }}>
                {step === "email" ? (
                  <Mail className="h-5 w-5" style={{ color: '#f7af00' }} />
                ) : (
                  <Lock className="h-5 w-5" style={{ color: '#f7af00' }} />
                )}
              </div>
              <CardTitle className="text-2xl font-bold" style={{ color: '#050504' }}>
                {step === "email" ? "Sign In" : "Verify OTP"}
              </CardTitle>
            </div>
            <CardDescription className="text-center text-base" style={{ color: '#31302f' }}>
              {step === "email" 
                ? "Enter your email to receive a one-time password" 
                : `We sent a 6-digit code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {error && (
              <div className="mb-6 p-4 rounded-lg border flex items-start space-x-3" style={{ backgroundColor: '#f0eadd', borderColor: '#241C15' }}>
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#241C15' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#31302f' }}>Error</p>
                  <p className="text-sm" style={{ color: '#31302f' }}>{error}</p>
                </div>
              </div>
            )}

            {step === "email" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#31302f' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Mail className="h-5 w-5" style={{ color: '#31302f' }} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all disabled:opacity-50"
                      style={{ 
                        borderColor: '#241C15', 
                        color: '#31302f',
                        backgroundColor: '#f0eadd'
                      }}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                  className="w-full text-base font-semibold py-3 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 rounded-lg"
                  style={{ 
                    backgroundColor: '#f7af00', 
                    color: '#050504',
                    boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                  }}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <span>{loading ? "Sending..." : "Send OTP"}</span>
                  {!loading && <ArrowRight className="h-5 w-5" />}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: '#31302f' }}>
                    One-Time Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Lock className="h-5 w-5" style={{ color: '#31302f' }} />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all disabled:opacity-50 text-center text-2xl font-bold tracking-widest"
                      style={{ 
                        borderColor: '#241C15', 
                        color: '#31302f',
                        backgroundColor: '#f0eadd',
                        letterSpacing: '0.5em'
                      }}
                    />
                  </div>
                  <p className="text-xs text-center" style={{ color: '#31302f' }}>
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full text-base font-semibold py-3 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 rounded-lg"
                    style={{ 
                      backgroundColor: '#f7af00', 
                      color: '#050504',
                      boxShadow: "0 2px 6px rgba(36, 28, 21, 0.05)"
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      setStep("email")
                      setOtp("")
                      setError("")
                    }}
                    disabled={loading}
                    className="w-full text-base font-semibold py-3 flex items-center justify-center space-x-2 transition-all duration-200 rounded-lg disabled:opacity-50"
                    style={{ 
                      borderColor: '#241C15', 
                      color: '#31302f',
                      backgroundColor: 'transparent',
                      border: '1px solid #241C15'
                    }}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Email</span>
                  </Button>
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-sm font-medium transition-colors disabled:opacity-50 hover:underline"
                    style={{ color: '#241C15' }}
                  >
                    Didn't receive the code? Resend OTP
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Already Registered Link */}
        {step === "email" && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 p-4 rounded-lg border" style={{ backgroundColor: '#faf4e5', borderColor: '#f7af00' }}>
              <UserPlus className="h-5 w-5" style={{ color: '#f7af00' }} />
              <p className="text-sm" style={{ color: '#31302f' }}>
                <span>Already have an account? </span>
                <span className="font-medium">Just enter your email above to login</span>
              </p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs" style={{ color: '#31302f' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <a href="#" className="hover:underline font-medium" style={{ color: '#31302f' }}>
              Help Center
            </a>
            <span style={{ color: '#31302f' }}>•</span>
            <a href="#" className="hover:underline font-medium" style={{ color: '#31302f' }}>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}