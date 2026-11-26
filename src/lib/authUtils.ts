/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Verified Administrator emails for RAASTA TRIPS
 */
export const ADMIN_EMAILS: readonly string[] = [
  "abhi@raastatrips.in",
  "abhighodke5123@gmail.com",
  "raastatrips.in@gmail.com",
  "raastatrips@admin.com",
  "raastatrips@admin"
];

/**
 * Evaluates whether an email or role designates an administrator
 */
export function isUserAdmin(email?: string | null, currentRole?: string | null): boolean {
  if (currentRole === "admin") return true;
  if (!email) return false;

  const clean = email.trim().toLowerCase();
  
  // Direct whitelist match
  if (ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean)) {
    return true;
  }

  // Exact shorthand admin login normalization
  if (clean === "raastatrips@admin" || clean === "raastatrips@admin.com") {
    return true;
  }

  return false;
}

/**
 * Ensures user document in Firestore has proper role and metadata
 */
export async function syncUserProfile(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<{ id: string; name: string; email: string; role: string }> {
  const isAdmin = isUserAdmin(user.email);
  let resolvedRole = isAdmin ? "admin" : "user";
  const userDocRef = doc(db, "users", user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().role) {
      // Whitelist overrides any legacy or stale "user" role in db
      resolvedRole = isAdmin ? "admin" : userDoc.data().role;
    }

    // Persist or merge to ensure admin privileges are recorded in Firestore
    await setDoc(
      userDocRef,
      {
        id: user.uid,
        name: user.displayName || (user.email ? user.email.split("@")[0] : "Traveler"),
        email: user.email || "",
        role: resolvedRole,
        photoURL: user.photoURL || null,
        lastLogin: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Could not sync user profile to Firestore:", err);
  }

  return {
    id: user.uid,
    name: user.displayName || (user.email ? user.email.split("@")[0] : "Traveler"),
    email: user.email || "",
    role: resolvedRole
  };
}
