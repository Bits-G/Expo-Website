import { Poppins, Inter } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-heading' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata = {
  title: 'Business Opportunity, Investment & Franchise Expo 2026 | Nashik',
  description: 'Business Opportunity, Investment & Franchise Expo 2026 during Nashik Kumbh Mela. Register as visitor or book your stall today.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-body bg-bg`}>
        {children}
      </body>
    </html>
  )
}
