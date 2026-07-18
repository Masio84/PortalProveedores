'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, Phone, ArrowLeft, Loader2, Award } from 'lucide-react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !telefono || !tipoUsuario) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!/^\d{10}$/.test(telefono)) {
      setError('El teléfono debe contener exactamente 10 dígitos numéricos')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('telefono', telefono)
    formData.append('tipo_usuario', tipoUsuario)

    try {
      const res = await signup(formData)
      if (res.success) {
        setSuccess(res.message || 'Registro exitoso! Redirigiendo al login...')
        setEmail('')
        setPassword('')
        setTelefono('')
        setTipoUsuario('')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setError(res.error || 'Error al registrar el usuario')
        setLoading(false)
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand to-brand-strong p-4 overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        
        {/* Card Contenedora con efecto Glassmorphism */}
        <div className="glass-card rounded-[32px] overflow-hidden p-8 sm:p-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4 ring-8 ring-emerald-50/30">
                <UserPlus className="w-10 h-10" />
              </div>
              <h2 className="text-brand font-bold text-2xl tracking-tight">
                Crear una Cuenta
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Portal Maestro de Contrataciones
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand" />
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand" />
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand" />
                  Teléfono de contacto
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10 dígitos numéricos"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand" />
                  Tipo de usuario
                </label>
                <select
                  required
                  value={tipoUsuario}
                  onChange={(e) => setTipoUsuario(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230b3b5b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                >
                  <option value="" disabled>Selecciona un tipo</option>
                  <option value="Ofertante">Ofertante</option>
                  <option value="institucion_publica">Institución Pública</option>
                </select>
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

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm p-3.5 rounded-xl text-center font-medium"
                >
                  {success}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registrando cuenta...
                  </>
                ) : (
                  'Registrarse'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="text-brand hover:underline font-semibold flex items-center justify-center gap-1.5 text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </main>
  )
}
