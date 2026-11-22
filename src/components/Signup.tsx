/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { syncUserProfile, isUserAdmin } from "../lib/authUtils";
import GoogleIcon from "./GoogleIcon";

interface SignupProps {
  onBack: () => void;
  onSuccess: (user: { id: string; name: string; email: string; role: string }) => void;
  onNavigateToLogin: () => void;
}

export default function Signup({ onBack, onSuccess, onNavigateToLogin }: SignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill out all available fields.");
      return;
    }

    if (password.length < 6) {
      setError("For security, password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      
      const syncedUser = await syncUserProfile({
        uid: userCred.user.uid,
        email: userCred.user.email || email,
        displayName: name
      });

      onSuccess(syncedUser);
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email address is already registered. Please sign in instead.");
      } else {
        setError(err.message || "An error occurred during account creation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const syncedUser = await syncUserProfile({
        uid: userCred.user.uid,
        email: userCred.user.email,
        displayName: userCred.user.displayName,
        photoURL: userCred.user.photoURL
      });

      onSuccess(syncedUser);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in popup was closed before completion. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Your browser blocked the sign-in popup. Please allow popups for raastatrips.in.");
      } else {
        setError(err.message || "Google sign in failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-400/5 rounded-full filter blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[160px] pointer-events-none"></div>

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
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400 shadow-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">Join RAASTA</h2>
          <p className="text-xs text-amber-400/80 font-bold uppercase tracking-wider mt-1.5 select-none font-display">
            Create Your Explorer Account
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
              <p className="font-bold">Registration Alert</p>
              <p className="mt-0.5 text-zinc-400 leading-relaxed font-light">{error}</p>
            </div>
          </motion.div>
        )}

        {/* 1-Click Google Authentication */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-black/40 disabled:opacity-50 cursor-pointer font-display border border-zinc-200"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#0b0c10] px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            or register with email
          </span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
              Create Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-black py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer font-display"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-zinc-400 text-center mt-6">
          Already registered?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-amber-400 hover:text-amber-300 font-bold transition underline cursor-pointer font-display ml-1"
          >
            Sign in instead
          </button>
        </p>
      </motion.div>
    </div>
  );
}
