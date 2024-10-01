import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/lib/auth'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {children}
    </div>
  )
}
