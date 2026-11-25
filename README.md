# DEVVERSE – TECH ROOM ESCAPE

A frontend-only, responsive cyber-investigation and digital forensics escape room web application built with **React.js**, **Vite**, **Three.js**, **LocalStorage / IndexedDB**, and **Lucide Icons**.

---

## Features

- **33 Pre-Created Teams & 11 Destination Groups**: Automatically initializes `TEAM01`–`TEAM33` with `PASS01`–`PASS33` and 33 unique, meaningful 4-letter English destination words (11 groups of 3 teams sharing the same final letter), with **132 unique question instances** (4 per team).
- **Single-Page 4-Question Investigation**: Displays `TECH ROOM ESCAPE` above every question, a dedicated full-width briefing box above the separate game box, `PREVIOUS` / `NEXT` navigation, and preserved game state.
- **Hidden Encrypted Letters Until Final Elevation**: Individual question completions never reveal destination letters or answers. Only after all 4 questions are submitted does the **DESTINATION CODE** elevation screen display verified letters in **GREEN** and unsolved positions as **RED (`_`)**.
- **10 Interactive Game Types**: Scrambled Word Arrangement, Pair Matching, Click-Based Investigation, 3D Suspicious Room (Three.js), Encrypted 5×5 Grid (with persistent 2-minute lockout after 3 consecutive mistakes), Beginner CTF Challenge, Odd One Out, Easy Technical MCQ, Computer Assembly Investigation, and Easy Memory Matching Game.
- **20-Minute Persistent Countdown**: Uses a stored deadline timestamp so page refreshes preserve the exact remaining time.
- **Minimal 3-Column Admin Portal**: Displays `Username ID`, `Password`, and `Destination Code` for all 36 teams (Admin key: `ADMIN2026`).

---

## Installation & Local Development

```bash
npm install
npm run dev
```

## Production Build & Vercel Deployment

```bash
npm run build
```

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import into [Vercel](https://vercel.com/) with Framework Preset **Vite** (`Build Command: npm run build`, `Output Directory: dist`).
3. `vercel.json` is included for SPA routing fallback. Zero backend environment variables are required.

---

## Default Team Credentials (33 Teams)

- **Admin Portal Key**: `ADMIN2026`
- **Teams**: `TEAM01` / `PASS01` (`HACK`) through `TEAM33` / `PASS33` (`DEEP`) — see [defaultTeams.js](src/data/defaultTeams.js) for the full 33-team table and 11-group mapping.

---

## Browser-Storage & Performance Notes

- **Device-Local Storage**: All team data, timers, lockouts, and progress are persisted in the current browser's `LocalStorage` and `IndexedDB`.
- **No Cross-Device Sync**: Changes made on one device do **not** automatically synchronize to other phones.
- **Client-Side Only**: Because there is no backend server, credentials and answer keys stored in the browser cannot be secured against inspection via developer tools, and clearing site data will remove saved progress.
