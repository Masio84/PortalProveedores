'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, User, Lock, ArrowLeft, UserPlus, Eye, EyeOff, Loader2, FileText } from 'lucide-react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [tipoContratacion, setTipoContratacion] = useState<'publica' | 'privada'>('publica')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectTipo = (tipo: 'publica' | 'privada') => {
    setTipoContratacion(tipo)
    setStep(2)
    setError(null)
  }

  const handleVolver = () => {
    setStep(1)
    setPassword('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('tipo_contratacion', tipoContratacion)

    try {
      const res = await login(formData)
      if (res.success) {
        window.location.href = '/perfil'
      } else {
        setError(res.error || 'Credenciales inválidas')
        setLoading(false)
      }
    } catch (err) {
      setError('Error de conexión al servidor')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand to-brand-strong p-4 overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        
        {/* Card Contenedora con efecto Glassmorphism */}
        <div className="glass-card rounded-[32px] overflow-hidden p-8 sm:p-10 relative">
          
          <AnimatePresence mode="wait">
            
            {/* PASO 1: Selección de Tipo de Contratación */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-blue-50 text-brand rounded-full mb-4 ring-8 ring-blue-50/30">
                    <Store className="w-10 h-10" />
                  </div>
                  <h2 className="text-brand font-bold text-2xl tracking-tight">
                    Portal Maestro de Contrataciones
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    ¿Qué tipo de contratación te interesa?
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleSelectTipo('publica')}
                    className="w-full bg-brand text-white py-4 px-6 rounded-2xl font-semibold hover:bg-brand-strong shadow-lg shadow-brand/20 active:scale-[0.98] transition-all cursor-pointer text-center text-base uppercase tracking-wider"
                  >
                    Contratación Pública
                  </button>
                  
                  <button
                    onClick={() => handleSelectTipo('privada')}
                    className="w-full bg-brand-medium text-white py-4 px-6 rounded-2xl font-semibold hover:bg-brand-strong shadow-lg shadow-brand-medium/20 active:scale-[0.98] transition-all cursor-pointer text-center text-base uppercase tracking-wider"
                  >
                    Contratación Privada
                  </button>

                  <div className="w-full h-px bg-slate-200/80 my-4" />

                  <Link
                    href="/register"
                    className="w-full bg-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider"
                  >
                    <UserPlus className="w-5 h-5" />
                    ¿Nuevo usuario? Regístrate
                  </Link>
                </div>
              </motion.div>
            )}

            {/* PASO 2: Formulario de Login */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 bg-blue-50 text-brand rounded-full mb-4 ring-8 ring-blue-50/30">
                    <Store className="w-10 h-10" />
                  </div>
                  <h2 className="text-brand font-bold text-2xl tracking-tight">
                    Portal Maestro de Contrataciones
                  </h2>
                  <span className="inline-block bg-blue-100/70 text-brand font-semibold text-xs uppercase px-3 py-1 rounded-full mt-2 border border-blue-200">
                    {tipoContratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-brand" />
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-brand" />
                        Contraseña
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-brand hover:underline font-semibold"
                      >
                        ¿La olvidaste?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-4 pr-12 py-3.5 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 text-red-600 border border-red-200 text-sm p-3.5 rounded-xl text-center font-medium"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand text-white py-4 px-6 rounded-2xl font-semibold hover:bg-brand-strong shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar sesión'
                    )}
                  </button>
                </form>

                <div className="flex justify-between items-center mt-6 text-sm">
                  <button
                    onClick={handleVolver}
                    className="text-brand hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cambiar tipo
                  </button>
                  <Link
                    href="/register"
                    className="text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    Registrarse
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer del login */}
        <div className="text-center mt-8 text-xs text-white/70">
          <p>Portal Maestro de Contrataciones - Contrataciones abiertas y eficientes</p>
        </div>

      </div>
    </main>
  )
}
