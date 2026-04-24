<div align="center">

<br/>

<img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=61dafb&labelColor=09090b" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=3178c6&labelColor=09090b" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=646cff&labelColor=09090b" alt="Vite"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?style=flat-square&logo=tailwindcss&logoColor=38bdf8&labelColor=09090b" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/Firebase-ffca28?style=flat-square&logo=firebase&logoColor=ffca28&labelColor=09090b" alt="Firebase"/>
<img src="https://img.shields.io/badge/Zustand-5-f97316?style=flat-square&labelColor=09090b" alt="Zustand"/>
<img src="https://img.shields.io/badge/GSAP-3-88ce02?style=flat-square&labelColor=09090b" alt="GSAP"/>
<img src="https://img.shields.io/badge/License-MIT-6366f1?style=flat-square&labelColor=09090b" alt="MIT License"/>

<br/><br/>

# ⚔️ Warframe Mastery Tracker

### _Every item mastered. Every rank earned. Every XP counted._

<br/>

> A web application for Tenno operatives who refuse to guess their own Mastery Rank.  
> Built with precision. Persisted in the cloud. Obsessed with the details.

<br/>

</div>

---

<br/>

## ✦ What is this?

**Warframe Mastery Tracker** is a personal progression tracker for the game [Warframe](https://www.warframe.com/). It pulls item data directly from the community API, lets you mark each item as **Acquired** or **Mastered**, and calculates your total accumulated XP in real time — inferring your current Mastery Rank, its title, and exactly how much XP stands between you and the next one.

It does not guess. It does not approximate. It just shows you the truth about your grind.

<br/>

## ✦ Features

- **Real-time XP calculation** based on your mastered items — no mental math required, Operator
- **Mastery Rank inference** with correct title progression, from _Initiate_ all the way to _Legendary 3_
- **Category & sub-category filtering** — Warframes, Primary, Secondary, Melee, Archwing, Sentinels, Pets, Amps, and all their sub-types
- **Global search** across all items regardless of the active category tab
- **Hide Mastered toggle** — for when you only want to see the suffering that remains
- **Profile setup on first login** with glyph selection from the full Warframe catalog
- **Full persistence via Firebase Firestore** — your data follows you, unlike your squad
- **GSAP-powered animations** — because a Tenno deserves a UI that doesn't feel like a government form

<br/>

## ✦ Architecture

This project follows a **Clean Architecture** pattern. Each layer has a single responsibility and depends only on what's below it — never above. It's not over-engineering. It's discipline.

```
src/
├── 📁 domain/             ← The soul of the app. Zero dependencies. Zero excuses.
│   ├── entities/          ← Item, UserProfile, MasteryRankInfo. The nouns.
│   ├── repositories/      ← Interfaces only. The what, never the how.
│   └── valueObjects/      ← CategoryMap, exclusion lists, sub-category rules
│
├── 📁 application/        ← Where things actually happen. Orchestration lives here.
│   ├── stores/            ← Zustand: itemStore, userStore, filterStore
│   └── useCases/          ← fetchItems, persistMastery, syncUserProfile. The verbs.
│
├── 📁 infrastructure/     ← The messy outside world, contained and under control.
│   ├── api/               ← WarframeApiService — fetches and normalizes warframestat.us
│   └── firebase/          ← Config, AuthService, FirestoreService
│
└── 📁 presentation/       ← What the Tenno sees. React's territory. Touch nothing else.
    ├── components/        ← Header, TabBar, ItemGrid, ItemCard, MasteryDashboard...
    ├── hooks/             ← useMasteryCalculator. One hook. One job. Beautifully done.
    └── pages/             ← AuthPage. The gate before the sanctum.
```

**`domain/`** knows nothing about React, Firebase, or any API. It defines what the data _is_ — not where it comes from or how it's displayed. Keep it that way.

**`application/`** orchestrates use cases. It calls infrastructure, updates stores, and reacts to user intent. It speaks domain language and does not care about buttons.

**`infrastructure/`** is where reality intrudes — HTTP calls, Firestore reads and writes, authentication state. Everything external is trapped here so it can't infect the rest of the codebase.

**`presentation/`** is pure UI. Components consume stores and dispatch use cases. They don't know how Firestore works. They don't need to. That's the whole point.

<br/>

## ✦ Mastery Rank System

The rank is derived from total accumulated XP using `rank = floor(sqrt(totalXP / 2500))`, capped at 33. Items grant XP based on their category:

| Item Type                                                                | XP Granted                  |
| ------------------------------------------------------------------------ | --------------------------- |
| Warframes, Archwing, Necramechs, K-Drives, Pets, Sentinels, MOAs, Hounds | `6,000 XP`                  |
| Primary, Secondary, Melee, Sentinel Weapons, Amps                        | `3,000 XP`                  |
| Items with `totalExperience` from the API                                | Uses the API value directly |

Title progression mirrors the in-game naming system exactly:

| Rank Range | Title Pattern                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| 0          | Unranked                                                                                                  |
| 1 – 30     | Silver / Gold variants of: Initiate, Novice, Disciple, Seeker, Hunter, Eagle, Tiger, Dragon, Sage, Master |
| 31 – 33    | Legendary 1, Legendary 2, Legendary 3                                                                     |

<br/>

## ✦ Color Palette

| Role               | Hex       | Preview                                                                                                       |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------- |
| Primary Accent     | `#6366f1` | <img src="https://img.shields.io/badge/-%236366f1-6366f1?style=flat-square&labelColor=6366f1" alt="#6366f1"/> |
| Mastered / Success | `#22c55e` | <img src="https://img.shields.io/badge/-%2322c55e-22c55e?style=flat-square&labelColor=22c55e" alt="#22c55e"/> |
| Acquired           | `#3b82f6` | <img src="https://img.shields.io/badge/-%233b82f6-3b82f6?style=flat-square&labelColor=3b82f6" alt="#3b82f6"/> |
| Background         | `#09090b` | <img src="https://img.shields.io/badge/-%2309090b-09090b?style=flat-square&labelColor=09090b" alt="#09090b"/> |
| Surface            | `#18181b` | <img src="https://img.shields.io/badge/-%2318181b-18181b?style=flat-square&labelColor=18181b" alt="#18181b"/> |
| Text Primary       | `#f4f4f5` | <img src="https://img.shields.io/badge/-%23f4f4f5-f4f4f5?style=flat-square&labelColor=f4f4f5" alt="#f4f4f5"/> |

<br/>

## ✦ How to Run

```bash
# Clone the repository
git clone https://github.com/ArkGrayer/warframe-mastery-tracker.git

# Enter the directory
cd warframe-mastery-tracker

# Install dependencies — yes, there are node_modules. Welcome to JavaScript.
npm install
```

Before running, create a `.env` file at the root with your own Firebase project credentials. Don't commit it. Don't share it. Don't be that person.

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

Then:

```bash
npm run dev
```

App runs at `http://localhost:5173`. Item data comes from the public [warframestat.us](https://api.warframestat.us/items) API — no key required for that part. The universe provides.

<br/>

## ✦ Issues & Feature Requests

Found a bug? Have an idea? [Open an issue.](https://github.com/ArkGrayer/warframe-mastery-tracker/issues)

Please describe what happened, what you expected to happen, and what you were doing when it broke. A screenshot helps. A console log helps more. _"It doesn't work"_ helps no one and will be greeted with the exact amount of energy it deserves — which is none.

Feature requests are welcome. Unreasonable ones are also welcome. They're at least entertaining to read before being closed.

<br/>

## ✦ Author

**Igor Feitosa** — _Ark Grayer_

Game developer. Programmer. Builder of things that are done right or done again.

Portfolio → [igorfeitosa.vercel.app](https://igorfeitosa.vercel.app)

<br/>

## ✦ License

```
MIT License — use it, fork it, ship it.
No attribution required. No restrictions.
Just don't tell people you built it from scratch.
We both know you didn't.
```

<img src="https://img.shields.io/badge/License-MIT-6366f1?style=flat-square&labelColor=09090b" alt="MIT License"/>

<br/>

---

<div align="center">

<br/>

_The Lotus is watching your progress. You should be too._

<br/>

</div>
