/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Mail, Lock, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
      setError("Please fill in both login identity and password.");
      return;
    }

    setLoading(true);
    try {
      let cleanEmail = email.trim();
      // Normalize admin shorthand credentials
      if (cleanEmail.toLowerCase() === "raastatrips@admin" || cleanEmail.toLowerCase() === "admin") {
        cleanEmail = "raastatrips@admin.com";
      }

      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      let role = "user";
      try {
        const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
        if (userDoc.exists() && userDoc.data().role) {
          role = userDoc.data().role;
        } else if (cleanEmail.includes("admin")) {
          role = "admin";
        }
      } catch {
        if (cleanEmail.includes("admin")) role = "admin";
      }

      onSuccess({
        id: userCred.user.uid,
        name: userCred.user.displayName || "Admin",
        email: userCred.user.email || cleanEmail,
        role,
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
    <div className="min-h-screen bg-[#07080a] text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full filter blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[160px] pointer-events-none"></div>

      {/* Navigation top bar */}
      <div className="absolute top-8 left-6 sm:left-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-amber-400 transition duration-200 cursor-pointer font-display"
        >
          <ArrowLeft className="w-4 h-4" />
          Back To Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0b0c10] border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400 shadow-lg">
            <LogIn className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">Welcome Back</h2>
          <p className="text-xs text-amber-400/80 font-bold uppercase tracking-wider mt-1.5 select-none font-display">
            Secure Member Authentication
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex gap-3 items-start"
          >
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            <div>
              <p className="font-bold">Access Denied</p>
              <p className="mt-0.5 text-zinc-400 leading-relaxed font-light">{error}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input field */}
          <div>
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
              Email or Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. raastatrips@admin or your email"
                className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
              />
            </div>
          </div>

          {/* Password input field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest font-display">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-black py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer font-display"
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
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            Sign in with Google
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-xs text-zinc-400 text-center mt-6">
          New to RAASTA?{" "}
          <button
            onClick={onNavigateToSignup}
            className="text-amber-400 hover:text-amber-300 font-bold transition underline cursor-pointer font-display ml-1"
          >
            Create an account
          </button>
        </p>
      </motion.div>
    </div>
  );
}