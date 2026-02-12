import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner' // Or standard shadcn/toaster (not installed) or just no toaster for now
// Standard shadcn setup usually includes `sonner` or `react-toastify`. I didn't install one. I'll omit for now.
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EMS Dashboard',
  description: 'Employee Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
