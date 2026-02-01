'use client'
import { Suspense } from 'react'
import { Loader, Center } from '@mantine/core'
import { ClientDashboardComponent } from '../../components/cliente/ClientDashboardComponent'
import { useClienteDashboard } from '../../hooks/cliente/useClienteDashboard'

function ClientePageContent() {
  const dashboardProps = useClienteDashboard()
  
  return <ClientDashboardComponent {...dashboardProps} />
}

export default function ClientePage() {
  return (
    <Suspense fallback={
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" />
      </Center>
    }>
      <ClientePageContent />
    </Suspense>
  )
}