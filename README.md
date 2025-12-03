# EuProximaX Website

Public-facing website for EuProximaX Innovation Services.

## Overview

This is the public website repository containing all customer-facing pages including:
- Home page
- About page
- Services pages
- Blog pages
- Event Gallery
- Video Gallery
- Contact page
- Legal pages (Terms, Privacy)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The website will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components (Header, Footer, Layout, etc.)
├── pages/          # Page components
│   └── services/  # Service detail pages
├── services/       # API service functions (blog, contact, event, video)
├── utils/          # Utility functions (API client)
├── context/        # React contexts (Theme, Toast)
└── constants/      # Constants and strings
```

## API Communication

This website communicates with the shared backend API (`euproximax-backend`) via REST API calls. All API calls are handled through the `apiClient` utility in `src/utils/apiClient.ts`.

## Deployment

This repository can be deployed independently to:
- Static hosting (Vercel, Netlify, GitHub Pages)
- CDN
- Any web server

Make sure to set the `VITE_API_BASE_URL` environment variable to point to your backend API URL.

## Notes

- This repository does NOT contain admin functionality
- Authentication is not required for public pages
- All admin functionality is in the separate `euproximax-admin` repository

