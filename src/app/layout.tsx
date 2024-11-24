import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const robotoFlex = localFont({
  src: './fonts/RobotoFlex.ttf',
  variable: '--font-roboto-flex',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Schoolsync',
  description: 'Simple school management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${robotoFlex.variable} min-h-screen antialiased`}>{children}</body>
    </html>
  )
}
