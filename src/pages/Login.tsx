import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, KeyRound, Loader2, Repeat, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/lib/constants";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/features/authSlice/authSlice";


type LoginResponse = {
  access_token?: string
  user_name?: string
  authority?: string
  authority_id?: string | number
  email?: string
  // ...other fields your API may return
}

type ApiError = { message?: string } | string

const credentialsSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

const otpSchema = z.object({
  otp: z.string().min(4, "Enter the code sent to you"),
})

const resetStartSchema = z.object({
  email: z.string().min(1, "Email is required"),
})

const resetFinishSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type Phase = "credentials" | "otp" | "resetOtp" | "resetPassword"

export default function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = React.useState(false)
  const [phase, setPhase] = React.useState<Phase>("credentials")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isForgotFlow, setIsForgotFlow] = React.useState(false)
  const [username, setUsername] = React.useState("")
  const dispatch = useAppDispatch()
  const [info, setInfo] = React.useState<string | null>(null)

  // Forms
  const credentialsForm = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  })

  const loginOtpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  })

  const resetStartForm = useForm<z.infer<typeof resetStartSchema>>({
    resolver: zodResolver(resetStartSchema),
    defaultValues: { email: "" },
  })

  const resetFinishForm = useForm<z.infer<typeof resetFinishSchema>>({
    resolver: zodResolver(resetFinishSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  // Helpers
  function setFieldError(field: "email" | "password", message: string) {
    credentialsForm.setError(field, { type: "validate", message })
  }

  function parseAndMapLoginErrors(error: unknown) {
    const axiosError = error as AxiosError<ApiError>
    const data = axiosError.response?.data

    if (typeof data === "object" && data && "message" in data) {
      if ((data as any).message === "Username Not Found") {
        setFieldError("email", "User not found")
        credentialsForm.setFocus("email")
        return
      }
    }
    if (data === "Account is Locked") {
      setFieldError("email", "Account locked")
      credentialsForm.setFocus("email")
      return
    }
    if (data === "Password is Invalid") {
      credentialsForm.setError("password", {
        type: "validate",
        message: "Incorrect Password",
      })
      credentialsForm.setFocus("password")
      return
    }

    setInfo("Something went wrong. Please try again.")
  }

  async function handleGenerateOtp(targetUsername: string) {
    await axios.post(`${BASE_URL}API/Generate/OTP`, {
      username: targetUsername,
    })
  }

  // Credentials submit → Login/Check → if ok then Generate OTP → go to OTP step
  async function onSubmitCredentials(values: z.infer<typeof credentialsSchema>) {
    setInfo(null)
    setIsSubmitting(true)
    try {
      const res = await axios.post<LoginResponse>(`${BASE_URL}API/Login/Check`, {
        username: values.email,
        password: values.password,
      })

      // Save username across steps
      setUsername(values.email)


      // Trigger OTP for login 2FA
      await handleGenerateOtp(values.email)
      setPhase("otp")
      setInfo("We sent a verification code. Please check your email/SMS.")
    } catch (err) {
      parseAndMapLoginErrors(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Login OTP verification → if ok, persist token and navigate
  async function onSubmitLoginOtp(values: z.infer<typeof otpSchema>) {
    setInfo(null)
    setIsSubmitting(true)
    try {
      const res = await axios.post(`${BASE_URL}API/Login/Two/Step/Verification/Check`, {
        username,
        otp: values.otp,
      })
      localStorage.setItem("token", res.data.access_token)
      dispatch(
        setAuth({
          username: res.data.user_name,
          role: `${res.data.authority}`,
          roleId: `${res.data.authority_id}`,
          email: res.data.email,
        }),
      )
      navigate("/")
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      const data = axiosError.response?.data
      if (typeof data === "object" && (data as any)?.message) {
        setInfo((data as any).message as string)
      } else {
        setInfo("Invalid or expired code. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Forgot password: start → Generate OTP for given email
  async function onSubmitResetStart(values: z.infer<typeof resetStartSchema>) {
    setInfo(null)
    setIsSubmitting(true)
    try {
      await handleGenerateOtp(values.email)
      setUsername(values.email) // carry forward
      setPhase("resetOtp")
      setInfo("We sent a verification code for password reset.")
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>
      const data = axiosError.response?.data
      if (typeof data === "object" && (data as any)?.message === "Username Not Found") {
        resetStartForm.setError("email", { type: "validate", message: "User not found" })
      } else {
        setInfo("Unable to send code. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Forgot password: verify OTP → go to reset password fields
  async function onSubmitResetOtp(values: z.infer<typeof otpSchema>) {
    setInfo(null)
    setIsSubmitting(true)
    try {
      await axios.post(`${BASE_URL}API/Login/Two/Step/Verification/Check`, {
        username,
        otp: values.otp,
      })
      setPhase("resetPassword")
      setInfo("Code verified. Please set a new password.")
    } catch (err) {
      setInfo("Invalid or expired code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Forgot password: change password
  async function onSubmitResetFinish(values: z.infer<typeof resetFinishSchema>) {
    setInfo(null)
    setIsSubmitting(true)
    try {
      await axios.post(`${BASE_URL}API/Password/Change`, {
        username,
        password: values.newPassword,
      })
      setInfo("Password updated. You can login with your new password.")
      // Reset all forms and return to login
      credentialsForm.reset()
      loginOtpForm.reset()
      resetStartForm.reset()
      resetFinishForm.reset()
      setIsForgotFlow(false)
      setPhase("credentials")
    } catch (err) {
      setInfo("Could not update password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function resendCode() {
    setInfo(null)
    setIsSubmitting(true)
    try {
      await handleGenerateOtp(username)
      setInfo("We resent the verification code.")
    } catch {
      setInfo("Unable to resend code. Please wait and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function switchToForgot() {
    setInfo(null)
    setIsForgotFlow(true)
    setPhase("credentials") // we'll show email-only via resetStart form UI
    // Copy email from login form if present
    const email = credentialsForm.getValues("email")
    resetStartForm.setValue("email", email || "")
  }

  function switchToLogin() {
    setInfo(null)
    setIsForgotFlow(false)
    setPhase("credentials")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border-0">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          {/* Left side - Form */}
          <div className="p-12 flex flex-col ">
            {/* Logo */}
            <div className="mb-12 items-start">
              <img src="/oka.png" alt="l&k" className="h-12 w-auto " />
            </div>

            {/* Form */}
            <div className="space-y-8 items-center">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                <h1 className="text-xl font-semibold text-foreground text-balance">
                  {isForgotFlow ? "Reset your password" : "Sign in to your account"}
                </h1>
              </div>

              {!isForgotFlow && phase === "credentials" && (
                <Form {...credentialsForm}>
                  <form onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)} className="grid gap-5">
                    <FormField
                      control={credentialsForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" autoComplete="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={credentialsForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <button
                              type="button"
                              className="text-sm text-primary underline underline-offset-4"
                              onClick={switchToForgot}
                              aria-label="Forgot password"
                            >
                              Forgot password?
                            </button>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show zpassword"}
                              >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {info && <p className="text-sm text-muted-foreground">{info}</p>}

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#066dc4] hover:bg-[#0557a0]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {!isForgotFlow && phase === "otp" && (
                <Form {...loginOtpForm}>
                  <form onSubmit={loginOtpForm.handleSubmit(onSubmitLoginOtp)} className="grid gap-5">
                    <div>
                      <FormLabel className="sr-only">One-time code</FormLabel>
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter the code sent to {username || "your email"} to complete sign in.
                      </p>
                      <FormField
                        control={loginOtpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input inputMode="numeric" placeholder="Enter your code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {info && <p className="text-sm text-muted-foreground">{info}</p>}

                    <div className="flex items-center justify-between gap-3">
                      <Button type="button" variant="secondary" onClick={resendCode} disabled={isSubmitting}>
                        <Repeat className="size-4 mr-2" />
                        Resend code
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>

                    <button
                      type="button"
                      className="text-sm text-primary underline underline-offset-4 justify-self-start"
                      onClick={switchToLogin}
                    >
                      Back to login
                    </button>
                  </form>
                </Form>
              )}

              {isForgotFlow && phase === "credentials" && (
                <Form {...resetStartForm}>
                  <form onSubmit={resetStartForm.handleSubmit(onSubmitResetStart)} className="grid gap-5">
                    <FormField
                      control={resetStartForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or Username</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" autoComplete="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {info && <p className="text-sm text-muted-foreground">{info}</p>}

                    <div className="flex items-center justify-between gap-3">
                      <Button type="button" variant="secondary" onClick={switchToLogin}>
                        Back to login
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Sending code...
                          </>
                        ) : (
                          "Send reset code"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {isForgotFlow && phase === "resetOtp" && (
                <Form {...loginOtpForm}>
                  <form onSubmit={loginOtpForm.handleSubmit(onSubmitResetOtp)} className="grid gap-5">
                    <div>
                      <FormLabel className="sr-only">Reset code</FormLabel>
                      <p className="text-sm text-muted-foreground mb-2">
                        Enter the code sent to {username || "your email"} to continue.
                      </p>
                      <FormField
                        control={loginOtpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input inputMode="numeric" placeholder="Enter your code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {info && <p className="text-sm text-muted-foreground">{info}</p>}

                    <div className="flex items-center justify-between gap-3">
                      <Button type="button" variant="secondary" onClick={resendCode} disabled={isSubmitting}>
                        <Repeat className="size-4 mr-2" />
                        Resend code
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>

                    <button
                      type="button"
                      className="text-sm text-primary underline underline-offset-4 justify-self-start"
                      onClick={switchToLogin}
                    >
                      Back to login
                    </button>
                  </form>
                </Form>
              )}

              {isForgotFlow && phase === "resetPassword" && (
                <Form {...resetFinishForm}>
                  <form onSubmit={resetFinishForm.handleSubmit(onSubmitResetFinish)} className="grid gap-5">
                    <div className="flex items-center gap-2">
                      <KeyRound className="size-4 text-primary" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">Set a new password for {username}</p>
                    </div>

                    <FormField
                      control={resetFinishForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="New password" autoComplete="new-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={resetFinishForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm password" autoComplete="new-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {info && <p className="text-sm text-muted-foreground">{info}</p>}

                    <div className="flex items-center justify-between gap-3">
                      <Button type="button" variant="secondary" onClick={switchToLogin}>
                        Back to login
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#066dc4] hover:bg-[#0557a0]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update password"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>

          {/* Right side - Image with overlays */}
          <div className="relative overflow-hidden p-3">
            <img
              src="https://www.owlguru.com/wp-content/uploads/wpallimport/files/electrical-engineers/__(1).jpg"
              alt="Login Background"
              className="w-full h-full object-cover mr-4 rounded-3xl shadow-lg"
            />

            {/* Floating UI elements */}
            <div className="absolute top-8 left-8">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#066dc4] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
