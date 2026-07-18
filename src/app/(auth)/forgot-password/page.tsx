'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Mail, Lock, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { resetPasswordForEmail, updatePassword } from '@/app/actions/auth'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [action, setAction] = useState<'check_email' | 'update_password'>('check_email')
  
  // Paso 1: Verificar correo
  const [email, setEmail] = useState('')
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  // Paso 2: Actualizar contraseña
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // Generar captcha matemático
  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1)
    setNum2(Math.floor(Math.random() * 9) + 1)
    setCaptchaAnswer('')
  }

  useEffect(() => {
    generateCaptcha()

    // Detectar si venimos de un enlace de recuperación de Supabase
    // Supabase coloca tokens en el hash del URL al hacer clic en el correo
    const hash = window.location.hash
    if (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) {
      setAction('update_password')
    }
    
    // Opcional: checar query params si el middleware redirige
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'update_password' || params.get('type') === 'recovery') {
      setAction('update_password')
    }
  }, [])

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !captchaAnswer) {
      setError('Por favor completa todos los campos')
      return
    }

    if (parseInt(captchaAnswer) !== num1 + num2) {
      setError('Captcha incorrecto. Inténtalo de nuevo.')
      generateCaptcha()
      return
    }

    setEmailLoading(true)

    try {
      const res = await resetPasswordForEmail(email)
      if (res.success) {
        setEmailSuccess(true)
        setError(null)
      } else {
        setError(res.error || 'El correo no está registrado en el sistema')
        generateCaptcha()
      }
    } catch (err) {
      setError('Error al procesar la solicitud')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setUpdateLoading(true)

    try {
      const res = await updatePassword(newPassword)
      if (res.success) {
        setUpdateSuccess(true)
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setError(res.error || 'Error al actualizar la contraseña')
      }
    } catch (err) {
      setError('Error al procesar la solicitud')
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand to-brand-strong p-4 overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        
        <div className="glass-card rounded-[32px] overflow-hidden p-8 sm:p-10 relative">
          <AnimatePresence mode="wait">
            
            {/* PASO 1: Ingreso de correo y Captcha */}
            {action === 'check_email' && (
              <motion.div
                key="check_email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex p-4 bg-blue-50 text-brand rounded-full mb-4 ring-8 ring-blue-50/30">
                    <KeyRound className="w-10 h-10" />
                  </div>
                  <h2 className="text-brand font-bold text-2xl tracking-tight">
                    ¿Olvidaste tu contraseña?
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    Te enviaremos un enlace de recuperación seguro
                  </p>
                </div>

                {emailSuccess ? (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="space-y-4 text-center"
                  >
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm p-4 rounded-2xl font-medium">
                      Enlace de recuperación enviado con éxito a <strong>{email}</strong> a través de Resend. Revisa tu bandeja de entrada.
                    </div>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-brand hover:underline font-semibold text-sm cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Volver al Login
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCheckEmail} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand" />
                        Correo registrado
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

                    {/* Captcha Matemático */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-slate-700 font-medium text-sm">
                          Verificación de seguridad
                        </label>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="text-brand hover:text-brand-strong transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Nuevo captcha
                        </button>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl px-5 py-3 text-brand font-bold text-lg select-none tracking-widest text-center shadow-inner">
                          {num1} + {num2} = ?
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Resultado"
                          value={captchaAnswer}
                          onChange={(e) => setCaptchaAnswer(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm text-center font-bold"
                        />
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
                      disabled={emailLoading}
                      className="w-full bg-brand text-white py-4 px-6 rounded-2xl font-semibold hover:bg-brand-strong shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {emailLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        'Enviar correo'
                      )}
                    </button>
                    
                    <div className="text-center pt-2">
                      <Link
                        href="/login"
                        className="text-brand hover:underline font-semibold flex items-center justify-center gap-1.5 text-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio de sesión
                      </Link>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* PASO 2: Restablecer Contraseña */}
            {action === 'update_password' && (
              <motion.div
                key="update_password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4 ring-8 ring-emerald-50/30">
                    <Lock className="w-10 h-10" />
                  </div>
                  <h2 className="text-brand font-bold text-2xl tracking-tight">
                    Nueva Contraseña
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    Establece tu nueva contraseña de acceso
                  </p>
                </div>

                {updateSuccess ? (
                  <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-sm p-4 rounded-2xl text-center font-medium">
                    Contraseña actualizada correctamente. Redirigiendo al Login...
                  </div>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-brand" />
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-medium text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4 text-brand" />
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repite la contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all text-sm"
                      />
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
                      disabled={updateLoading}
                      className="w-full bg-brand text-white py-4 px-6 rounded-2xl font-semibold hover:bg-brand-strong shadow-lg shadow-brand/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {updateLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        'Guardar Contraseña'
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </main>
  )
}
