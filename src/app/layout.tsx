'use client';
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const authPages = ['/login', '/register', '/']
  const isAuthPage = authPages.includes(pathname)

  return (
    <html lang="id">
      <body className={inter.className}>
        {isAuthPage ? (
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        ) : (
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-auto">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  )
}