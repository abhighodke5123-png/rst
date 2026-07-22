/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Mail, Lock, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

interface LoginProps {
  onBack: () => void;
  onSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  onNavigateToSignup: () => void;
}

export default function Login({ onBack, onSuccess, onNavigateToSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password Fields.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // Wait for Auth state listener in App to catch it
      // or we can invoke onSuccess with a mocked role until App.tsx syncs it
      onSuccess({
        id: userCred.user.uid,
        name: userCred.user.displayName || "User",
        email: userCred.user.email || "",
        role: "user", // Let App.tsx fetch role
      });
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      onSuccess({
        id: userCred.user.uid,
        name: userCred.user.displayName || "User",
        email: userCred.user.email || "",
        role: "user", // Let App.tsx fetch role
      });
    } catch (err: any) {
      setError(err.message || "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-200/10 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* Navigation top bar */}
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
            <LogIn className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-2xl font-extrabold text-black tracking-tight">Welcome Back</h2>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1.5 select-none">
            Secure Member Authentication
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
              <p className="font-bold">Access Denied</p>
              <p className="mt-0.5 text-zinc-600 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                Password
              </label>
            </div>
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
            className="w-full mt-2 bg-white hover:bg-yellow-500 hover:text-black text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In to Account
              </>
            )}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign in with Google
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-xs text-zinc-500 text-center mt-6">
          New to RAASTA?{" "}
          <button
            onClick={onNavigateToSignup}
            className="text-black hover:text-yellow-500 font-bold transition underline cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </motion.div>
    </div>
  );
}
