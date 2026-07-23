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
              <UserPlus className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-2xl font-extrabold text-black tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1.5 select-none">
            Join the caravan of modern wanderers
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
                    placeholder="e.g. raastatrips.in@gmail.com"
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
            className="w-full bg-zinc-100 hover:bg-zinc-200 text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            Sign up with Google
          </button>
        </div>

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
