# Fullstack Video Platform

A full-stack media sharing application built with **Next.js 16**, **TypeScript**, **MongoDB**, **ImageKit**, and **NextAuth.js** — supporting user authentication, video uploads, and a dynamic video feed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | NextAuth.js v4 (Credentials Provider) |
| Media Storage | ImageKit |
| Styling | Tailwind CSS v4 |
| Runtime | Node.js |

---

## Features

- **User Authentication** — Register and sign in securely with hashed passwords via `bcryptjs`
- **Video Uploads** — Upload videos through ImageKit with a dedicated upload form component
- **Video Feed** — Browse all uploaded videos on the home dashboard
- **Protected Routes** — Auth-guarded pages using NextAuth.js session handling
- **API Routes** — REST-style API handlers for auth, registration, and video management
- **Reusable Components** — `FileUpload`, `VideoFeed`, `VideoUploadForm`, and `Providers`

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth.js dynamic route
│   │   ├── auth/imagekit-auth/   # ImageKit auth endpoint
│   │   ├── register/             # User registration API
│   │   └── videos/               # Video CRUD API
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── Providers.tsx
│   │   ├── VideoFeed.tsx
│   │   └── VideoUploadForm.tsx
│   ├── dashboard/                # Protected dashboard page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── api-client.ts             # Client-side API helper
│   ├── auth.ts                   # NextAuth config
│   └── db.ts                     # MongoDB connection utility
├── models/
│   ├── user.model.ts             # Mongoose User schema
│   └── video.model.ts            # Mongoose Video schema
├── next-auth.d.ts                # Augmented NextAuth session types
├── types.d.ts                    # Global TypeScript declarations
└── next.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [ImageKit](https://imagekit.io) account (free tier works)

### Installation

```bash
git clone https://github.com/Rakib-dhali/nextjs.git
cd nextjs
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ImageKit
NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_URL_ENDPOIND=https://ik.imagekit.io/your_imagekit_id

#google client id and secret
GOOGLE_CLIENT_ID=client_id 
GOOGLE_CLIENT_SECRET=client_secret
```

> Generate a strong `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Deployment

Deploy instantly on [Vercel](https://vercel.com):

1. Push the repo to GitHub
2. Import the project in the Vercel dashboard
3. Add all environment variables from `.env.local`
4. Deploy

---

## Author

**Rakib** — Full-Stack Developer  
[Portfolio](https://rakib-dhali-portfolio.vercel.app) · [GitHub](https://github.com/Rakib-dhali)

---

## License

This project is open source and available under the [MIT License](LICENSE).