'use client'

import React from 'react'
import { Bell, Search, UserCircle, Settings } from 'lucide-react'

interface HeaderProps {
  email: string
}

export default function Header({ email }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-25 shadow-sm shadow-slate-100/50">
      
      {/* Sección izquierda: Buscador o Título general */}
      <div className="flex items-center gap-3 w-96 max-w-full">
        {/* Espacio para breadcrumbs o barra de búsqueda global */}
        <div className="text-slate-400 text-sm font-medium hidden sm:block">
          Portal Maestro de Contrataciones · Módulo Sourcing
        </div>
      </div>

      {/* Sección derecha: Notificaciones, ajustes e info usuario */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-brand rounded-xl transition-colors cursor-pointer relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        {/* Ajustes */}
        <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-brand rounded-xl transition-colors cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>

        {/* Línea Divisora */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Perfil Corto */}
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-brand" />
          <span className="text-xs text-slate-600 font-semibold hidden md:inline-block max-w-[150px] truncate">
            {email}
          </span>
        </div>
      </div>

    </header>
  )
}
