# Refactor modular del Portal de Proveedores

Este paquete reorganiza el JavaScript principal para facilitar mantenimiento y crecimiento del proyecto.

## Cambios principales

El archivo original `Scripts/script.js` fue separado en archivos por responsabilidad:

```
Scripts/
├─ app.js
├─ core/
│  ├─ state.js
│  ├─ utils.js
│  ├─ navigation.js
│  └─ router.js
├─ modules/
│  ├─ proveedor.js
│  ├─ campos_proveedor.js
│  ├─ actividades.js
│  ├─ accionistas.js
│  ├─ apoderados.js
│  └─ concierge.js
└─ pages/
   ├─ login.js
   └─ forgot_password.js
```

## Qué archivo contiene qué

- `core/state.js`: variables globales compartidas (`userData`, `proveedorIdActual`).
- `core/utils.js`: utilidades comunes como `escapeHtml()` y `mostrarMensaje()`.
- `core/navigation.js`: carga del navbar, datos del usuario y menú por rol.
- `core/router.js`: carga dinámica de vistas desde `views/`.
- `modules/proveedor.js`: formulario principal de proveedor.
- `modules/campos_proveedor.js`: HTML dinámico para persona física y moral.
- `modules/actividades.js`: tabla y guardado de actividades económicas.
- `modules/accionistas.js`: tabla, modal, edición y baja lógica de accionistas.
- `modules/apoderados.js`: tabla, modal, edición y baja lógica de apoderados.
- `modules/concierge.js`: buscador de categorías por niveles y barra de búsqueda.
- `app.js`: arranque de la aplicación.

## Archivos modificados

- `Index.html`: ahora carga los scripts refactorizados en orden.
- `login.html`: apunta a `Scripts/pages/login.js`.
- `forgot_password.html`: apunta a `Scripts/pages/forgot_password.js`.

## Instalación

1. Haz respaldo de tu proyecto actual.
2. Copia el contenido de este paquete dentro de tu proyecto.
3. Conserva la misma estructura de carpetas.
4. Verifica que `partials/nav.html`, `views/perfil.html`, `views/concierge.html` y los PHP estén en las rutas indicadas.
5. Ejecuta `sql/catalogo_concierge_categorias.sql` si aún no creaste las tablas del catálogo.

## Nota importante

Este refactor no cambia la lógica de negocio principal; solo organiza el código para que sea más fácil de mantener.
