"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext(null);

const fetchRole = async (uid) => {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? snapshot.data().role : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // True until Firebase reports the first auth state, so pages don't redirect too early.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
      } else {
        // Load the role before exposing the user, so route guards never see a user without a role.
        // Right after registration users/{uid} may not exist yet; register() sets the role itself,
        // so only overwrite it when the doc exists.
        const storedRole = await fetchRole(firebaseUser.uid);
        if (storedRole) setRole(storedRole);
        setUser(firebaseUser);
      }
      setLoading(false);
    });
  }, []);

  // Creating the account also signs the user in, so no separate login step is needed.
  const register = async ({ email, password, role: newRole }) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await setDoc(doc(db, "users", newUser.uid), {
      email: newUser.email,
      role: newRole,
      createdAt: serverTimestamp(),
    });
    setUser(newUser);
    setRole(newRole);
    return newRole;
  };

  // remember = "Keep me signed in": local persistence survives closing the browser, session persistence
  // ends with the tab. It must be set before signing in to apply to this session.
  const login = async ({ email, password, remember = true }) => {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const { user: signedInUser } = await signInWithEmailAndPassword(auth, email.trim(), password);
    const storedRole = await fetchRole(signedInUser.uid);
    if (!storedRole) {
      // An auth account without users/{uid} was never fully registered.
      await signOut(auth);
      throw Object.assign(new Error("No LokaMart profile for this account"), { code: "auth/user-not-found" });
    }
    setUser(signedInUser);
    setRole(storedRole);
    return storedRole;
  };

  const logout = () => signOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());

  return (
    <AuthContext.Provider value={{ user, role, loading, register, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
