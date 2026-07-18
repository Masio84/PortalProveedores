# Portal Maestro de Contrataciones (Next.js 16 + Supabase)

Este repositorio contiene la versión migrada del **Portal Maestro de Contrataciones** utilizando el stack tecnológico moderno de **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** y **Supabase** (PostgreSQL, Autenticación y RLS).

---

## 🛠️ Requisitos e Instalación

### 1. Clonar el repositorio y dependencias
```bash
git clone https://github.com/Masio84/PortalProveedores.git
cd PortalProveedores
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto y define los datos de tu instancia de Supabase Cloud:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-public-key
```

### 3. Iniciar el servidor local
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación local.

---

## 📁 Estructura del Proyecto

* **`src/app/`**: Contiene los archivos de ruta con App Router.
  * **`(auth)/`**: Rutas de autenticación (Login interactivo, Registro de roles y Recuperación).
  * **`(dashboard)/`**: Secciones protegidas por sesión (Perfil del Proveedor, Buscador Concierge y fallbacks).
  * **`actions/`**: Server Actions para mutaciones transaccionales y queries seguras.
* **`src/components/`**: Componentes globales reutilizables (Sidebar responsivo, Header de sesión, transiciones animadas).
* **`src/utils/supabase/`**: Clientes de Supabase para navegador y servidor (con lectura asíncrona de cookies).
* **`sql/`**: Contiene `supabase_migration.sql` con todo el modelado de datos, triggers, índices GIN de búsqueda y políticas RLS.
* **`legacy-php/`**: Carpeta que almacena los archivos del antiguo stack en PHP, MySQL y HTML para respaldo histórico.

---

## 🚀 Despliegue en Vercel

1. Crea un nuevo proyecto en **Vercel** y conéctalo a este repositorio.
2. Agrega las dos variables de entorno en la configuración del proyecto de Vercel (**Settings** -> **Environment Variables**):
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Vercel compilará y desplegará la aplicación automáticamente en cada `git push` a la rama `main`.

---

## 🔒 Base de Datos y Seguridad (Supabase)

El esquema de base de datos incluye políticas de **Row Level Security (RLS)** que limitan la lectura/escritura de datos:
* Los **Ofertantes** solo pueden modificar sus propios perfiles, accionistas, apoderados legales y actividades económicas.
* Las **Instituciones Públicas** y **Privadas** tienen permisos de lectura para consultar y filtrar los perfiles de todos los proveedores registrados mediante el módulo Concierge.
* El registro de usuarios de Supabase Auth sincroniza automáticamente a los usuarios registrados con la tabla pública `public.usuarios` mediante triggers de PostgreSQL.
