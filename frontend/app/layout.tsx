import type { Metadata } from 'next'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Sistema de Contabilidade',
  description: 'Sistema de gestão contábil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MantineProvider 
          defaultColorScheme="light"
          theme={{
            primaryColor: 'blue',
            fontFamily: 'Inter, system-ui, sans-serif',
            headings: { fontFamily: 'Inter, system-ui, sans-serif' },
          }}
        >
          <ColorSchemeScript defaultColorScheme="light" />
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}