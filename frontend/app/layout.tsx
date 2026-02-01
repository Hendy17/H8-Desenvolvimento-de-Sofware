
import type { Metadata } from 'next'

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
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}