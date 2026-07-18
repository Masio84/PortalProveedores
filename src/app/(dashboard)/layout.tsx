import React from 'react'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/app/actions/user'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import PageTransition from '@/components/PageTransition'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const profile = await getUserProfile()

  if (!profile) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar (Mobile and Desktop) */}
      <Sidebar 
        rol={profile.rol} 
        email={profile.email} 
        tipoContratacion={profile.tipo_contratacion} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:ml-72 min-h-screen overflow-x-hidden">
        
        {/* Top Navbar */}
        <Header email={profile.email} />

        {/* Dynamic Page Content with Transitions */}
        <main className="flex-1 p-6 md:p-8 flex flex-col">
          <PageTransition>
            {children}
          </PageTransition>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 px-8 text-center text-xs text-slate-400 font-medium">
          <p>Portal Maestro de Contrataciones - Contrataciones abiertas y eficientes</p>
        </footer>

      </div>

    </div>
  )
}
