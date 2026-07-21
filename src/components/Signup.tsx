/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, ShieldAlert, ArrowLeft, Loader2, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SignupProps {
  onBack: () => void;
  onSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  onNavigateToLogin: () => void;
}

export default function Signup({ onBack, onSuccess, onNavigateToLogin }: SignupProps) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sandboxCode, setSandboxCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name || !email || !password) {
      setError("Please fill out all available fields.");
      return;
    }

    if (password.length < 5) {
      setError("For security, password must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setSandboxCode(data.sandboxOtpCode || null);
      setSuccessMsg("Security verification code dispatched to " + email);
      
      // Beautifully transition to OTP step
      setTimeout(() => {
        setSuccessMsg(null);
        setStep("otp");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification code generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otp) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      setSuccessMsg("Security verified successfully! Welcoming you in...");
      setTimeout(() => {
        onSuccess(data.user);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification code.");
      }

      setSandboxCode(data.sandboxOtpCode || null);
      setSuccessMsg("A fresh 6-digit security code has been sent!");
    } catch (err: any) {
      setError(err.message || "An error occurred during resending.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-zinc-200/10 rounded-full filter blur-[150px] pointer-events-none"></div>

      <div className="absolute top-8 left-6 sm:left-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-zinc-50 border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
            {step === "form" ? (
              <UserPlus className="w-5 h-5 text-black" />
            ) : (
              <KeyRound className="w-5 h-5 text-yellow-500 animate-pulse" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-black tracking-tight">
            {step === "form" ? "Create Account" : "OTP Verification"}
          </h2>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1.5 select-none">
            {step === "form" ? "Join the caravan of modern wanderers" : "Enter the security code to launch"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex gap-3 items-start"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <div>
              <p className="font-bold">Security Blocked</p>
              <p className="mt-0.5 text-zinc-650 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs flex gap-3 items-start animate-pulse"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <div>
              <p className="font-bold">Status Update</p>
              <p className="mt-0.5 text-zinc-450">{successMsg}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleRequestOtp}
              className="space-y-5"
            >
              {/* Full Name input */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Explorer Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Joe Wanderer"
                    className="w-full bg-white border border-zinc-200 focus:border-yellow-500/40 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-zinc-700 outline-none transition duration-250 font-sans"
                  />
                </div>
              </div>

              {/* Email input field */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border border-zinc-200 focus:border-yellow-500/40 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-zinc-700 outline-none transition duration-250 font-sans"
                  />
                </div>
              </div>

              {/* Password input field */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-zinc-200 focus:border-yellow-500/40 rounded-xl py-3 pl-11 pr-4 text-sm text-black placeholder-zinc-700 outline-none transition duration-250 font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-white hover:bg-yellow-500 hover:text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer text-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP Code...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Sign Up & Send OTP
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              {/* Dev Sandbox Helper Notification */}
              {sandboxCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl text-yellow-600 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-black">RAASTA Sandbox OTP Helper</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">
                    We have programmatically generated code <strong className="font-mono bg-white text-black px-1.5 py-0.5 rounded border border-yellow-500/30 text-xs">{sandboxCode}</strong>. You can copy-paste it directly to bypass SMTP check!
                  </p>
                </motion.div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2 text-center">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-white border border-zinc-200 focus:border-yellow-500/40 rounded-xl py-3 pl-11 pr-4 text-center text-lg font-bold font-mono tracking-[0.4em] text-black placeholder-zinc-300 outline-none transition duration-250"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 text-center mt-2">
                  A verification email was sent to <strong className="text-black">{email}</strong>.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="flex-1 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 cursor-pointer text-center"
                >
                  Change Email
                </button>

                <button
                  type="submit"
                  disabled={loading || !!successMsg}
                  className="flex-1 bg-black hover:bg-yellow-500 hover:text-black text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition duration-200 disabled:opacity-50 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-zinc-500">
                  Didn't receive the email?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-black hover:text-yellow-500 font-bold transition underline cursor-pointer disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-xs text-zinc-500 text-center mt-6">
          Already registered?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-black hover:text-yellow-500 font-bold transition underline cursor-pointer"
          >
            Sign in instead
          </button>
        </p>
      </motion.div>
    </div>
  );
}
