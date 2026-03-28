# sahara · Mental Wellness App

A React + TypeScript application with Clerk authentication, converted from the original single-file HTML into a clean component architecture.

## Project Structure

```
sahara/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── src/
    ├── main.tsx              # Entry point — mounts ClerkProvider
    ├── App.tsx               # Root — auth gate, intro/app routing
    ├── types/
    │   └── index.ts          # Shared TypeScript interfaces
    ├── lib/
    │   ├── data.ts           # All static data (users, messages, quotes…)
    │   ├── utils.ts          # rand(), ri(), animCount() helpers
    │   └── styles.ts         # Global CSS injected via <style> tag
    └── components/
        ├── BgCanvas.tsx      # Animated canvas background (orbs + particles)
        ├── Cursor.tsx        # Custom cursor with spring-lag ring
        ├── Intro.tsx         # 3-scene intro animation sequence
        ├── SignInPage.tsx    # Clerk <SignIn> themed for dark UI
        ├── Navbar.tsx        # Sticky nav with Clerk <UserButton>
        ├── Hero.tsx          # Hero section
        ├── StatsCol.tsx      # Left column — animated stat cards
        ├── FeedCol.tsx       # Centre column — live notification feed
        ├── NotifCard.tsx     # Individual feed card with like interaction
        ├── MoodCol.tsx       # Right column wrapper
        ├── MoodPanel.tsx     # Mood picker pills
        ├── QuoteCard.tsx     # Auto-rotating quote
        └── BreathingWidget.tsx # 4-phase breathing exercise
```

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Clerk
1. Create a free account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your **Publishable Key** from the Clerk dashboard

### 3. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local and paste your Clerk publishable key:
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 4. Run the dev server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

## Auth Flow

- **Unauthenticated users** see the 3-scene intro animation, then are presented with a Clerk sign-in card (dark-themed to match the UI).
- **Authenticated users** see the intro animation, then transition into the full app dashboard.
- The `<UserButton>` in the navbar lets signed-in users manage their account or sign out.

## Clerk Features Used

| Component / Hook | Purpose |
|---|---|
| `<ClerkProvider>` | Wraps the app, provides auth context |
| `<SignIn>` | Themed sign-in form on the auth gate |
| `<UserButton>` | Avatar button in navbar (sign out, profile) |
| `useAuth()` | `isLoaded`, `isSignedIn` for conditional rendering |
| `useUser()` | Displays the user's name in the navbar |

## Customisation

- **Colors / tokens** — edit `:root` variables in `src/lib/styles.ts`
- **Feed content** — edit `USERS`, `MESSAGES`, `TAGS` in `src/lib/data.ts`
- **Intro timing** — adjust `setTimeout` delays in `src/components/Intro.tsx`
- **Feed interval** — change `ri(1000, 2000)` in `FeedCol.tsx` for faster/slower posts
