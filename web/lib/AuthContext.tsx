"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "professional" | "self_learner" | "educator" | "other";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  learningGoal: "placement" | "upskilling" | "academic" | "freelancing" | "curiosity";
  preferredDomains: string[];
  onboardingComplete: boolean;
  streak: number;
  totalSessions: number;
  lastActiveDate?: string;                   // "YYYY-MM-DD" of last session
  activityLog?: Record<string, number>;      // { "YYYY-MM-DD": sessionCount }
  topicMastery?: Record<string, Record<string, number>>; // { domain: { topic: score_0_100 } }
  latestAnalysis?: any; // AnalysisResult
  latestScores?: Record<string, any>; // Record<string, TopicScore>
  createdAt?: unknown;
  lastActive?: unknown;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  logout: async () => {},
  refreshProfile: async () => {},
  saveProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = async (u: User) => {
    setProfileLoading(true);
    try {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await fetchProfile(u);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  const saveProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? data.displayName ?? "",
      ...data,
      lastActive: serverTimestamp(),
    }, { merge: true });
    await fetchProfile(user);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileLoading, logout, refreshProfile, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
