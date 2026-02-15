import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth';
import { EmployeeProvider } from '@/context/EmployeeContext';

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
          <EmployeeProvider>
            {children}
          </EmployeeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
