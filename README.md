# Tiny Tasks – ADHD Productivity App

**Tiny Tasks** is a lightweight, single-screen productivity app designed for students with ADHD. Built using **React Native** with **MMKV** for local storage, the app helps users stay focused by breaking down daily goals, syncing with Google Calendar, and enabling motivational modes like Focus and Pomodoro.

![Showcase Poster](https://github.com/user-attachments/assets/24bc6dc2-a63c-4b2f-9f1d-a45ec62f96fe)

---

## Features

### Google Calendar Integration
- Read-only import of upcoming events using **Google Calendar API**
- OAuth2 flow for secure sign-in with Google
- Calendar events are locked and visually distinct from tasks

### Local Task Management with MMKV
- Fast, efficient task storage using **react-native-mmkv**
- Tasks persist across sessions with near-instant read/write
- Overflow system for saving unscheduled or non-priority tasks

### Full / Half-Day View Toggle
- Toggle between showing full-day and half-day task sets
- Reduces cognitive load by focusing only on relevant times

### Motivation Modes
- **Focus Mode**: Minimalist layout to reduce visual distractions
- **Pomodoro Mode**: 25/5 work-break intervals with built-in timer

### ADHD-Friendly Design
- Animated motivational prompts
- Dopamine-boosting UI elements like progress icons and colors
- Mobile-first layout for fast mental reward cycles

---

## Tech Stack

| Layer            | Technology                          |
|------------------|--------------------------------------|
| Framework        | React Native                         |
| Auth             | Google OAuth2 via `expo-auth-session` |
| Calendar Sync    | Google Calendar API                  |
| Local Storage    | `react-native-mmkv`                  |
| Animations       | `react-native-reanimated`    |
| Timer Logic      | JS `setInterval`, `clearInterval`    |
| Build Tools      | Expo  |

---

## Architecture Overview

### Core Screens
- `HomeScreen.js` – Task list + calendar items
- `OverflowScreen.js` – Stores unscheduled tasks
- `TaskModal.js` – Input modal for adding/editing tasks
- `ModeScreen.js` – UI for Pomodoro/Focus Modes

### Modules
- `calendarService.js` – Handles OAuth2 + Calendar API
- `taskStorage.js` – Uses `react-native-mmkv` for storing and updating tasks
- `usePomodoro.js` – Manages intervals and timers with custom hooks

---

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- `npm` or `yarn`
- Expo CLI
- Google Cloud Console account with Calendar API enabled

---

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/KatavinaNguyen/adhd_productivity_app.git
cd adhd_productivity_app
npm install
```

---

### 2. Set Up Google Calendar API

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable **Google Calendar API**
- Create **OAuth 2.0 Client ID** for "Web" (for Expo) or "iOS/Android" (for bare RN)
- Copy your client ID

Then create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

---

### 3. Run the App

Using **Expo**:

```bash
cd frontend
npx expo run:android
```

---

## Troubleshooting

### Google Sign-In Not Working
- Make sure your `GOOGLE_CLIENT_ID` matches the correct platform type
- Use `AuthSession.makeRedirectUri({ useProxy: true })` for Expo development

### Calendar Not Syncing
- Ensure scope `https://www.googleapis.com/auth/calendar.readonly` is used
- Check console logs for API errors from `calendarService.js`

### Tasks Not Saving
- Confirm `react-native-mmkv` is installed and linked
- For bare RN, run `npx pod-install` after install (iOS only)

---

## Future Improvements

- **Routine Tasks & Habit Formation**  
  Implement a system for recurring tasks and routines to help users establish consistent, healthy habits. This includes daily/weekly templates and streak tracking for behavioral reinforcement.

- **Handwritten Task Recognition (OCR)**  
  Integrate on-device OCR to scan and convert handwritten notes into digital tasks, enabling users to capture physical sticky notes, planners, or whiteboards directly into the app.

-  **Firebase Cloud Backup & Sync**  
  Implement Firebase integration to back up task data in the cloud and enable cross-device syncing for seamless access and long-term retention.
