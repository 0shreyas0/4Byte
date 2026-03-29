---
description: Replacing mock/hardcoded data with real backend data (Firestore + APIs)
---

# 🔄 Mock Data → Real Backend Migration

This workflow documents every place in the app where data is hardcoded or mocked,
and provides step-by-step instructions to replace each with a live backend source.
The app already has **Firebase (Firestore + Auth)** and **YouTube Data API v3** wired up
in `.env` — so no new infrastructure is needed.

---

## 📋 Mock Data Registry

| # | File | What's Mocked | Priority |
|---|------|---------------|----------|
| 1 | `components/edtech/ResourceLibrary/index.tsx` | Entire video database (`MOCK_RESOURCES`) | 🔴 HIGH |
| 2 | `components/edtech/UserProfilePage/index.tsx` | Community Rank leaderboard (`"Top 12%"`, `"CodeMaster"`, `"NexusDev"`) | 🔴 HIGH |
| 3 | `lib/edtech/youtube.ts` | Fallback mock videos when API key missing or quota hit | 🟡 MEDIUM |
| 4 | `components/edtech/UserProfilePage/index.tsx` | Activity heatmap fake scatter for users with no `activityLog` | 🟡 MEDIUM |
| 5 | `components/edtech/LearningConcept/index.tsx` | All lesson content (`CONCEPT_DATA`) for all 8 domains | 🟢 LOW (intentional static content) |

---

## Fix 1 — ResourceLibrary: Replace `MOCK_RESOURCES` with YouTube API

**Current behaviour:** 8 static entries covering only DSA, Web Dev, and Aptitude.
App Dev, Data Science, Cybersecurity, IoT, Python all return zero results.

**Target:** Call `fetchYouTubeVideos()` (already in `lib/edtech/youtube.ts`) keyed
by selected domain + topic. Results are already real YouTube links.

### Steps

1. Open `components/edtech/ResourceLibrary/index.tsx`.
2. Delete the entire `MOCK_RESOURCES` constant (lines ~24–38).
3. Import the youtube helper and add a state + effect:

   ```tsx
   import { fetchYouTubeVideos, YouTubeVideo } from "@/lib/edtech/youtube";

   // Inside the component:
   const [videos, setVideos] = useState<YouTubeVideo[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
     setLoading(true);
     fetchYouTubeVideos(`${selectedDomain} tutorial for beginners`)
       .then(setVideos)
       .finally(() => setLoading(false));
   }, [selectedDomain]);
   ```

4. Replace the `filtered` variable's source from `MOCK_RESOURCES` → `videos`:

   ```tsx
   const filtered = videos.filter(v =>
     v.title.toLowerCase().includes(search.toLowerCase())
   );
   ```

5. Add a loading skeleton state when `loading === true`.
6. Remove `duration` and `level` fields from card rendering (YouTube API does not
   return them reliably without an extra `contentDetails` call — the fallback in
   `youtube.ts` already attempts this).

---

## Fix 2 — ResourceLibrary: Persist resources to Firestore (optional caching)

The YouTube API has a **10,000 unit/day free quota**. Cache results per domain in
Firestore to avoid burning quota on repeated opens.

### Steps

1. Create a Firestore collection `resourceCache` with documents per domain:
   - Document ID: domain name (e.g., `"DSA"`, `"Web Dev"`)
   - Fields: `videos: YouTubeVideo[]`, `fetchedAt: Timestamp`

2. In `ResourceLibrary`, before calling the YouTube API, check Firestore:

   ```ts
   import { db } from "@/lib/firebase";
   import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

   const cacheRef = doc(db, "resourceCache", selectedDomain);
   const snap = await getDoc(cacheRef);
   const ONE_HOUR = 60 * 60 * 1000;

   if (snap.exists() && Date.now() - snap.data().fetchedAt.toMillis() < ONE_HOUR) {
     setVideos(snap.data().videos);
   } else {
     const fresh = await fetchYouTubeVideos(`${selectedDomain} tutorial`);
     setVideos(fresh);
     await setDoc(cacheRef, { videos: fresh, fetchedAt: serverTimestamp() });
   }
   ```

---

## Fix 3 — UserProfilePage: Community Rank Leaderboard

**Current behaviour:** Three hardcoded rows: `"Top 12%"`, `"CodeMaster"`, `"NexusDev"`.

**Target:** Pull real top users from Firestore ordered by `totalSessions` (already
stored on every user's profile doc under `users/{uid}`).

### Steps

1. Create a `lib/edtech/leaderboard.ts` helper:

   ```ts
   import { db } from "@/lib/firebase";
   import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

   export interface LeaderboardEntry {
     uid: string;
     displayName: string;
     totalSessions: number;
   }

   export async function fetchLeaderboard(topN = 10): Promise<LeaderboardEntry[]> {
     const q = query(
       collection(db, "users"),
       orderBy("totalSessions", "desc"),
       limit(topN)
     );
     const snap = await getDocs(q);
     return snap.docs.map(d => ({
       uid: d.id,
       displayName: d.data().displayName || "Anonymous",
       totalSessions: d.data().totalSessions || 0,
     }));
   }
   ```

2. In `UserProfilePage`, add a state + effect:

   ```tsx
   import { fetchLeaderboard, LeaderboardEntry } from "@/lib/edtech/leaderboard";

   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

   useEffect(() => {
     fetchLeaderboard(10).then(setLeaderboard);
   }, []);
   ```

3. Compute the current user's rank:

   ```tsx
   const myRank = leaderboard.findIndex(e => e.uid === user?.uid) + 1;
   const myPercentile = myRank > 0
     ? Math.round((1 - myRank / leaderboard.length) * 100)
     : null;
   ```

4. Replace the hardcoded `"Top 12%"` div with `myPercentile ? "Top ${myPercentile}%" : "Unranked"`.
5. Replace the hardcoded leaderboard rows with `.map()` over `leaderboard`.

> **Note:** Firestore rules must allow authenticated reads on `users` collection.
> Add this rule to `firestore.rules`:
> ```
> match /users/{uid} {
>   allow read: if request.auth != null;
>   allow write: if request.auth.uid == uid;
> }
> ```

---

## Fix 4 — Activity Heatmap: Remove fake scatter fallback

**Current behaviour:** Users who had sessions before `activityLog` was added
see a pseudorandom scatter of fake activity on their heatmap.

**Target:** Show an empty heatmap for those users. It's more honest.

### Steps

1. Open `components/edtech/UserProfilePage/index.tsx`.
2. In the `buildActivityData` function, find the block starting at:
   ```ts
   // Fallback: If map is empty but sessions > 0, scatter some mock data
   ```
3. Delete the entire `if (loggedDays === 0 && sessions > 0)` block (~lines 597–611).
4. The function will now return an all-zero array for those users, which
   renders as an empty (but correct) heatmap.

---

## Fix 5 — YouTube Fallback: Better no-key behaviour

**Current behaviour:** When the API key is missing or quota is hit, two fake
`videoId: "mock1"` / `"mock2"` entries are returned which show broken YouTube links.

**Target:** Return an empty array, and let the UI show an "API unavailable" message.

### Steps

1. Open `lib/edtech/youtube.ts`.
2. In the missing-key guard (lines ~13–28), replace the mock return with:
   ```ts
   console.warn("YouTube API Key missing. Returning empty.");
   return [];
   ```
3. In the catch block (lines ~80–93), replace the mock return with:
   ```ts
   console.warn("YouTube fetch failed:", error?.message || error);
   return [];
   ```
4. In `ResourceLibrary`, handle the `videos.length === 0 && !loading` state with a
   proper empty-state message (e.g., "Videos unavailable — check YouTube API quota").

---

## Fix 6 — LearningConcept: Move `CONCEPT_DATA` to Firestore (optional)

**Current behaviour:** All 8 domain lesson decks are hardcoded in the component.
No way to add/edit content without a code deploy.

**Target:** Store each domain's concepts in Firestore under `concepts/{domain}`.

### Steps

1. In **Firebase Console → Firestore**, create a collection `concepts`.
2. For each domain (DSA, Web Dev, etc.), create a document using the domain name
   as the ID. Add an array field `cards`, each element being:
   ```json
   { "title": "...", "concept": "...", "content": "...", "visual": "...", "example": "..." }
   ```
3. Seed this from the existing `CONCEPT_DATA` object (one-time script):

   ```ts
   // scripts/seedConcepts.ts  (run once with ts-node)
   import { db } from "@/lib/firebase";
   import { setDoc, doc } from "firebase/firestore";
   import { CONCEPT_DATA } from "@/components/edtech/LearningConcept/index";

   for (const [domain, cards] of Object.entries(CONCEPT_DATA)) {
     await setDoc(doc(db, "concepts", domain), { cards });
   }
   ```

4. In `LearningConcept`, fetch on mount:

   ```tsx
   const [cards, setCards] = useState<any[]>([]);
   useEffect(() => {
     getDoc(doc(db, "concepts", domain)).then(snap => {
       if (snap.exists()) setCards(snap.data().cards);
       else setCards(getDomainConcepts(domain)); // fallback to hardcoded
     });
   }, [domain]);
   ```

---

## ✅ Completion Checklist

- [ ] Fix 1: `ResourceLibrary` fetches real YouTube videos per domain
- [ ] Fix 2: YouTube results are cached in Firestore `resourceCache`
- [ ] Fix 3: Leaderboard reads real Firestore `users` collection
- [ ] Fix 4: Heatmap fake-scatter fallback removed
- [ ] Fix 5: YouTube mock fallback returns `[]` instead of fake videos
- [ ] Fix 6 (optional): `CONCEPT_DATA` migrated to Firestore `concepts` collection

---

## 🔑 Environment Variables Needed

All keys are already present in `.env`. No new services required.

| Key | Used For |
|-----|----------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | Fix 1, 5 — video fetching |
| `NEXT_PUBLIC_FIREBASE_*` | Fix 2, 3, 6 — Firestore reads/writes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Existing AI quiz/concept generation (unchanged) |
