'use server'

import { createClient } from '@/utils/supabase/server'

export interface Categoria {
  id: string
  codigo: string
  nombre: string
}

export async function getCategorias(nivel: '1' | '2' | '3', parentId?: string): Promise<Categoria[]> {
  const supabase = await createClient()

  try {
    if (nivel === '1') {
      const { data, error } = await supabase
        .from('categorias_nivel_1')
        .select('codigo, nombre')
        .eq('activo', true)
        .order('codigo')
      
      if (error) throw error
      return (data || []).map(d => ({ id: d.codigo, codigo: d.codigo, nombre: d.nombre }))
    } 
    
    if (nivel === '2') {
      if (!parentId) return []
      const { data, error } = await supabase
        .from('categorias_nivel_2')
        .select('codigo, nombre')
        .eq('nivel_1_codigo', parentId)
        .eq('activo', true)
        .order('codigo')

      if (error) throw error
      return (data || []).map(d => ({ id: d.codigo, codigo: d.codigo, nombre: d.nombre }))
    }

    if (nivel === '3') {
      if (!parentId) return []
      const { data, error } = await supabase
        .from('categorias_nivel_3')
        .select('codigo, nombre')
        .eq('nivel_2_codigo', parentId)
        .eq('activo', true)
        .order('codigo')

      if (error) throw error
      return (data || []).map(d => ({ id: d.codigo, codigo: d.codigo, nombre: d.nombre }))
    }

    return []
  } catch (err) {
    console.error('Error fetching categories:', err)
    return []
  }
}
