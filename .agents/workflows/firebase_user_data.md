---
description: How to read/write user data to Firebase Firestore
---

# Firebase Firestore — User Data Pattern

## Setup
- Firebase is initialized in `web/lib/firebase.ts`. Exports: `auth`, `db`.
- Auth state is managed via `web/lib/AuthContext.tsx`. Use `const { user } = useAuth();` anywhere.

## User Document Structure
User profiles are stored at: `users/{uid}` in Firestore.

```ts
// Firestore document: users/{uid}
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  // Onboarding survey fields:
  role: "student" | "professional" | "self_learner" | "educator" | "other";
  experienceLevel: "beginner" | "intermediate" | "advanced";
  learningGoal: "placement" | "upskilling" | "academic" | "freelancing" | "curiosity";
  preferredDomains: string[];          // e.g. ["DSA", "Web Dev"]
  onboardingComplete: boolean;
  // Progress fields (updated over time):
  streak: number;
  totalSessions: number;
  lastActive: Timestamp;
}
```

## Reading User Profile
```ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ref = doc(db, "users", user.uid);
const snap = await getDoc(ref);
if (snap.exists()) {
  const profile = snap.data() as UserProfile;
}
```

## Writing User Profile
```ts
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  email: user.email,
  displayName: user.displayName ?? name,
  createdAt: serverTimestamp(),
  onboardingComplete: true,
  // ...other fields
}, { merge: true });
```

## Updating a Field
```ts
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
await updateDoc(doc(db, "users", user.uid), {
  streak: newStreak,
  lastActive: serverTimestamp(),
});
```

## AuthContext Extension
The `AuthContext` currently only exposes `{ user, loading, logout }`. If you need profile data globally, extend the context to include `UserProfile | null` and fetch it on `onAuthStateChanged`.
