'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building, User, ShieldCheck, MapPin, Landmark, Phone, Mail, 
  Plus, Trash2, Edit2, AlertCircle, CheckCircle2, Loader2, Save, 
  HelpCircle, Calendar, Percent
} from 'lucide-react'
import { getUserProfile, UserProfile } from '@/app/actions/user'
import { 
  getProveedor, saveProveedor, ProveedorData,
  getAccionistas, saveAccionista, deleteAccionista, AccionistaData,
  getApoderados, saveApoderado, deleteApoderado, ApoderadoData,
  getActividades, saveActividades, ActividadData
} from '@/app/actions/proveedor'
import { getCategorias, Categoria } from '@/app/actions/categories'

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [tipoProveedor, setTipoProveedor] = useState<'fisica_empresarial' | 'moral' | 'general' | ''>('')
  
  // Loading and messaging states
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Main Form State
  const [formData, setFormData] = useState<Record<string, any>>({
    rfc: '', razon_social: '', nombre_comercial: '', descripcion_actividad: '', palabras_clave: '',
    regimen_fiscal: '', nombre_vialidad: '', num_exterior: '', num_interior: '', colonia: '',
    localidad: '', codigo_postal: '', ciudad: '', estado: '', telefono: '', extension: '',
    fax: '', fax_extension: '', representante_legal: '', email: '', banco: '',
    sucursal_bancaria: '', cuenta_bancaria: '', clabe_interbancaria: '', objeto_social: '',
    num_acta_constitutiva: '', fecha_acta_constitutiva: null, num_notario_acta: '',
    nombre_notario_acta: '', ciudad_acta: '', folio_mercantil: '', fecha_registro_acta: null,
    poder_notarial_num: '', poder_notarial_fecha: null, poder_notarial_notario_num: '',
    poder_notarial_notario_nombre: '', poder_notarial_ciudad: '', poder_notarial_folio: '',
    poder_notarial_fecha_registro: null, apoderados: '',
    categoria_nivel_1: '', categoria_nivel_2: '', categoria_nivel_3: ''
  })

  // Category Cascading Options
  const [catNivel1Opts, setCatNivel1Opts] = useState<Categoria[]>([])
  const [catNivel2Opts, setCatNivel2Opts] = useState<Categoria[]>([])
  const [catNivel3Opts, setCatNivel3Opts] = useState<Categoria[]>([])

  // Secondary Data Lists (Shareholders, Attorneys, Activities)
  const [actividades, setActividades] = useState<ActividadData[]>([])
  const [accionistas, setAccionistas] = useState<AccionistaData[]>([])
  const [apoderados, setApoderados] = useState<ApoderadoData[]>([])

  // Active Provider ID in database (if saved)
  const [proveedorIdActual, setProveedorIdActual] = useState<number | null>(null)

  // Modals state
  const [showAccionistaModal, setShowAccionistaModal] = useState(false)
  const [accionistaForm, setAccionistaForm] = useState<Partial<AccionistaData>>({
    id: 0, nombre_completo: '', curp: '', ine: '', fecha_alta: '', porcentaje_participacion: 0
  })

  const [showApoderadoModal, setShowApoderadoModal] = useState(false)
  const [apoderadoForm, setApoderadoForm] = useState<Partial<ApoderadoData>>({
    id: 0, nombre_completo: '', curp: '', ine: '', fecha_alta: ''
  })

  // Load User Profile and Category Level 1
  useEffect(() => {
    async function loadInitialData() {
      try {
        const uProfile = await getUserProfile()
        setProfile(uProfile)
        
        // Cargar categorías del nivel 1
        const cats1 = await getCategorias('1')
        setCatNivel1Opts(cats1)

        if (uProfile) {
          // Determinar tipo de proveedor por rol
          if (uProfile.rol === 'institucion_publica' || uProfile.rol === 'privado') {
            setTipoProveedor('general')
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProfile(false)
      }
    }
    loadInitialData()
  }, [])

  // Load Provider Profile when Type changes
  useEffect(() => {
    if (!tipoProveedor) return

    async function loadProveedor() {
      if (!tipoProveedor) return
      setLoadingProfile(true)
      try {
        const res = await getProveedor(tipoProveedor as any)
        if (res) {
          setProveedorIdActual(res.id || null)
          // Mapear campos vacíos a cadenas para inputs reactivos
          const mappedData: any = { ...res }
          Object.keys(mappedData).forEach(key => {
            if (mappedData[key] === null) mappedData[key] = ''
          })
          setFormData(mappedData)

          // Cargar categorías en cascada si existen guardadas
          if (res.categoria_nivel_1) {
            const cats2 = await getCategorias('2', res.categoria_nivel_1)
            setCatNivel2Opts(cats2)
          }
          if (res.categoria_nivel_2) {
            const cats3 = await getCategorias('3', res.categoria_nivel_2)
            setCatNivel3Opts(cats3)
          }

          // Cargar tablas secundarias si tiene ID
          if (res.id) {
            const acts = await getActividades(res.id)
            setActividades(acts.length > 0 ? acts : [{ actividad: '', porcentaje: 0, fecha_inicio: '' }])
            
            const accs = await getAccionistas(res.id)
            setAccionistas(accs)

            const apods = await getApoderados(res.id)
            setApoderados(apods)
          }
        } else {
          // Reset de formulario si no hay registro previo
          setProveedorIdActual(null)
          setFormData({
            rfc: '', razon_social: '', nombre_comercial: '', descripcion_actividad: '', palabras_clave: '',
            regimen_fiscal: '', nombre_vialidad: '', num_exterior: '', num_interior: '', colonia: '',
            localidad: '', codigo_postal: '', ciudad: '', estado: '', telefono: '', extension: '',
            fax: '', fax_extension: '', representante_legal: '', email: profile?.email || '', banco: '',
            sucursal_bancaria: '', cuenta_bancaria: '', clabe_interbancaria: '', objeto_social: '',
            num_acta_constitutiva: '', fecha_acta_constitutiva: null, num_notario_acta: '',
            nombre_notario_acta: '', ciudad_acta: '', folio_mercantil: '', fecha_registro_acta: null,
            poder_notarial_num: '', poder_notarial_fecha: null, poder_notarial_notario_num: '',
            poder_notarial_notario_nombre: '', poder_notarial_ciudad: '', poder_notarial_folio: '',
            poder_notarial_fecha_registro: null, apoderados: '',
            categoria_nivel_1: '', categoria_nivel_2: '', categoria_nivel_3: ''
          })
          setActividades([{ actividad: '', porcentaje: 0, fecha_inicio: '' }])
          setAccionistas([])
          setApoderados([])
          setCatNivel2Opts([])
          setCatNivel3Opts([])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProveedor()
  }, [tipoProveedor, profile])

  // Handle standard input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle category level 1 change
  const handleCatNivel1Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, categoria_nivel_1: val, categoria_nivel_2: '', categoria_nivel_3: '' }))
    setCatNivel2Opts([])
    setCatNivel3Opts([])
    if (val) {
      const cats2 = await getCategorias('2', val)
      setCatNivel2Opts(cats2)
    }
  }

  // Handle category level 2 change
  const handleCatNivel2Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, categoria_nivel_2: val, categoria_nivel_3: '' }))
    setCatNivel3Opts([])
    if (val) {
      const cats3 = await getCategorias('3', val)
      setCatNivel3Opts(cats3)
    }
  }

  // Handle category level 3 change
  const handleCatNivel3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, categoria_nivel_3: e.target.value }))
  }

  // Activities handlers
  const handleActividadChange = (index: number, field: keyof ActividadData, value: any) => {
    const newActs = [...actividades]
    newActs[index] = { ...newActs[index], [field]: value }
    setActividades(newActs)
  }

  const addActividadRow = (count: number = 1) => {
    const newRows: ActividadData[] = Array.from({ length: count }, () => ({
      actividad: '', porcentaje: 0, fecha_inicio: ''
    }))
    setActividades(prev => [...prev, ...newRows])
  }

  const removeActividadRow = (index: number) => {
    if (actividades.length === 1) {
      setActividades([{ actividad: '', porcentaje: 0, fecha_inicio: '' }])
    } else {
      setActividades(prev => prev.filter((_, i) => i !== index))
    }
  }

  // Shareholders handlers (Modal)
  const openAccionistaModal = (acc?: AccionistaData) => {
    if (acc) {
      setAccionistaForm({
        id: acc.id,
        proveedor_id: acc.proveedor_id,
        nombre_completo: acc.nombre_completo,
        curp: acc.curp,
        ine: acc.ine,
        fecha_alta: acc.fecha_alta,
        porcentaje_participacion: acc.porcentaje_participacion
      })
    } else {
      setAccionistaForm({
        id: 0,
        proveedor_id: proveedorIdActual || 0,
        nombre_completo: '',
        curp: '',
        ine: '',
        fecha_alta: new Date().toISOString().split('T')[0],
        porcentaje_participacion: 0
      })
    }
    setShowAccionistaModal(true)
  }

  const handleSaveAccionista = async () => {
    if (!accionistaForm.nombre_completo || !accionistaForm.curp || !accionistaForm.ine) {
      alert('Completa todos los campos obligatorios')
      return
    }

    // Validar límite total de 100% de participación
    const pctNuevo = Number(accionistaForm.porcentaje_participacion) || 0
    const totalExistenteActivos = accionistas
      .filter(a => !a.fecha_baja && a.id !== accionistaForm.id)
      .reduce((sum, a) => sum + Number(a.porcentaje_participacion), 0)

    if (totalExistenteActivos + pctNuevo > 100) {
      alert(`El porcentaje acumulado superaría el 100% (Actual: ${totalExistenteActivos}%, Intentado: +${pctNuevo}%)`)
      return
    }

    try {
      const res = await saveAccionista({
        ...accionistaForm,
        proveedor_id: proveedorIdActual || 0
      } as AccionistaData)

      if (res.success) {
        setShowAccionistaModal(false)
        // Recargar accionistas
        if (proveedorIdActual) {
          const accs = await getAccionistas(proveedorIdActual)
          setAccionistas(accs)
        }
      } else {
        alert(res.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleBajaAccionista = async (id: number) => {
    if (confirm('¿Dar de baja a este accionista? (Baja lógica, quedará registrado históricamente)')) {
      const res = await deleteAccionista(id)
      if (res.success && proveedorIdActual) {
        const accs = await getAccionistas(proveedorIdActual)
        setAccionistas(accs)
      } else {
        alert(res.error)
      }
    }
  }

  // Attorneys handlers (Modal)
  const openApoderadoModal = (apod?: ApoderadoData) => {
    if (apod) {
      setApoderadoForm({
        id: apod.id,
        proveedor_id: apod.proveedor_id,
        nombre_completo: apod.nombre_completo,
        curp: apod.curp,
        ine: apod.ine,
        fecha_alta: apod.fecha_alta
      })
    } else {
      setApoderadoForm({
        id: 0,
        proveedor_id: proveedorIdActual || 0,
        nombre_completo: '',
        curp: '',
        ine: '',
        fecha_alta: new Date().toISOString().split('T')[0]
      })
    }
    setShowApoderadoModal(true)
  }

  const handleSaveApoderado = async () => {
    if (!apoderadoForm.nombre_completo || !apoderadoForm.curp || !apoderadoForm.ine) {
      alert('Completa todos los campos obligatorios')
      return
    }

    try {
      const res = await saveApoderado({
        ...apoderadoForm,
        proveedor_id: proveedorIdActual || 0
      } as ApoderadoData)

      if (res.success) {
        setShowApoderadoModal(false)
        if (proveedorIdActual) {
          const apods = await getApoderados(proveedorIdActual)
          setApoderados(apods)
        }
      } else {
        alert(res.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleBajaApoderado = async (id: number) => {
    if (confirm('¿Dar de baja a este apoderado legal?')) {
      const res = await deleteApoderado(id)
      if (res.success && proveedorIdActual) {
        const apods = await getApoderados(proveedorIdActual)
        setApoderados(apods)
      } else {
        alert(res.error)
      }
    }
  }

  // Save the complete provider form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipoProveedor) return

    setSaveLoading(true)
    setMessage(null)

    try {
      // 1. Guardar datos principales de proveedor
      const res = await saveProveedor(tipoProveedor as any, formData)

      if (res.success && res.proveedorId) {
        setProveedorIdActual(res.proveedorId)
        
        // 2. Si es Ofertante, guardar actividades económicas
        if (profile?.rol === 'Ofertante') {
          const actsRes = await saveActividades(res.proveedorId, actividades)
          if (!actsRes.success) {
            setMessage({ type: 'error', text: `Proveedor guardado, pero falló guardar actividades: ${actsRes.error}` })
            setSaveLoading(false)
            return
          }
        }

        setMessage({ type: 'success', text: 'Perfil guardado correctamente en la base de datos de Supabase' })
      } else {
        setMessage({ type: 'error', text: res.error || 'Error al guardar el perfil' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de red al procesar la solicitud' })
    } finally {
      setSaveLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loadingProfile && !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <span className="text-slate-400 font-semibold text-sm mt-3">Cargando perfil de usuario...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand">Mi Perfil</h1>
          <p className="text-slate-400 text-xs mt-1">Completa y actualiza los datos de tu ficha comercial.</p>
        </div>
      </div>

      {/* Alerta de Mensaje */}
      {message && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border shadow-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <div>
            <h4 className="font-bold text-sm">{message.type === 'success' ? 'Éxito' : 'Error'}</h4>
            <p className="text-xs mt-0.5">{message.text}</p>
          </div>
        </div>
      )}

      {/* Selector de Tipo de Proveedor (Solo para rol Ofertante) */}
      {profile?.rol === 'Ofertante' && (
        <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4">
          <label className="text-slate-700 font-semibold text-sm block">
            Selecciona tu personalidad jurídica:
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTipoProveedor('fisica_empresarial')}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                tipoProveedor === 'fisica_empresarial'
                  ? 'bg-brand/10 border-brand text-brand ring-4 ring-brand/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              Persona Física (Act. Empresarial)
            </button>
            <button
              type="button"
              onClick={() => setTipoProveedor('moral')}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                tipoProveedor === 'moral'
                  ? 'bg-brand/10 border-brand text-brand ring-4 ring-brand/10'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4" />
              Persona Moral
            </button>
          </div>
        </div>
      )}

      {/* Formulario Principal */}
      {tipoProveedor !== '' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            
            {/* 1. DATOS FISCALES */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-lg">Datos Fiscales</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">RFC <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    maxLength={13}
                    name="rfc"
                    value={formData.rfc}
                    onChange={handleInputChange}
                    placeholder="RFC de la empresa"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Razón Social <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleInputChange}
                    placeholder="Denominación fiscal"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Régimen Fiscal <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    name="regimen_fiscal"
                    value={formData.regimen_fiscal}
                    onChange={handleInputChange}
                    placeholder="Ej: Régimen General de Ley Personas Morales"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
              </div>
            </div>

            {/* 2. INFORMACION PARA CONCIERGE */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-lg">Información para Concierge</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                Esta información permitirá clasificar correctamente tu perfil dentro del catálogo y agilizar las búsquedas de compradores públicos o privados.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Nombre Comercial</label>
                  <input
                    type="text"
                    name="nombre_comercial"
                    value={formData.nombre_comercial}
                    onChange={handleInputChange}
                    placeholder="Ej: Consorcio Digital"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Palabras Clave</label>
                  <input
                    type="text"
                    name="palabras_clave"
                    value={formData.palabras_clave}
                    onChange={handleInputChange}
                    placeholder="Ej: computadoras, mantenimiento, red (separadas por comas)"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Descripción de Actividades o Servicios</label>
                  <textarea
                    name="descripcion_actividad"
                    value={formData.descripcion_actividad}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Detalla de forma general los productos o servicios que provee tu empresa."
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Categoría Concierge - Nivel 1</label>
                  <select
                    name="categoria_nivel_1"
                    value={formData.categoria_nivel_1}
                    onChange={handleCatNivel1Change}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60 cursor-pointer"
                  >
                    <option value="">-- Selecciona --</option>
                    {catNivel1Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Categoría Concierge - Nivel 2</label>
                  <select
                    name="categoria_nivel_2"
                    value={formData.categoria_nivel_2}
                    onChange={handleCatNivel2Change}
                    disabled={catNivel2Opts.length === 0}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Selecciona --</option>
                    {catNivel2Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-600 font-semibold text-xs">Categoría Concierge - Nivel 3</label>
                  <select
                    name="categoria_nivel_3"
                    value={formData.categoria_nivel_3}
                    onChange={handleCatNivel3Change}
                    disabled={catNivel3Opts.length === 0}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Selecciona --</option>
                    {catNivel3Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. DOMICILIO FISCAL */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-lg">Domicilio Fiscal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-slate-600 font-semibold text-xs">Calle / Vialidad</label>
                  <input
                    type="text"
                    name="nombre_vialidad"
                    value={formData.nombre_vialidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Núm. Exterior</label>
                  <input
                    type="text"
                    name="num_exterior"
                    value={formData.num_exterior}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Núm. Interior</label>
                  <input
                    type="text"
                    name="num_interior"
                    value={formData.num_interior}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Colonia</label>
                  <input
                    type="text"
                    name="colonia"
                    value={formData.colonia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Código Postal</label>
                  <input
                    type="text"
                    maxLength={5}
                    name="codigo_postal"
                    value={formData.codigo_postal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Localidad</label>
                  <input
                    type="text"
                    name="localidad"
                    value={formData.localidad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Ciudad</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
              </div>
            </div>

            {/* 4. CONTACTO */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                <Phone className="w-5 h-5" />
                <h3 className="font-bold text-lg">Contacto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="10 dígitos"
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Extensión</label>
                  <input
                    type="text"
                    name="extension"
                    value={formData.extension}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Correo de Contacto <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Representante Legal</label>
                  <input
                    type="text"
                    name="representante_legal"
                    value={formData.representante_legal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60 md:col-span-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Fax</label>
                  <input
                    type="text"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Extensión Fax</label>
                  <input
                    type="text"
                    name="fax_extension"
                    value={formData.fax_extension}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
              </div>
            </div>

            {/* 5. DATOS BANCARIOS */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                <Landmark className="w-5 h-5" />
                <h3 className="font-bold text-lg">Datos Bancarios</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Nombre del Banco</label>
                  <input
                    type="text"
                    name="banco"
                    value={formData.banco}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Sucursal</label>
                  <input
                    type="text"
                    name="sucursal_bancaria"
                    value={formData.sucursal_bancaria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Número de Cuenta</label>
                  <input
                    type="text"
                    name="cuenta_bancaria"
                    value={formData.cuenta_bancaria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">CLABE Interbancaria (18 dígitos)</label>
                  <input
                    type="text"
                    maxLength={18}
                    name="clabe_interbancaria"
                    value={formData.clabe_interbancaria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60"
                  />
                </div>
              </div>
            </div>

            {/* 6. EXCLUSIVO PERSONA MORAL: ACTA Y PODERES */}
            {tipoProveedor === 'moral' && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                
                {/* Acta Constitutiva */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand">
                    <Building className="w-5 h-5" />
                    <h3 className="font-bold text-base uppercase tracking-wider">Datos del Acta Constitutiva</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Objeto Social</label>
                      <textarea
                        name="objeto_social"
                        value={formData.objeto_social}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Descripción literal del objeto social de la constitución jurídica"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Núm. Acta Constitutiva</label>
                      <input
                        type="text"
                        name="num_acta_constitutiva"
                        value={formData.num_acta_constitutiva}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Fecha Acta Constitutiva</label>
                      <input
                        type="date"
                        name="fecha_acta_constitutiva"
                        value={formData.fecha_acta_constitutiva || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Núm. Notario Público</label>
                      <input
                        type="text"
                        name="num_notario_acta"
                        value={formData.num_notario_acta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Nombre del Notario</label>
                      <input
                        type="text"
                        name="nombre_notario_acta"
                        value={formData.nombre_notario_acta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Ciudad de Registro</label>
                      <input
                        type="text"
                        name="ciudad_acta"
                        value={formData.ciudad_acta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Folio Mercantil</label>
                      <input
                        type="text"
                        name="folio_mercantil"
                        value={formData.folio_mercantil}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Fecha de Inscripción Registro</label>
                      <input
                        type="date"
                        name="fecha_registro_acta"
                        value={formData.fecha_registro_acta || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                  </div>
                </div>

                {/* Poder Notarial */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-brand">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="font-bold text-base uppercase tracking-wider">Poder Notarial (Representante / Opcional)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Núm. de Poder Notarial</label>
                      <input
                        type="text"
                        name="poder_notarial_num"
                        value={formData.poder_notarial_num}
                        onChange={handleInputChange}
                        placeholder="N/A si no aplica"
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Fecha Poder Notarial</label>
                      <input
                        type="date"
                        name="poder_notarial_fecha"
                        value={formData.poder_notarial_fecha || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Núm. Notario Público</label>
                      <input
                        type="text"
                        name="poder_notarial_notario_num"
                        value={formData.poder_notarial_notario_num}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Nombre del Notario</label>
                      <input
                        type="text"
                        name="poder_notarial_notario_nombre"
                        value={formData.poder_notarial_notario_nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Ciudad de Registro</label>
                      <input
                        type="text"
                        name="poder_notarial_ciudad"
                        value={formData.poder_notarial_ciudad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Folio de Registro</label>
                      <input
                        type="text"
                        name="poder_notarial_folio"
                        value={formData.poder_notarial_folio}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Fecha Inscripción Registro</label>
                      <input
                        type="date"
                        name="poder_notarial_fecha_registro"
                        value={formData.poder_notarial_fecha_registro || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white/60"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-slate-600 font-semibold text-xs">Apoderados Descritos</label>
                      <textarea
                        name="apoderados"
                        value={formData.apoderados}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Nombres completos de los apoderados en este acta..."
                        className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white/60 resize-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* TABLAS ADICIONALES (Solo visible para Ofertantes si ya se creó el ID del Proveedor) */}
          {profile?.rol === 'Ofertante' && (
            <>
              {/* SECCIÓN ACTIVIDADES ECONÓMICAS */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center gap-2 text-brand">
                  <Percent className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Actividades Económicas</h3>
                </div>
                <p className="text-slate-400 text-xs">
                  Especifica las actividades de tu constancia de situación fiscal vigente y su peso porcentual en tu facturación.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full border-collapse bg-white text-left text-sm text-slate-700">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-xs text-brand uppercase">Actividad</th>
                        <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-32">Porcentaje (%)</th>
                        <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-48">Fecha de Inicio</th>
                        <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-20 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                      {actividades.map((act, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3">
                            <input
                              type="text"
                              value={act.actividad}
                              onChange={(e) => handleActividadChange(index, 'actividad', e.target.value)}
                              placeholder="Ej: Comercio al por menor de computadoras"
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={act.porcentaje || ''}
                              onChange={(e) => handleActividadChange(index, 'porcentaje', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand text-center font-semibold"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="date"
                              value={act.fecha_inicio}
                              onChange={(e) => handleActividadChange(index, 'fecha_inicio', e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand"
                            />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeActividadRow(index)}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-3 justify-start pt-2">
                  <button
                    type="button"
                    onClick={() => addActividadRow(1)}
                    className="px-4 py-2 border border-slate-200 hover:border-brand text-slate-600 hover:text-brand bg-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Fila
                  </button>
                </div>
              </div>

              {/* SECCIÓN APODERADOS LEGALES */}
              {proveedorIdActual && (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between gap-2 text-brand">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Apoderados Legales</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => openApoderadoModal()}
                      className="px-3.5 py-1.5 bg-brand hover:bg-brand-strong text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Apoderado
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full border-collapse bg-white text-left text-sm text-slate-700">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase">Nombre</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-44">CURP</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-44">INE</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-32">Fecha Alta</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-32">Estado</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-28 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                        {apoderados.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-400 font-medium bg-slate-50/20">
                              No hay apoderados registrados.
                            </td>
                          </tr>
                        ) : (
                          apoderados.map((apod) => (
                            <tr key={apod.id} className={`hover:bg-slate-50/50 transition-colors ${apod.fecha_baja ? 'opacity-50' : ''}`}>
                              <td className="px-6 py-3 text-xs font-semibold text-slate-800">{apod.nombre_completo}</td>
                              <td className="px-6 py-3 text-xs tracking-wider font-mono">{apod.curp}</td>
                              <td className="px-6 py-3 text-xs tracking-wider font-mono">{apod.ine}</td>
                              <td className="px-6 py-3 text-xs">{apod.fecha_alta}</td>
                              <td className="px-6 py-3 text-xs">
                                {apod.fecha_baja ? (
                                  <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    Baja: {apod.fecha_baja}
                                  </span>
                                ) : (
                                  <span className="inline-block bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    Activo
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-center flex justify-center gap-2">
                                {!apod.fecha_baja && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openApoderadoModal(apod)}
                                      className="p-1 text-slate-400 hover:text-brand hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleBajaApoderado(apod.id!)}
                                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SECCIÓN ACCIONISTAS (Solo visible si es Persona Moral y ya tiene ID de Proveedor) */}
              {tipoProveedor === 'moral' && proveedorIdActual && (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between gap-2 text-brand">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <h3 className="font-bold text-lg">Relación de Accionistas</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAccionistaModal()}
                      className="px-3.5 py-1.5 bg-brand hover:bg-brand-strong text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar Accionista
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full border-collapse bg-white text-left text-sm text-slate-700">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase">Nombre</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-44">CURP</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-44">INE</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-28 text-center">Part. (%)</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-32">Fecha Alta</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-32">Estado</th>
                          <th className="px-6 py-4 font-bold text-xs text-brand uppercase w-28 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                        {accionistas.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-xs text-slate-400 font-medium bg-slate-50/20">
                              No hay accionistas registrados.
                            </td>
                          </tr>
                        ) : (
                          accionistas.map((acc) => (
                            <tr key={acc.id} className={`hover:bg-slate-50/50 transition-colors ${acc.fecha_baja ? 'opacity-50' : ''}`}>
                              <td className="px-6 py-3 text-xs font-semibold text-slate-800">{acc.nombre_completo}</td>
                              <td className="px-6 py-3 text-xs tracking-wider font-mono">{acc.curp}</td>
                              <td className="px-6 py-3 text-xs tracking-wider font-mono">{acc.ine}</td>
                              <td className="px-6 py-3 text-xs text-center font-bold text-brand">{acc.porcentaje_participacion}%</td>
                              <td className="px-6 py-3 text-xs">{acc.fecha_alta}</td>
                              <td className="px-6 py-3 text-xs">
                                {acc.fecha_baja ? (
                                  <span className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    Baja: {acc.fecha_baja}
                                  </span>
                                ) : (
                                  <span className="inline-block bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                    Activo
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-3 text-center flex justify-center gap-2">
                                {!acc.fecha_baja && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openAccionistaModal(acc)}
                                      className="p-1 text-slate-400 hover:text-brand hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleBajaAccionista(acc.id!)}
                                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botones de Envío Formulario */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-brand text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand/10 hover:bg-brand-strong active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer text-sm uppercase tracking-wider disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saveLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando datos...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Perfil
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-colors text-sm uppercase tracking-wider cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </form>
      )}

      {/* MODAL ACCIONISTA */}
      {showAccionistaModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-brand flex items-center gap-2">
                <User className="w-6 h-6 text-brand" />
                {accionistaForm.id && accionistaForm.id > 0 ? 'Editar Accionista' : 'Agregar Accionista'}
              </h3>
              <p className="text-slate-400 text-xs mt-1">Completa los datos de participación accionaria.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-600 font-semibold text-xs">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={accionistaForm.nombre_completo || ''}
                  onChange={(e) => setAccionistaForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">CURP (18 caract.)</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={accionistaForm.curp || ''}
                    onChange={(e) => setAccionistaForm(prev => ({ ...prev, curp: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Número de INE</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={accionistaForm.ine || ''}
                    onChange={(e) => setAccionistaForm(prev => ({ ...prev, ine: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Fecha Alta</label>
                  <input
                    type="date"
                    required
                    value={accionistaForm.fecha_alta || ''}
                    onChange={(e) => setAccionistaForm(prev => ({ ...prev, fecha_alta: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs flex items-center gap-0.5"><Percent className="w-3.5 h-3.5" /> Participación (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    step={0.01}
                    value={accionistaForm.porcentaje_participacion || ''}
                    onChange={(e) => setAccionistaForm(prev => ({ ...prev, porcentaje_participacion: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAccionistaModal(false)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold rounded-2xl text-xs cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAccionista}
                className="px-5 py-3 bg-brand hover:bg-brand-strong text-white font-bold rounded-2xl text-xs cursor-pointer transition-all"
              >
                Guardar Accionista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APODERADO */}
      {showApoderadoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100 flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-brand flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-brand" />
                {apoderadoForm.id && apoderadoForm.id > 0 ? 'Editar Apoderado' : 'Agregar Apoderado'}
              </h3>
              <p className="text-slate-400 text-xs mt-1">Completa los datos de identidad del apoderado legal.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-600 font-semibold text-xs">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={apoderadoForm.nombre_completo || ''}
                  onChange={(e) => setApoderadoForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">CURP (18 caract.)</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={apoderadoForm.curp || ''}
                    onChange={(e) => setApoderadoForm(prev => ({ ...prev, curp: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-600 font-semibold text-xs">Número de INE</label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={apoderadoForm.ine || ''}
                    onChange={(e) => setApoderadoForm(prev => ({ ...prev, ine: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-semibold text-xs flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Fecha Alta</label>
                <input
                  type="date"
                  required
                  value={apoderadoForm.fecha_alta || ''}
                  onChange={(e) => setApoderadoForm(prev => ({ ...prev, fecha_alta: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApoderadoModal(false)}
                className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold rounded-2xl text-xs cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveApoderado}
                className="px-5 py-3 bg-brand hover:bg-brand-strong text-white font-bold rounded-2xl text-xs cursor-pointer transition-all"
              >
                Guardar Apoderado
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
