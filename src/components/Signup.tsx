/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserPlus, Mail, Lock, User, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
      
      // Update the Firestore user document with the correct name since onAuthStateChanged might have created it with "User"
      import("../firebase").then(({ db }) => {
        setDoc(doc(db, "users", userCred.user.uid), {
          id: userCred.user.uid,
          name: name,
          email: userCred.user.email || "",
          role: "user"
        }, { merge: true }).catch(console.error);
      });

      onSuccess({
        id: userCred.user.uid,
        name: name,
        email: userCred.user.email || "",
        role: "user"
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
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
        role: "user" // App.tsx will write this to Firestore
      });
    } catch (err: any) {
      setError(err.message || "Google sign in failed.");
    } finally {
      setLoading(false);
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
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4 text-amber-400 shadow-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Create Account
          </h2>
          <p className="text-xs text-amber-400/80 font-bold uppercase tracking-wider mt-1.5 select-none font-display">
            Join the caravan of modern wanderers
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
              <p className="font-bold">Security Blocked</p>
              <p className="mt-0.5 text-zinc-400 leading-relaxed font-light">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
            <motion.form
              key="signup-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSignup}
              className="space-y-5"
            >
              {/* Full Name input */}
              <div>
                <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Explorer Name
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
                    placeholder="Joe Wanderer"
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200 font-sans"
                  />
                </div>
              </div>

              {/* Email input field */}
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
                    placeholder="e.g. raastatrips.in@gmail.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200 font-sans"
                  />
                </div>
              </div>

              {/* Password input field */}
              <div>
                <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-widest mb-2 font-display">
                  Password
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
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-400/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition duration-200 font-sans"
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </>
                )}
              </button>
            </motion.form>
        </AnimatePresence>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            Sign up with Google
          </button>
        </div>

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
