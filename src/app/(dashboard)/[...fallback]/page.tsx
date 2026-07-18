import React from 'react'
import { Info, HelpCircle } from 'lucide-react'

interface FallbackPageProps {
  params: Promise<{ fallback: string[] }>
}

export default async function FallbackPage({ params }: FallbackPageProps) {
  const resolvedParams = await params
  const segment = resolvedParams.fallback[0] || ''

  const getModuloName = (slug: string) => {
    switch (slug) {
      case 'automatizacion': return 'Automatización'
      case 'legal': return 'Módulo Legal'
      case 'financiamiento': return 'Financiamiento y Créditos'
      case 'business-intelligence': return 'Business Intelligence'
      case 'capacitacion': return 'Capacitación y Cursos'
      case 'compliance': return 'Compliance y Cumplimiento'
      case 'marketplace': return 'Market Place'
      case 'bienestar': return 'Bienestar y Protección'
      case 'consultar': return 'Consultar Licitaciones'
      case 'notificaciones': return 'Notificaciones'
      case 'sourcing': return 'Módulo Sourcing'
      default: return slug.charAt(0).toUpperCase() + slug.slice(1)
    }
  }

  const moduleName = getModuloName(segment)

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
      <div className="glass-panel p-8 sm:p-10 rounded-[32px] text-center max-w-md shadow-sm space-y-4">
        <div className="inline-flex p-4 bg-blue-50 text-brand rounded-full ring-8 ring-blue-50/20">
          <HelpCircle className="w-10 h-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-brand">{moduleName}</h2>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            Módulo en construcción. Próximamente se integrarán las funcionalidades correspondientes para este apartado.
          </p>
        </div>
      </div>
    </div>
  )
}
