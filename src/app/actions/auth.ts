'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { loginRateLimiter } from '@/utils/rateLimit'
import { sanitizeText, isValidEmail, isValidTelefono } from '@/utils/validation'

export async function login(formData: FormData) {
  const emailRaw = formData.get('email') as string
  const passwordRaw = formData.get('password') as string
  const tipoContratacionRaw = formData.get('tipo_contratacion') as string

  // Sanitizar entradas
  const email = sanitizeText(emailRaw)
  const password = sanitizeText(passwordRaw)
  const tipoContratacion = sanitizeText(tipoContratacionRaw)
  
  if (!email || !password) {
    return { success: false, error: 'Correo y contraseña requeridos' }
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Formato de correo electrónico inválido' }
  }

  // Obtener IP del cliente para el limitador de tasa
  const clientHeaders = await headers()
  const ip = clientHeaders.get('x-forwarded-for')?.split(',')[0].trim() || clientHeaders.get('x-real-ip') || '127.0.0.1'

  // Verificar si la IP/Email está bloqueado
  const lockoutTime = loginRateLimiter.getLockoutTimeRemaining(ip, email)
  if (lockoutTime > 0) {
    const minutes = Math.ceil(lockoutTime / 60)
    return { success: false, error: `Demasiados intentos fallidos. Bloqueado temporalmente por ${minutes} minutos.` }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const result = loginRateLimiter.registerFailure(ip, email)
    if (result.locked) {
      return { success: false, error: 'Demasiados intentos fallidos. Acceso bloqueado por 15 minutos.' }
    }
    const remaining = 5 - result.attempts
    return { success: false, error: `Credenciales inválidas. Te quedan ${remaining} intentos antes de bloquear la cuenta.` }
  }

  // Login exitoso, restablecer intentos
  loginRateLimiter.reset(ip, email)

  // Guardar tipo de contratación en una cookie para que esté disponible en Server Components
  const cookieStore = await cookies()
  cookieStore.set('tipo_contratacion', tipoContratacion || 'publica', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  })

  return { success: true }
}

export async function signup(formData: FormData) {
  const emailRaw = formData.get('email') as string
  const passwordRaw = formData.get('password') as string
  const telefonoRaw = formData.get('telefono') as string
  const tipoUsuarioRaw = formData.get('tipo_usuario') as string

  // Sanitizar entradas
  const email = sanitizeText(emailRaw)
  const password = sanitizeText(passwordRaw)
  const telefono = sanitizeText(telefonoRaw)
  const tipoUsuario = sanitizeText(tipoUsuarioRaw)

  if (!email || !password || !telefono || !tipoUsuario) {
    return { success: false, error: 'Todos los campos son obligatorios' }
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Formato de correo electrónico inválido' }
  }

  if (!isValidTelefono(telefono)) {
    return { success: false, error: 'El teléfono debe tener exactamente 10 dígitos numéricos' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        telefono,
        tipo_usuario: tipoUsuario,
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Usuario registrado correctamente. Inicia sesión.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const cookieStore = await cookies()
  cookieStore.delete('tipo_contratacion')
  
  redirect('/login')
}

export async function resetPasswordForEmail(emailRaw: string) {
  const email = sanitizeText(emailRaw)
  if (!isValidEmail(email)) {
    return { success: false, error: 'Formato de correo electrónico inválido' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/forgot-password?action=update_password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updatePassword(passwordRaw: string) {
  const password = sanitizeText(passwordRaw)
  if (password.length < 8) {
    return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' }
  }

  if (!/[A-Z]/.test(password)) {
    return { success: false, error: 'La contraseña debe contener al menos una letra mayúscula' }
  }

  if (!/[0-9]/.test(password)) {
    return { success: false, error: 'La contraseña debe contener al menos un número' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
