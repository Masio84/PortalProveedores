'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, ConciergeBell, Gavel, Coins, PieChart, 
  Presentation, ShieldAlert, Store, Heart, User, 
  Bell, LogOut, Menu, X, ChevronRight, UserCircle 
} from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface MenuItem {
  nombre: string
  icono: React.ComponentType<{ className?: string }>
  path: string
}

interface SidebarProps {
  rol: string
  email: string
  tipoContratacion?: string
}

export default function Sidebar({ rol, email, tipoContratacion }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Definir links por rol
  const getMenuItems = (): MenuItem[] => {
    switch (rol) {
      case 'Ofertante':
        return [
          { nombre: 'Sourcing', icono: Search, path: '/perfil' },
          { nombre: 'Automatización', icono: Search, path: '/automatizacion' },
          { nombre: 'Concierge', icono: ConciergeBell, path: '/concierge' },
          { nombre: 'Legal', icono: Gavel, path: '/legal' },
          { nombre: 'Financiamiento', icono: Coins, path: '/financiamiento' },
          { nombre: 'Business Intelligence', icono: PieChart, path: '/business-intelligence' },
          { nombre: 'Capacitación', icono: Presentation, path: '/capacitacion' },
          { nombre: 'Compliance', icono: ShieldAlert, path: '/compliance' },
          { nombre: 'Market Place', icono: Store, path: '/marketplace' },
          { nombre: 'Bienestar y Protección', icono: Heart, path: '/bienestar' }
        ]
      case 'institucion_publica':
        return [
          { nombre: 'Sourcing', icono: Search, path: '/perfil' },
          { nombre: 'Automatización', icono: Search, path: '/automatizacion' },
          { nombre: 'Concierge', icono: ConciergeBell, path: '/concierge' },
          { nombre: 'Financiamiento', icono: Coins, path: '/financiamiento' },
          { nombre: 'Business Intelligence', icono: PieChart, path: '/business-intelligence' },
          { nombre: 'Capacitación', icono: Presentation, path: '/capacitacion' },
          { nombre: 'Compliance', icono: ShieldAlert, path: '/compliance' },
          { nombre: 'Market Place', icono: Store, path: '/marketplace' },
          { nombre: 'Bienestar y Protección', icono: Heart, path: '/bienestar' }
        ]
      case 'privado':
      default:
        return [
          { nombre: 'Mi Perfil', icono: User, path: '/perfil' },
          { nombre: 'Consultar Licitaciones', icono: Search, path: '/consultar' },
          { nombre: 'Notificaciones', icono: Bell, path: '/notificaciones' },
          { nombre: 'Sourcing', icono: Search, path: '/sourcing' },
          { nombre: 'Automatización', icono: Search, path: '/automatizacion' },
          { nombre: 'Financiamiento', icono: Coins, path: '/financiamiento' },
          { nombre: 'Compliance', icono: ShieldAlert, path: '/compliance' },
          { nombre: 'Capacitación', icono: Presentation, path: '/capacitacion' },
          { nombre: 'Market Place', icono: Store, path: '/marketplace' }
        ]
    }
  }

  const items = getMenuItems()

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout()
    }
  }

  const getRolText = () => {
    switch (rol) {
      case 'Ofertante': return 'Ofertante'
      case 'institucion_publica': return 'Institución Pública'
      case 'privado': return 'Usuario Privado'
      default: return rol
    }
  }

  return (
    <>
      {/* Botón flotante para menú móvil */}
      <div className="sm:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 bg-brand text-white rounded-xl shadow-lg hover:bg-brand-strong transition-colors cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar fijo para pantallas grandes */}
      <aside className="hidden sm:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 shadow-xl shadow-slate-200/40 z-30 overflow-y-auto">
        
        {/* Encabezado Logo */}
        <div className="p-6 border-b border-slate-100 flex flex-col gap-2">
          <Link href="/perfil" className="flex items-center gap-2">
            <Store className="w-8 h-8 text-brand" />
            <div>
              <span className="font-extrabold text-brand text-lg block leading-none">
                Sourcing
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block mt-1">
                Portal de Proveedores
              </span>
            </div>
          </Link>
        </div>

        {/* Info Usuario Sidebar */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
            <UserCircle className="w-5 h-5 text-brand" />
            <span>{getRolText()}</span>
          </div>
          <div className="text-xs text-slate-400 truncate font-medium">
            {email}
          </div>
          {tipoContratacion && (
            <span className="inline-block self-start text-[10px] bg-blue-50 text-brand font-semibold px-2 py-0.5 rounded-full border border-blue-100 uppercase mt-1">
              {tipoContratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
            </span>
          )}
        </div>

        {/* Links del Menú */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {items.map((item) => {
            const Icon = item.icono
            const active = pathname === item.path
            return (
              <Link key={item.nombre} href={item.path} className="block relative group">
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-r"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active 
                      ? 'bg-blue-50/80 text-brand font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-brand' : 'text-slate-400 group-hover:text-brand'}`} />
                  <span className="flex-1">{item.nombre}</span>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'text-brand' : 'text-slate-400'}`} />
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Sidebar móvil (Slide-in) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="sm:hidden fixed inset-0 bg-black z-40"
            />
            
            {/* Cajón lateral */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="sm:hidden fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col h-screen overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Store className="w-8 h-8 text-brand" />
                  <span className="font-extrabold text-brand text-lg leading-none">
                    Sourcing
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Info Usuario Sidebar móvil */}
              <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                  <UserCircle className="w-5 h-5 text-brand" />
                  <span>{getRolText()}</span>
                </div>
                <div className="text-xs text-slate-400 truncate font-medium">
                  {email}
                </div>
                {tipoContratacion && (
                  <span className="inline-block self-start text-[10px] bg-blue-50 text-brand font-semibold px-2 py-0.5 rounded-full border border-blue-100 uppercase mt-1">
                    {tipoContratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
                  </span>
                )}
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1">
                {items.map((item) => {
                  const Icon = item.icono
                  const active = pathname === item.path
                  return (
                    <Link
                      key={item.nombre}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active 
                          ? 'bg-blue-50/80 text-brand font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-brand' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.nombre}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
