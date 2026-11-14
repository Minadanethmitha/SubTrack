# SubTrack

SubTrack is an offline-first personal subscription and recurring expense manager built with Expo and React Native.

## Overview

The app helps users track recurring subscriptions, utility bills, memberships, and other regular expenses in one place. It is designed to work entirely offline, with bundled local data and local device storage instead of remote services.

## Key Features

- Track recurring subscriptions and payments
- Manage monthly budget progress
- Search, filter, and sort subscriptions
- Explore an offline bundled catalog of common subscription services
- View upcoming renewals and due dates
- Keep data local using AsyncStorage
- Focus on a simple, mobile-first user experience

## Tech Stack

- Expo
- React Native
- React Navigation
- AsyncStorage
- Expo Vector Icons
- JavaScript

## Project Structure

- `App.js` - app bootstrap and providers
- `app.json` - Expo app configuration
- `src/navigation` - app routing and navigation
- `src/screens` - main screens and user flows
- `src/context` - app state and preferences management
- `src/data` - bundled offline catalog data
- `src/storage` - local persistence helpers
- `src/utils` - billing, date, money, and search utilities

## Offline-first Design

SubTrack is intended to work without internet access. The app uses bundled local JSON data and stores user-created tracking data on-device, which makes it suitable for personal budgeting and recurring expense management without external dependencies.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Run validation for the local catalog:
   ```bash
   npm run validate:data
   ```

## Notes

This project was built as a mobile-first offline subscription tracker and is intended for assignment and demonstration purposes.
