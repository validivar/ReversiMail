import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'

export const metadata = {
  title: 'ReversiMail – AI Email Assistant',
  description: 'Step‑up auth gated by the reversibility spectrum',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}