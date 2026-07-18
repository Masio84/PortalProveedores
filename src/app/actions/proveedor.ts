'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  sanitizeText,
  isValidEmail,
  isValidTelefono,
  isValidRFC,
  isValidCURP,
  isValidINE,
  isValidCLABE,
  isValidCP,
  isValidPorcentaje
} from '@/utils/validation'

// Interfaces
export interface ProveedorData {
  id?: number
  user_id?: string
  tipo_proveedor: 'fisica_empresarial' | 'moral' | 'general'
  rfc: string
  razon_social: string
  nombre_comercial?: string | null
  descripcion_actividad?: string | null
  palabras_clave?: string | null
  regimen_fiscal: string
  nombre_vialidad?: string | null
  num_exterior?: string | null
  num_interior?: string | null
  colonia?: string | null
  localidad?: string | null
  codigo_postal?: string | null
  ciudad?: string | null
  estado?: string | null
  telefono?: string | null
  extension?: string | null
  fax?: string | null
  fax_extension?: string | null
  representante_legal?: string | null
  email: string
  banco?: string | null
  sucursal_bancaria?: string | null
  cuenta_bancaria?: string | null
  clabe_interbancaria?: string | null
  objeto_social?: string | null
  num_acta_constitutiva?: string | null
  fecha_acta_constitutiva?: string | null
  num_notario_acta?: string | null
  nombre_notario_acta?: string | null
  ciudad_acta?: string | null
  folio_mercantil?: string | null
  fecha_registro_acta?: string | null
  poder_notarial_num?: string | null
  poder_notarial_fecha?: string | null
  poder_notarial_notario_num?: string | null
  poder_notarial_notario_nombre?: string | null
  poder_notarial_ciudad?: string | null
  poder_notarial_folio?: string | null
  poder_notarial_fecha_registro?: string | null
  apoderados?: string | null
  categoria_nivel_1?: string | null
  categoria_nivel_2?: string | null
  categoria_nivel_3?: string | null
}

export interface AccionistaData {
  id?: number
  proveedor_id: number
  nombre_completo: string
  curp: string
  ine: string
  fecha_alta: string
  fecha_baja?: string | null
  porcentaje_participacion: number
}

export interface ApoderadoData {
  id?: number
  proveedor_id: number
  nombre_completo: string
  curp: string
  ine: string
  fecha_alta: string
  fecha_baja?: string | null
}

export interface ActividadData {
  id?: number
  proveedor_id?: number
  actividad: string
  porcentaje: number
  fecha_inicio: string
}

// 1. Obtener Proveedor por Usuario y Tipo
export async function getProveedor(tipo: 'fisica_empresarial' | 'moral' | 'general'): Promise<ProveedorData | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .eq('user_id', user.id)
    .eq('tipo_proveedor', tipo)
    .maybeSingle()

  if (error) {
    console.error('Error fetching proveedor:', error)
    return null
  }

  return data as ProveedorData | null
}

// 2. Guardar/Actualizar Proveedor
export async function saveProveedor(tipo: 'fisica_empresarial' | 'moral' | 'general', data: Partial<ProveedorData>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'No autenticado' }
  }

  // Limpiar campos vacíos a null y sanitizar
  const cleanedData: any = { ...data }
  Object.keys(cleanedData).forEach((key) => {
    if (cleanedData[key] === '') {
      cleanedData[key] = null
    } else if (typeof cleanedData[key] === 'string') {
      cleanedData[key] = sanitizeText(cleanedData[key])
    }
  })

  // Validaciones estrictas
  if (cleanedData.rfc) {
    if (!isValidRFC(cleanedData.rfc)) {
      return { success: false, error: 'Formato de RFC inválido (debe tener 12 o 13 caracteres estructurados)' }
    }
    cleanedData.rfc = cleanedData.rfc.toUpperCase()
  }

  if (cleanedData.email) {
    if (!isValidEmail(cleanedData.email)) {
      return { success: false, error: 'Formato de correo electrónico inválido' }
    }
  }

  if (cleanedData.telefono) {
    if (!isValidTelefono(cleanedData.telefono)) {
      return { success: false, error: 'El teléfono debe tener exactamente 10 dígitos numéricos' }
    }
  }

  if (cleanedData.clabe_interbancaria) {
    if (!isValidCLABE(cleanedData.clabe_interbancaria)) {
      return { success: false, error: 'La CLABE interbancaria debe tener exactamente 18 dígitos numéricos' }
    }
  }

  if (cleanedData.codigo_postal) {
    if (!isValidCP(cleanedData.codigo_postal)) {
      return { success: false, error: 'El Código Postal debe tener exactamente 5 dígitos numéricos' }
    }
  }

  // Asegurar llaves consistentes
  cleanedData.user_id = user.id
  cleanedData.tipo_proveedor = tipo

  // Remover id si existe para evitar conflictos de auto_increment en inserciones
  delete cleanedData.id

  const { data: existing } = await supabase
    .from('proveedores')
    .select('id')
    .eq('user_id', user.id)
    .eq('tipo_proveedor', tipo)
    .maybeSingle()

  let result
  if (existing) {
    result = await supabase
      .from('proveedores')
      .update(cleanedData)
      .eq('id', existing.id)
      .select('id')
      .single()
  } else {
    result = await supabase
      .from('proveedores')
      .insert(cleanedData)
      .select('id')
      .single()
  }

  if (result.error) {
    console.error('Error saving proveedor:', result.error)
    return { success: false, error: result.error.message }
  }

  revalidatePath('/perfil')
  return { success: true, proveedorId: result.data.id, message: 'Datos de proveedor guardados con éxito' }
}

// 3. Obtener Accionistas de un Proveedor
export async function getAccionistas(proveedorId: number): Promise<AccionistaData[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('accionistas')
    .select('*')
    .eq('proveedor_id', proveedorId)
    .order('id')

  if (error) {
    console.error('Error fetching accionistas:', error)
    return []
  }

  return data as AccionistaData[]
}

// 4. Guardar Accionista (Insert/Update)
export async function saveAccionista(data: AccionistaData) {
  const supabase = await createClient()

  // Sanitizar entradas
  const nombre_completo = sanitizeText(data.nombre_completo)
  const curp = sanitizeText(data.curp).toUpperCase()
  const ine = sanitizeText(data.ine).toUpperCase()
  const fecha_alta = sanitizeText(data.fecha_alta)
  const porcentaje_participacion = Number(data.porcentaje_participacion)

  // Validaciones
  if (!data.proveedor_id || !nombre_completo || !curp || !ine) {
    return { success: false, error: 'Todos los campos son obligatorios' }
  }

  if (!isValidCURP(curp)) {
    return { success: false, error: 'Formato de CURP inválido (debe tener exactamente 18 caracteres estructurados)' }
  }

  if (!isValidINE(ine)) {
    return { success: false, error: 'Formato de clave de elector INE inválido (debe tener exactamente 18 caracteres alfanuméricos)' }
  }

  if (!isValidPorcentaje(porcentaje_participacion)) {
    return { success: false, error: 'El porcentaje debe estar entre 0 y 100' }
  }

  // Verificar unicidad de CURP e INE en activos (sin fecha_baja)
  const query = supabase
    .from('accionistas')
    .select('id')
    .is('fecha_baja', null) // filter only active ones
    .or(`curp.eq.${curp},ine.eq.${ine}`)

  if (data.id) {
    query.neq('id', data.id)
  }

  const { data: dups, error: checkError } = await query

  const activeDups = dups || []
  if (activeDups.length > 0) {
    return { success: false, error: 'La CURP o el número de INE ya están registrados en un accionista activo' }
  }

  const payload = {
    proveedor_id: data.proveedor_id,
    nombre_completo,
    curp,
    ine,
    fecha_alta: data.fecha_alta ? sanitizeText(data.fecha_alta) : null,
    porcentaje_participacion
  }

  let result
  if (data.id && data.id > 0) {
    result = await supabase
      .from('accionistas')
      .update(payload)
      .eq('id', data.id)
  } else {
    result = await supabase
      .from('accionistas')
      .insert(payload)
  }

  if (result.error) {
    return { success: false, error: result.error.message }
  }

  revalidatePath('/perfil')
  return { success: true, message: data.id ? 'Accionista actualizado' : 'Accionista agregado' }
}

// 5. Baja Lógica de Accionista (Delete lógico)
export async function deleteAccionista(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('accionistas')
    .update({ fecha_baja: new Date().toISOString().split('T')[0] })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/perfil')
  return { success: true, message: 'Accionista dado de baja lógica correctamente' }
}

// 6. Obtener Apoderados Legales
export async function getApoderados(proveedorId: number): Promise<ApoderadoData[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('apoderados_legales')
    .select('*')
    .eq('proveedor_id', proveedorId)
    .order('id')

  if (error) {
    console.error('Error fetching apoderados:', error)
    return []
  }

  return data as ApoderadoData[]
}

// 7. Guardar Apoderado
export async function saveApoderado(data: ApoderadoData) {
  const supabase = await createClient()

  // Sanitizar entradas
  const nombre_completo = sanitizeText(data.nombre_completo)
  const curp = sanitizeText(data.curp).toUpperCase()
  const ine = sanitizeText(data.ine).toUpperCase()
  const fecha_alta = sanitizeText(data.fecha_alta)

  if (!data.proveedor_id || !nombre_completo || !curp || !ine) {
    return { success: false, error: 'Todos los campos son obligatorios' }
  }

  if (!isValidCURP(curp)) {
    return { success: false, error: 'Formato de CURP inválido (debe tener exactamente 18 caracteres estructurados)' }
  }

  if (!isValidINE(ine)) {
    return { success: false, error: 'Formato de clave de elector INE inválido (debe tener exactamente 18 caracteres alfanuméricos)' }
  }

  const payload = {
    proveedor_id: data.proveedor_id,
    nombre_completo,
    curp,
    ine,
    fecha_alta
  }

  let result
  if (data.id && data.id > 0) {
    result = await supabase
      .from('apoderados_legales')
      .update(payload)
      .eq('id', data.id)
  } else {
    result = await supabase
      .from('apoderados_legales')
      .insert(payload)
  }

  if (result.error) {
    return { success: false, error: result.error.message }
  }

  revalidatePath('/perfil')
  return { success: true, message: data.id ? 'Apoderado actualizado' : 'Apoderado agregado' }
}

// 8. Baja Lógica de Apoderado
export async function deleteApoderado(id: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('apoderados_legales')
    .update({ fecha_baja: new Date().toISOString().split('T')[0] })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/perfil')
  return { success: true, message: 'Apoderado dado de baja' }
}

// 9. Obtener Actividades Económicas
export async function getActividades(proveedorId: number): Promise<ActividadData[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('actividades_economicas')
    .select('*')
    .eq('proveedor_id', proveedorId)
    .order('id')

  if (error) {
    console.error('Error fetching actividades:', error)
    return []
  }

  return data as ActividadData[]
}

// 10. Sincronizar Actividades Económicas (Delete y Re-insertar)
export async function saveActividades(proveedorId: number, actividades: ActividadData[]) {
  const supabase = await createClient()

  // Eliminar actividades existentes
  const { error: deleteError } = await supabase
    .from('actividades_economicas')
    .delete()
    .eq('proveedor_id', proveedorId)

  if (deleteError) {
    console.error('Error deleting activities:', deleteError)
    return { success: false, error: deleteError.message }
  }

  // Filtrar vacíos, sanitizar y validar
  const validActs = []
  for (const act of actividades) {
    if (!act.actividad || act.actividad.trim() === '' || !act.fecha_inicio) continue

    const actividadSanitized = sanitizeText(act.actividad)
    const porcentajeNum = Number(act.porcentaje) || 0

    if (!isValidPorcentaje(porcentajeNum)) {
      return { success: false, error: 'El porcentaje de participación de cada actividad debe estar entre 0 y 100' }
    }

    validActs.push({
      proveedor_id: proveedorId,
      actividad: actividadSanitized,
      porcentaje: porcentajeNum,
      fecha_inicio: sanitizeText(act.fecha_inicio)
    })
  }

  if (validActs.length === 0) {
    revalidatePath('/perfil')
    return { success: true, message: 'Actividades vaciadas correctamente' }
  }

  // Insertar nuevas actividades
  const { error: insertError } = await supabase
    .from('actividades_economicas')
    .insert(validActs)

  if (insertError) {
    console.error('Error inserting activities:', insertError)
    return { success: false, error: insertError.message }
  }

  revalidatePath('/perfil')
  return { success: true, message: 'Actividades guardadas correctamente' }
}
