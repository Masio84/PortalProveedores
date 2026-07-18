'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export interface UserProfile {
  id: string
  email: string
  telefono: string
  rol: string
  tipo_contratacion?: string
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient()

  // Obtener usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  // Obtener perfil público y rol
  const { data: profile, error: profileError } = await supabase
    .from('usuarios')
    .select(`
      id,
      email,
      telefono,
      roles (
        nombre
      )
    `)
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError)
    // Fallback básico con datos del usuario de Supabase Auth
    return {
      id: user.id,
      email: user.email || '',
      telefono: '',
      rol: 'privado',
    }
  }

  // Leer tipo de contratación desde la cookie
  const cookieStore = await cookies()
  const tipoContratacion = cookieStore.get('tipo_contratacion')?.value || 'publica'

  // Tipar respuesta
  const rawProfile = profile as any
  const rolNombre = rawProfile.roles?.nombre || 'privado'

  return {
    id: profile.id,
    email: profile.email,
    telefono: profile.telefono,
    rol: rolNombre,
    tipo_contratacion: tipoContratacion,
  }
}
