'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, Mail, Phone, Building2, BookOpen, Layers, Award, Loader2 } from 'lucide-react'
import { getCategorias, Categoria } from '@/app/actions/categories'
import { searchProveedores, SearchResult } from '@/app/actions/search'

export default function ConciergePage() {
  // Cascading Categories State
  const [cat1Opts, setCat1Opts] = useState<Categoria[]>([])
  const [cat2Opts, setCat2Opts] = useState<Categoria[]>([])
  const [cat3Opts, setCat3Opts] = useState<Categoria[]>([])

  // Search Parameters
  const [nivel1, setNivel1] = useState('')
  const [nivel2, setNivel2] = useState('')
  const [nivel3, setNivel3] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Search Results & States
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Debouncing search hook manually with a ref timer
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load Level 1 Categories initially
  useEffect(() => {
    async function loadLevel1() {
      const cats = await getCategorias('1')
      setCat1Opts(cats)
    }
    loadLevel1()
  }, [])

  // Dynamic cascading category loading
  const handleCat1Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setNivel1(val)
    setNivel2('')
    setNivel3('')
    setCat2Opts([])
    setCat3Opts([])
    
    if (val) {
      const cats2 = await getCategorias('2', val)
      setCat2Opts(cats2)
    }
  }

  const handleCat2Change = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setNivel2(val)
    setNivel3('')
    setCat3Opts([])

    if (val) {
      const cats3 = await getCategorias('3', val)
      setCat3Opts(cats3)
    }
  }

  const handleCat3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNivel3(e.target.value)
  }

  // Perform search query
  const performSearch = async (term: string = searchTerm, n1: string = nivel1, n2: string = nivel2, n3: string = nivel3) => {
    // If no parameters, don't execute to save resources
    if (!term.trim() && !n1 && !n2 && !n3) {
      setResults([])
      setSearched(false)
      return
    }

    setSearching(true)
    setErrorMessage(null)

    try {
      const res = await searchProveedores(term, n1, n2, n3)
      if (res.success) {
        setResults(res.data)
        setSearched(true)
      } else {
        setErrorMessage(res.error || 'Ocurrió un error al realizar la búsqueda')
      }
    } catch (err) {
      setErrorMessage('Error al conectar con la base de datos')
    } finally {
      setSearching(false)
    }
  }

  // Trigger search on change of category dropdowns
  useEffect(() => {
    performSearch(searchTerm, nivel1, nivel2, nivel3)
  }, [nivel1, nivel2, nivel3])

  // Trigger search on term change with 300ms Debounce
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value, nivel1, nivel2, nivel3)
    }, 300)
  }

  // Clear all filters
  const handleClear = () => {
    setSearchTerm('')
    setNivel1('')
    setNivel2('')
    setNivel3('')
    setCat2Opts([])
    setCat3Opts([])
    setResults([])
    setSearched(false)
    setErrorMessage(null)
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'fisica_empresarial': return 'Persona Física (Act. Empresarial)'
      case 'moral': return 'Persona Moral'
      case 'general': return 'Alta General'
      default: return tipo
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand">Concierge</h1>
        <p className="text-slate-400 text-xs mt-1">
          Busca y filtra proveedores en tiempo real por categorías, palabras clave o razón social.
        </p>
      </div>

      {/* Panel de Filtros */}
      <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-5">
        
        {/* Selectores de Categoría Cascading */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
            <Filter className="w-4 h-4 text-brand" />
            <span>Filtrar por Categoría</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">1er Nivel</label>
              <select
                value={nivel1}
                onChange={handleCat1Change}
                className="w-full px-4 py-3 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-xs text-slate-800 bg-white cursor-pointer"
              >
                <option value="">-- Selecciona el primer nivel --</option>
                {cat1Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">2do Nivel</label>
              <select
                value={nivel2}
                onChange={handleCat2Change}
                disabled={cat2Opts.length === 0}
                className="w-full px-4 py-3 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-xs text-slate-800 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Selecciona el segundo nivel --</option>
                {cat2Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">3er Nivel</label>
              <select
                value={nivel3}
                onChange={handleCat3Change}
                disabled={cat3Opts.length === 0}
                className="w-full px-4 py-3 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-xs text-slate-800 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">-- Selecciona el tercer nivel --</option>
                {cat3Opts.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Input de búsqueda libre */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-slate-700 font-bold text-sm block">
            Buscar Proveedor, Servicio o Palabra Clave
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder="Ejemplo: software, limpieza, medicamentos, mantenimiento..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-100 focus:border-brand focus:ring-4 focus:ring-brand/10 rounded-2xl transition-all text-sm text-slate-800 placeholder-slate-400 bg-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              {searchTerm && (
                <button
                  onClick={() => { setSearchTerm(''); performSearch('', nivel1, nivel2, nivel3) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleClear}
              className="bg-slate-200 text-slate-600 hover:bg-slate-300 font-semibold px-6 py-3.5 rounded-2xl transition-colors cursor-pointer text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

      </div>

      {/* Resultados de Búsqueda */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-brand text-lg">Resultados de Búsqueda</h3>
          {searched && (
            <span className="text-xs text-slate-400 font-semibold">
              Se encontraron {results.length} coincidencias
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-2xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* 1. Estado: Buscando (Skeleton Loaders) */}
          {searching && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-slate-100 rounded-2xl p-5 space-y-3 animate-pulse bg-white">
                  <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                  <div className="h-3 bg-slate-150 rounded-full w-2/3" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 2. Estado: Sin búsqueda realizada */}
          {!searching && !searched && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-slate-400 space-y-2"
            >
              <div className="inline-flex p-4 bg-slate-50 text-slate-300 rounded-full mb-2">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-600">Busca en el Catálogo</h4>
              <p className="text-xs max-w-sm mx-auto">
                Selecciona una categoría arriba o ingresa palabras clave en el buscador para encontrar proveedores certificados.
              </p>
            </motion.div>
          )}

          {/* 3. Estado: Búsqueda completada sin resultados */}
          {!searching && searched && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-slate-400 space-y-2"
            >
              <div className="inline-flex p-4 bg-rose-50 text-rose-400 rounded-full mb-2">
                <X className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-slate-600">Sin coincidencias</h4>
              <p className="text-xs max-w-sm mx-auto">
                No encontramos proveedores con los términos ingresados. Prueba ampliando la búsqueda o quitando filtros de nivel.
              </p>
            </motion.div>
          )}

          {/* 4. Estado: Con resultados */}
          {!searching && searched && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {results.map((prov) => (
                <motion.div
                  key={prov.id}
                  className="border border-slate-100 rounded-2xl p-5 sm:p-6 bg-white hover:shadow-md hover:border-slate-200 transition-all flex flex-col md:flex-row justify-between items-start gap-4"
                  layout
                >
                  
                  {/* Datos del proveedor */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm sm:text-base">
                        {prov.razon_social}
                      </span>
                      {prov.nombre_comercial && (
                        <span className="text-xs bg-blue-50 text-brand border border-blue-100 font-semibold px-2 py-0.5 rounded-full">
                          {prov.nombre_comercial}
                        </span>
                      )}
                    </div>
                    
                    {/* Tipo y rol */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-brand" />
                        <span>{getTipoLabel(prov.tipo_proveedor)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-brand" />
                        <span>Rol: {prov.rol}</span>
                      </div>
                    </div>

                    {/* Descripción y palabras clave */}
                    {prov.descripcion_actividad && (
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                        <BookOpen className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                        <p>{prov.descripcion_actividad}</p>
                      </div>
                    )}

                    {prov.palabras_clave && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prov.palabras_clave.split(',').map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-500 font-medium text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Categorías y Contacto */}
                  <div className="w-full md:w-80 md:border-l md:border-slate-100 md:pl-6 space-y-3 shrink-0 flex flex-col justify-between">
                    
                    {/* Categoría Concierge */}
                    {prov.categoria_texto && (
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3 text-brand" />
                          <span>Categoría Concierge</span>
                        </div>
                        <div className="text-xs text-slate-700 font-semibold leading-relaxed">
                          {prov.categoria_texto}
                        </div>
                      </div>
                    )}

                    {/* Datos de contacto */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                      <a
                        href={`mailto:${prov.email}`}
                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand transition-colors font-medium"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{prov.email}</span>
                      </a>
                      {prov.telefono && (
                        <a
                          href={`tel:${prov.telefono}`}
                          className="flex items-center gap-2 text-xs text-slate-500 hover:text-brand transition-colors font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prov.telefono}</span>
                        </a>
                      )}
                    </div>

                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  )
}
