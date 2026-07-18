'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const tipoContratacion = formData.get('tipo_contratacion') as string
  
  if (!email || !password) {
    return { success: false, error: 'Correo y contraseña requeridos' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Guardar tipo de contratación en una cookie para que esté disponible en Server Components
  const cookieStore = await cookies()
  cookieStore.set('tipo_contratacion', tipoContratacion || 'publica', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 semana
  })

  return { success: true }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const telefono = formData.get('telefono') as string
  const tipoUsuario = formData.get('tipo_usuario') as string

  if (!email || !password || !telefono || !tipoUsuario) {
    return { success: false, error: 'Todos los campos son obligatorios' }
  }

  if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
    return { success: false, error: 'El teléfono debe tener 10 dígitos numéricos' }
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

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/forgot-password?action=update_password`,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updatePassword(password: string) {
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
