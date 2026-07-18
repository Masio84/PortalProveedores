-- ==========================================
-- SCRIPT DE MIGRACIÓN PARA SUPABASE (POSTGRESQL)
-- Portal Maestro de Contrataciones
-- ==========================================

-- Habilitar extensiones necesarias si es requerido
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpieza previa (opcional, para desarrollo)
DROP VIEW IF EXISTS public.vw_categorias_concierge CASCADE;
DROP TABLE IF EXISTS public.actividades_economicas CASCADE;
DROP TABLE IF EXISTS public.apoderados_legales CASCADE;
DROP TABLE IF EXISTS public.accionistas CASCADE;
DROP TABLE IF EXISTS public.proveedores CASCADE;
DROP TABLE IF EXISTS public.categorias_nivel_3 CASCADE;
DROP TABLE IF EXISTS public.categorias_nivel_2 CASCADE;
DROP TABLE IF EXISTS public.categorias_nivel_1 CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TYPE IF EXISTS public.tipo_proveedor_enum CASCADE;

-- 1. Crear Tipo ENUM para Proveedores
CREATE TYPE public.tipo_proveedor_enum AS ENUM ('fisica_empresarial', 'moral', 'general');

-- 2. Crear Tabla de Roles
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insertar roles por defecto
INSERT INTO public.roles (id, nombre, descripcion) VALUES
(1, 'Ofertante', 'Ofertante que da de alta sus datos para el ISSEA'),
(2, 'institucion_publica', 'Institución pública que revisa solicitudes'),
(3, 'privado', 'Usuario privado sin acceso a módulo de proveedores')
ON CONFLICT (nombre) DO NOTHING;

-- Resetear secuencia de id de roles
SELECT setval('public.roles_id_seq', (SELECT MAX(id) FROM public.roles));

-- 3. Crear Tabla de Usuarios (Perfiles Públicos vinculados a auth.users de Supabase)
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    rol_id INT NOT NULL REFERENCES public.roles(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Crear Tablas de Categorías Concierge (Códigos de texto CHAR/VARCHAR)
CREATE TABLE public.categorias_nivel_1 (
    codigo VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categorias_nivel_2 (
    codigo VARCHAR(10) PRIMARY KEY,
    nivel_1_codigo VARCHAR(10) NOT NULL REFERENCES public.categorias_nivel_1(codigo) ON UPDATE CASCADE ON DELETE RESTRICT,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categorias_nivel_3 (
    codigo VARCHAR(10) PRIMARY KEY,
    nivel_2_codigo VARCHAR(10) NOT NULL REFERENCES public.categorias_nivel_2(codigo) ON UPDATE CASCADE ON DELETE RESTRICT,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Crear Tabla de Proveedores (Relacionada con public.usuarios)
CREATE TABLE public.proveedores (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    tipo_proveedor public.tipo_proveedor_enum NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    descripcion_actividad TEXT,
    palabras_clave TEXT,
    regimen_fiscal VARCHAR(100) NOT NULL,
    nombre_vialidad VARCHAR(150),
    num_exterior VARCHAR(20),
    num_interior VARCHAR(20),
    colonia VARCHAR(100),
    localidad VARCHAR(100),
    codigo_postal VARCHAR(10),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    telefono VARCHAR(20),
    extension VARCHAR(10),
    fax VARCHAR(20),
    fax_extension VARCHAR(10),
    representante_legal VARCHAR(255),
    email VARCHAR(255),
    banco VARCHAR(100),
    sucursal_bancaria VARCHAR(100),
    cuenta_bancaria VARCHAR(50),
    clabe_interbancaria VARCHAR(18),
    objeto_social TEXT, -- Solo Persona Moral
    num_acta_constitutiva VARCHAR(50),
    fecha_acta_constitutiva DATE,
    num_notario_acta VARCHAR(50),
    nombre_notario_acta VARCHAR(255),
    ciudad_acta VARCHAR(100),
    folio_mercantil VARCHAR(50),
    fecha_registro_acta DATE,
    poder_notarial_num VARCHAR(50),
    poder_notarial_fecha DATE,
    poder_notarial_notario_num VARCHAR(50),
    poder_notarial_notario_nombre VARCHAR(255),
    poder_notarial_ciudad VARCHAR(100),
    poder_notarial_folio VARCHAR(50),
    poder_notarial_fecha_registro DATE,
    apoderados TEXT,
    categoria_nivel_1 VARCHAR(10) REFERENCES public.categorias_nivel_1(codigo),
    categoria_nivel_2 VARCHAR(10) REFERENCES public.categorias_nivel_2(codigo),
    categoria_nivel_3 VARCHAR(10) REFERENCES public.categorias_nivel_3(codigo),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Restricción de registro único por tipo de proveedor y usuario
    CONSTRAINT unique_user_type UNIQUE (user_id, tipo_proveedor)
);

-- Indices para optimizar búsquedas por categoría y Full-Text Search
CREATE INDEX idx_proveedores_user_id ON public.proveedores(user_id);
CREATE INDEX idx_proveedores_categorias ON public.proveedores(categoria_nivel_1, categoria_nivel_2, categoria_nivel_3);
-- Índice GIN para búsquedas textuales ultra rápidas
CREATE INDEX idx_proveedores_search_gin ON public.proveedores USING gin(
    to_tsvector('spanish', 
        coalesce(razon_social, '') || ' ' || 
        coalesce(nombre_comercial, '') || ' ' || 
        coalesce(descripcion_actividad, '') || ' ' || 
        coalesce(palabras_clave, '')
    )
);

-- 6. Crear Tabla de Accionistas
CREATE TABLE public.accionistas (
    id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    curp VARCHAR(18) NOT NULL,
    ine VARCHAR(18) NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    porcentaje_participacion DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (porcentaje_participacion BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de unicidad de CURP/INE condicionados a estar activos (fecha_baja es NULL)
CREATE UNIQUE INDEX idx_accionistas_curp_activo ON public.accionistas (curp) WHERE (fecha_baja IS NULL);
CREATE UNIQUE INDEX idx_accionistas_ine_activo ON public.accionistas (ine) WHERE (fecha_baja IS NULL);
CREATE INDEX idx_accionistas_proveedor_id ON public.accionistas(proveedor_id);

-- 7. Tabla de Apoderados Legales
CREATE TABLE public.apoderados_legales (
    id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    curp VARCHAR(18) NOT NULL,
    ine VARCHAR(18) NOT NULL,
    fecha_alta DATE NOT NULL,
    fecha_baja DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices de unicidad de CURP/INE para apoderados activos
CREATE UNIQUE INDEX idx_apoderados_curp_activo ON public.apoderados_legales (curp) WHERE (fecha_baja IS NULL);
CREATE UNIQUE INDEX idx_apoderados_ine_activo ON public.apoderados_legales (ine) WHERE (fecha_baja IS NULL);
CREATE INDEX idx_apoderados_proveedor_id ON public.apoderados_legales(proveedor_id);

-- 8. Tabla de Actividades Económicas
CREATE TABLE public.actividades_economicas (
    id SERIAL PRIMARY KEY,
    proveedor_id INT NOT NULL REFERENCES public.proveedores(id) ON DELETE CASCADE,
    actividad VARCHAR(255) NOT NULL,
    porcentaje DECIMAL(5,2) DEFAULT 0.00 CHECK (porcentaje BETWEEN 0 AND 100),
    fecha_inicio DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_actividades_proveedor_id ON public.actividades_economicas(proveedor_id);

-- 9. Vista de Categorías Concierge en PostgreSQL
CREATE OR REPLACE VIEW public.vw_categorias_concierge AS
SELECT 
    n1.codigo AS nivel_1_codigo, 
    n1.nombre AS nivel_1_nombre, 
    n2.codigo AS nivel_2_codigo, 
    n2.nombre AS nivel_2_nombre, 
    n3.codigo AS nivel_3_codigo, 
    n3.nombre AS nivel_3_nombre, 
    CONCAT(n1.codigo, ' - ', n1.nombre, ' > ', n2.codigo, ' - ', n2.nombre, ' > ', n3.codigo, ' - ', n3.nombre) AS ruta_categoria
FROM public.categorias_nivel_1 n1
JOIN public.categorias_nivel_2 n2 ON n2.nivel_1_codigo = n1.codigo
JOIN public.categorias_nivel_3 n3 ON n3.nivel_2_codigo = n2.codigo
WHERE n1.activo = TRUE AND n2.activo = TRUE AND n3.activo = TRUE;

-- ==========================================
-- TRIGGERS Y AUTOMATIZACIONES
-- ==========================================

-- Actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON public.proveedores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_accionistas_updated_at BEFORE UPDATE ON public.accionistas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_apoderados_updated_at BEFORE UPDATE ON public.apoderados_legales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_actividades_updated_at BEFORE UPDATE ON public.actividades_economicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para crear perfil en public.usuarios al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_id INT;
    v_tipo_usuario VARCHAR;
    v_telefono VARCHAR;
BEGIN
    -- Leer metadatos pasados en el registro (signUp)
    v_tipo_usuario := COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'privado');
    v_telefono := COALESCE(NEW.raw_user_meta_data->>'telefono', '');
    
    -- Obtener rol_id correspondiente
    SELECT id INTO v_rol_id FROM public.roles WHERE nombre = v_tipo_usuario;
    IF v_rol_id IS NULL THEN
        -- Por defecto asignar privado si no coincide
        SELECT id INTO v_rol_id FROM public.roles WHERE nombre = 'privado';
    END IF;

    INSERT INTO public.usuarios (id, rol_id, email, telefono, creado_en, actualizado_en)
    VALUES (
        NEW.id,
        v_rol_id,
        NEW.email,
        v_telefono,
        COALESCE(NEW.created_at, NOW()),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accionistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apoderados_legales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actividades_economicas ENABLE ROW LEVEL SECURITY;

-- Políticas para public.usuarios (Perfiles)
CREATE POLICY "Permitir lectura de perfiles a usuarios autenticados" 
    ON public.usuarios FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir actualización de perfil propio" 
    ON public.usuarios FOR UPDATE 
    USING (auth.uid() = id);

-- Políticas para public.proveedores
CREATE POLICY "Permitir a instituciones públicas leer todos los proveedores"
    ON public.proveedores FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'institucion_publica'
        )
    );

CREATE POLICY "Permitir a ofertantes leer su propio proveedor"
    ON public.proveedores FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Permitir a ofertantes insertar su propio proveedor"
    ON public.proveedores FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Permitir a ofertantes actualizar su propio proveedor"
    ON public.proveedores FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Políticas para public.accionistas, apoderados_legales y actividades_economicas
-- Se basan en validar que el proveedor_id pertenezca al usuario logueado.

CREATE POLICY "Lectura de accionistas propios"
    ON public.accionistas FOR SELECT
    USING (
        proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'institucion_publica'
        )
    );

CREATE POLICY "Modificación de accionistas propios"
    ON public.accionistas FOR ALL
    USING (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()))
    WITH CHECK (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()));

CREATE POLICY "Lectura de apoderados propios"
    ON public.apoderados_legales FOR SELECT
    USING (
        proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'institucion_publica'
        )
    );

CREATE POLICY "Modificación de apoderados propios"
    ON public.apoderados_legales FOR ALL
    USING (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()))
    WITH CHECK (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()));

CREATE POLICY "Lectura de actividades propias"
    ON public.actividades_economicas FOR SELECT
    USING (
        proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.roles r ON u.rol_id = r.id
            WHERE u.id = auth.uid() AND r.nombre = 'institucion_publica'
        )
    );

CREATE POLICY "Modificación de actividades propias"
    ON public.actividades_economicas FOR ALL
    USING (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()))
    WITH CHECK (proveedor_id IN (SELECT id FROM public.proveedores WHERE user_id = auth.uid()));

-- ==========================================
-- FUNCIÓN DE BÚSQUEDA OPTIMIZADA (RPC)
-- ==========================================

CREATE OR REPLACE FUNCTION public.search_proveedores(
  p_query TEXT,
  p_nivel1 VARCHAR,
  p_nivel2 VARCHAR,
  p_nivel3 VARCHAR
)
RETURNS TABLE (
  id INT,
  razon_social VARCHAR,
  nombre_comercial VARCHAR,
  descripcion_actividad TEXT,
  palabras_clave TEXT,
  tipo_proveedor public.tipo_proveedor_enum,
  email VARCHAR,
  telefono VARCHAR,
  rol VARCHAR,
  nivel1_codigo VARCHAR,
  nivel1_nombre VARCHAR,
  nivel2_codigo VARCHAR,
  nivel2_nombre VARCHAR,
  nivel3_codigo VARCHAR,
  nivel3_nombre VARCHAR,
  categoria_texto TEXT
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.razon_social,
    p.nombre_comercial,
    p.descripcion_actividad,
    p.palabras_clave,
    p.tipo_proveedor,
    u.email AS email,
    u.telefono AS telefono,
    r.nombre AS rol,
    c1.codigo AS nivel1_codigo,
    c1.nombre AS nivel1_nombre,
    c2.codigo AS nivel2_codigo,
    c2.nombre AS nivel2_nombre,
    c3.codigo AS nivel3_codigo,
    c3.nombre AS nivel3_nombre,
    CONCAT_WS(' / ',
      CONCAT(c1.codigo, ' - ', c1.nombre),
      CONCAT(c2.codigo, ' - ', c2.nombre),
      CONCAT(c3.codigo, ' - ', c3.nombre)
    ) AS categoria_texto
  FROM public.proveedores p
  INNER JOIN public.usuarios u ON p.user_id = u.id
  INNER JOIN public.roles r ON u.rol_id = r.id
  LEFT JOIN public.categorias_nivel_1 c1 ON p.categoria_nivel_1 = c1.codigo
  LEFT JOIN public.categorias_nivel_2 c2 ON p.categoria_nivel_2 = c2.codigo
  LEFT JOIN public.categorias_nivel_3 c3 ON p.categoria_nivel_3 = c3.codigo
  WHERE
    (p_nivel1 = '' OR p.categoria_nivel_1 = p_nivel1) AND
    (p_nivel2 = '' OR p.categoria_nivel_2 = p_nivel2) AND
    (p_nivel3 = '' OR p.categoria_nivel_3 = p_nivel3) AND
    (
      p_query = '' OR
      to_tsvector('spanish', 
        COALESCE(p.razon_social, '') || ' ' || 
        COALESCE(p.nombre_comercial, '') || ' ' || 
        COALESCE(p.descripcion_actividad, '') || ' ' || 
        COALESCE(p.palabras_clave, '')
      ) @@ websearch_to_tsquery('spanish', p_query) OR
      p.razon_social ILIKE '%' || p_query || '%' OR
      p.nombre_comercial ILIKE '%' || p_query || '%' OR
      p.descripcion_actividad ILIKE '%' || p_query || '%' OR
      p.palabras_clave ILIKE '%' || p_query || '%' OR
      u.email ILIKE '%' || p_query || '%'
    )
  ORDER BY 
    CASE 
      WHEN p.categoria_nivel_3 IS NOT NULL THEN 1
      WHEN COALESCE(p.descripcion_actividad, '') <> '' THEN 2
      WHEN COALESCE(p.palabras_clave, '') <> '' THEN 3
      ELSE 4
    END,
    p.razon_social ASC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

