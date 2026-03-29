import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TopicScore } from "./conceptGraph";

/**
 * Called after every completed quiz session.
 * - Computes today's date (YYYY-MM-DD)
 * - Compares against lastActiveDate to update streak
 * - Logs the session in activityLog
 * - Increments totalSessions
 * - Merges new topic scores (keeping best scores)
 * - Writes the update to Firestore
 */
export async function recordSession(
  uid: string, 
  domain?: string, 
  newScores?: Record<string, TopicScore>,
  analysis?: unknown,
  stage?: number
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const today = getTodayISO();
  const last: string | undefined = data.lastActiveDate;
  const currentStreak: number = data.streak ?? 0;
  const activityLog: Record<string, number> = data.activityLog ?? {};
  const topicMastery: Record<string, Record<string, number>> = data.topicMastery ?? {};
  const domainStageProgress: Record<string, { completedStages: number }> = data.domainStageProgress ?? {};

  // ── Streak logic ──────────────────────────────────────────────────────────
  let newStreak: number;

  if (!last) {
    newStreak = 1;
  } else if (last === today) {
    newStreak = currentStreak;
  } else {
    const daysSinceLast = diffInDays(last, today);
    newStreak = (daysSinceLast === 1) ? currentStreak + 1 : 1;
  }

  // ── Activity log ──────────────────────────────────────────────────────────
  activityLog[today] = (activityLog[today] ?? 0) + 1;

  // ── Mastery Update ────────────────────────────────────────────────────────
  if (domain && newScores) {
    if (!topicMastery[domain]) topicMastery[domain] = {};
    
    Object.entries(newScores).forEach(([topic, scoreData]) => {
      const currentBest = topicMastery[domain][topic] ?? 0;
      topicMastery[domain][topic] = Math.max(currentBest, scoreData.score);
    });
  }

  if (domain && stage) {
    const currentProgress = domainStageProgress[domain]?.completedStages ?? 0;
    domainStageProgress[domain] = {
      completedStages: Math.max(currentProgress, stage),
    };
  }

  // ── Write to Firestore ────────────────────────────────────────────────────
  await updateDoc(ref, {
    streak: newStreak,
    lastActiveDate: today,
    totalSessions: (data.totalSessions ?? 0) + 1,
    activityLog,
    topicMastery,
    domainStageProgress,
    latestAnalysis: analysis ?? data.latestAnalysis ?? null,
    latestScores: newScores ?? data.latestScores ?? null,
    lastActive: serverTimestamp(),
  });

  // ── Session History (Internal Array to avoid permission issues) ───────────
  if (domain && newScores && analysis) {
    try {
      const history = data.sessionHistory ?? [];
      const newSession = {
        domain,
        scores: newScores,
        analysis,
        date: today,
        timestamp: new Date().toISOString(), // consistent with the array
      };
      
      // Keep last 15 sessions to stay under document size limits
      const updatedHistory = [newSession, ...history].slice(0, 15);
      
      await updateDoc(ref, {
        sessionHistory: updatedHistory
      });
    } catch (e) {
      console.error("Failed to store session in history array:", e);
    }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's date as "YYYY-MM-DD" in local time */
export function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Returns number of calendar days between two ISO date strings */
function diffInDays(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  // Strip time so we only compare dates
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
