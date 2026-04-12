"use client"

import { signOut } from 'next-auth/react';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
        Logout
      </button>
      {children}
    </div>
  );
}