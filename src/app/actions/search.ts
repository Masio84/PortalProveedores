'use server'

import { createClient } from '@/utils/supabase/server'

export interface SearchResult {
  id: number
  razon_social: string
  nombre_comercial?: string
  descripcion_actividad?: string
  palabras_clave?: string
  tipo_proveedor: 'fisica_empresarial' | 'moral' | 'general'
  email: string
  telefono?: string
  rol: string
  nivel1_codigo?: string
  nivel1_nombre?: string
  nivel2_codigo?: string
  nivel2_nombre?: string
  nivel3_codigo?: string
  nivel3_nombre?: string
  categoria_texto?: string
}

export async function searchProveedores(
  query: string,
  nivel1: string,
  nivel2: string,
  nivel3: string
): Promise<{ success: boolean; data: SearchResult[]; error?: string }> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('search_proveedores', {
      p_query: query.trim(),
      p_nivel1: nivel1.trim(),
      p_nivel2: nivel2.trim(),
      p_nivel3: nivel3.trim()
    })

    if (error) {
      console.error('Error in search RPC:', error)
      return { success: false, data: [], error: error.message }
    }

    return { success: true, data: (data || []) as SearchResult[] }
  } catch (err: any) {
    console.error('Search error:', err)
    return { success: false, data: [], error: err.message || 'Error en la búsqueda' }
  }
}
