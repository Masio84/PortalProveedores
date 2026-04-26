// Variable global para almacenar datos del usuario
let userData = null;
let proveedorIdActual = null; // ID del proveedor actual (para actividades/accionistas)

document.addEventListener('DOMContentLoaded', async () => {
    await cargarNav();
    await cargarDatosUsuario();
    cargarModuloPorDefecto();
});

async function cargarNav() {
    try {
        const response = await fetch('partials/nav.html');
        const html = await response.text();
        document.getElementById('nav-placeholder').innerHTML = html;
        setTimeout(() => {
            if (typeof Flowbite !== 'undefined' && Flowbite.init) {
                Flowbite.init();
            }
            actualizarDatosDropdown();
        }, 100);
    } catch (error) {
        console.error('Error cargando la navegación:', error);
    }
}

function actualizarDatosDropdown() {
    if (userData) {
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        if (dropdownUserName) dropdownUserName.textContent = userData.nombre || userData.email.split('@')[0];
        if (dropdownUserEmail) dropdownUserEmail.textContent = userData.email;
    }
}

async function cargarDatosUsuario() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();
        if (data.success) {
            userData = data;
            actualizarDatosDropdown();
            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) logoutLink.href = 'logout.php';
            actualizarInfoUsuario();
            configurarMenu(data.rol);
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'login.html';
    }
}

function actualizarInfoUsuario() {
    const infoUsuario = document.getElementById('infoUsuario');
    if (!infoUsuario || !userData) return;
    let rolTexto = '';
    switch(userData.rol) {
        case 'Ofertante': rolTexto = 'Ofertante'; break;
        case 'institucion_publica': rolTexto = 'Institución Pública'; break;
        case 'privado': rolTexto = 'Usuario Privado'; break;
        default: rolTexto = userData.rol;
    }
    infoUsuario.innerHTML = `
        <i class="fas fa-user-circle"></i> 
        <strong>${rolTexto}</strong> · ${userData.email}
        <span class="ml-2 text-sm bg-blue-100 px-2 py-1 rounded">
            ${userData.tipo_contratacion === 'publica' ? 'Contratación Pública' : 'Contratación Privada'}
        </span>
    `;
}

function configurarMenu(rol) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    let menuItems = [];
    switch(rol) {
        case 'Ofertante':
            menuItems = [
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
                { nombre: 'Registrar Solicitud', icono: 'fa-file-signature', id: 'solicitud' },
                { nombre: 'Mis Solicitudes', icono: 'fa-folder-open', id: 'mis_solicitudes' },
                { nombre: 'Documentos', icono: 'fa-file-alt', id: 'documentos' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Concierge', icono: 'fa-concierge-bell', id: 'concierge' },
                { nombre: 'Legal', icono: 'fa-gavel', id: 'legal' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Business Intelligence', icono: 'fa-chart-pie', id: 'business_intelligence' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' },
                { nombre: 'Bienestar y Protección', icono: 'fa-heart', id: 'bienestar' }
            ];
            break;
        case 'institucion_publica':
            menuItems = [
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
                { nombre: 'Dashboard', icono: 'fa-chart-line', id: 'dashboard' },
                { nombre: 'Revisar Solicitudes', icono: 'fa-clipboard-list', id: 'revisar' },
                { nombre: 'Contratos Activos', icono: 'fa-file-contract', id: 'contratos' },
                { nombre: 'Estadísticas', icono: 'fa-chart-bar', id: 'estadisticas' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Concierge', icono: 'fa-concierge-bell', id: 'concierge' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Business Intelligence', icono: 'fa-chart-pie', id: 'business_intelligence' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' },
                { nombre: 'Bienestar y Protección', icono: 'fa-heart', id: 'bienestar' }
            ];
            break;
        case 'privado':
            menuItems = [
                { nombre: 'Mi Perfil', icono: 'fa-user', id: 'perfil' },
                { nombre: 'Consultar Licitaciones', icono: 'fa-search', id: 'consultar' },
                { nombre: 'Notificaciones', icono: 'fa-bell', id: 'notificaciones' },
                { nombre: 'Sourcing', icono: 'fa-search', id: 'sourcing' },
                { nombre: 'Automatización', icono: 'fa-robot', id: 'automatizacion' },
                { nombre: 'Financiamiento', icono: 'fa-coins', id: 'financiamiento' },
                { nombre: 'Compliance', icono: 'fa-shield-alt', id: 'compliance' },
                { nombre: 'Capacitación', icono: 'fa-chalkboard-teacher', id: 'capacitacion' },
                { nombre: 'Market Place', icono: 'fa-store', id: 'marketplace' }
            ];
            break;
        default: menuItems = [];
    }
    sidebarMenu.innerHTML = menuItems.map(item => `
        <li>
            <a href="#" class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group" data-modulo="${item.id}">
                <i class="fas ${item.icono} w-5 h-5 transition duration-75 group-hover:text-fg-brand"></i>
                <span class="ms-3">${item.nombre}</span>
            </a>
        </li>
    `).join('');
    document.querySelectorAll('[data-modulo]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            cargarModulo(link.getAttribute('data-modulo'));
        });
    });
}

function cargarModuloPorDefecto() {
    if (!userData) return;
    let moduloDefault = '';
    switch(userData.rol) {
        case 'Ofertante': moduloDefault = 'perfil'; break;
        case 'institucion_publica': moduloDefault = 'dashboard'; break;
        case 'privado': moduloDefault = 'perfil'; break;
        default: moduloDefault = 'sourcing';
    }
    cargarModulo(moduloDefault);
}

async function cargarModulo(modulo) {
    const mainContainer = document.getElementById('main-content-container');
    if (!mainContainer) return;
    try {
        const response = await fetch(`views/${modulo}.html`);
        if (!response.ok) throw new Error('Vista no encontrada');
        const html = await response.text();
        mainContainer.innerHTML = html;
        afterModuleLoad(modulo);
    } catch (error) {
        mainContainer.innerHTML = `
            <div class="p-6 bg-white rounded-lg shadow">
                <h2 class="text-2xl font-bold text-[#0b3b5b] mb-4">${modulo}</h2>
                <p class="text-gray-600">Módulo en construcción. Próximamente más funcionalidades.</p>
            </div>
        `;
    }
}

function afterModuleLoad(modulo) {
    if (modulo === 'perfil') {
        cargarFormularioProveedor();
    }
}

// ============================================================
// FUNCIONES PARA EL FORMULARIO DE PROVEEDORES
// ============================================================

async function cargarFormularioProveedor() {
    const ofertanteDiv = document.getElementById('ofertante-section');
    const generalDiv = document.getElementById('general-section');
    if (!userData) return;

    if (userData.rol === 'Ofertante') {
        if (ofertanteDiv) ofertanteDiv.style.display = 'block';
        if (generalDiv) generalDiv.style.display = 'none';

        const tipoSelect = document.getElementById('tipoProveedor');
        const formCampos = document.getElementById('formCampos');
        const proveedorForm = document.getElementById('proveedorForm');
        const actividadesSection = document.getElementById('actividades-section');
        const accionistasSection = document.getElementById('accionistas-section');

        if (!tipoSelect || !formCampos || !proveedorForm) return;

        // --- Funciones auxiliares ---
        async function cargarDatosPorTipo(tipo) {
            if (!tipo) {
                formCampos.innerHTML = '<p class="text-gray-500">Selecciona un tipo de proveedor</p>';
                return;
            }
            try {
                mostrarLoading(formCampos, true);
                const response = await fetch(`get_proveedor.php?tipo=${tipo}`);
                const result = await response.json();
                if (result.success && result.data) {
                    proveedorIdActual = result.data.id;
                    mostrarFormularioConDatos(tipo, result.data);
                } else {
                    proveedorIdActual = null;
                    mostrarFormularioVacio(tipo);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
                mostrarMensaje('formMessage', 'Error al cargar los datos', 'error');
                mostrarFormularioVacio(tipo);
            } finally {
                mostrarLoading(formCampos, false);
            }
        }

        function mostrarLoading(container, show) {
            if (show) {
                const loadingDiv = document.getElementById('loadingIndicator');
                if (!loadingDiv) {
                    const div = document.createElement('div');
                    div.id = 'loadingIndicator';
                    div.className = 'text-center py-4';
                    div.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando datos...';
                    container.innerHTML = '';
                    container.appendChild(div);
                }
            } else {
                const loadingDiv = document.getElementById('loadingIndicator');
                if (loadingDiv) loadingDiv.remove();
            }
        }

        function mostrarFormularioVacio(tipo) {
            if (tipo === 'fisica_empresarial') formCampos.innerHTML = generarCamposFisica();
            else if (tipo === 'moral') formCampos.innerHTML = generarCamposMoral();
            document.querySelectorAll('#proveedorForm input, #proveedorForm textarea, #proveedorForm select').forEach(field => {
                if (field.type !== 'submit' && field.type !== 'button') field.value = '';
            });
        }

        function mostrarFormularioConDatos(tipo, data) {
            if (tipo === 'fisica_empresarial') formCampos.innerHTML = generarCamposFisica();
            else if (tipo === 'moral') formCampos.innerHTML = generarCamposMoral();
            for (const [key, value] of Object.entries(data)) {
                if (value === null || value === undefined) continue;
                const input = document.querySelector(`#proveedorForm [name="${key}"]`);
                if (input) input.value = value;
            }
        }

        // Evento cambio de tipo de proveedor
        tipoSelect.addEventListener('change', async (e) => {
            const tipo = e.target.value;
            await cargarDatosPorTipo(tipo);

            if (tipo === 'fisica_empresarial' || tipo === 'moral') {
                actividadesSection.style.display = 'block';
                if (proveedorIdActual) {
                    cargarActividadesExistentes(proveedorIdActual);
                }
            } else {
                actividadesSection.style.display = 'none';
            }

            if (tipo === 'moral') {
                accionistasSection.style.display = 'block';
                if (proveedorIdActual) {
                    cargarAccionistas(proveedorIdActual);
                }
            } else {
                accionistasSection.style.display = 'none';
            }
        });

        // Generar campos de actividades
        document.getElementById('generarActividades').addEventListener('click', () => {
            const num = parseInt(document.getElementById('numActividades').value) || 0;
            generarTablaActividades(num);
        });

        // Envío del formulario principal
        proveedorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const tipo = tipoSelect.value;
            if (!tipo) {
                mostrarMensaje('formMessage', 'Selecciona un tipo de proveedor', 'error');
                return;
            }
            const submitBtn = proveedorForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Guardando...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(proveedorForm);
                formData.append('tipo_proveedor', tipo);
                const response = await fetch('save_proveedor.php', { method: 'POST', body: formData });
                const textResponse = await response.text();
                let result;
                try { result = JSON.parse(textResponse); } 
                catch (e) { throw new Error('Respuesta no válida del servidor'); }

                if (result.success) {
                    // Guardar actividades si corresponde
                    if (tipo === 'fisica_empresarial' || tipo === 'moral') {
                        if (!proveedorIdActual) {
                            const checkResp = await fetch(`get_proveedor.php?tipo=${tipo}`);
                            const checkData = await checkResp.json();
                            if (checkData.success && checkData.data) {
                                proveedorIdActual = checkData.data.id;
                            }
                        }
                        if (proveedorIdActual) {
                            await guardarActividades(proveedorIdActual);
                        }
                    }
                    mostrarMensaje('formMessage', result.message, 'success');
                    setTimeout(() => { window.location.reload(); }, 1500);
                } else {
                    mostrarMensaje('formMessage', result.message, 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                mostrarMensaje('formMessage', 'Error de conexión: ' + error.message, 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        const cancelarBtn = document.getElementById('cancelarForm');
        if (cancelarBtn) {
            cancelarBtn.addEventListener('click', () => {
                tipoSelect.value = '';
                formCampos.innerHTML = '<p class="text-gray-500">Selecciona un tipo de proveedor</p>';
                actividadesSection.style.display = 'none';
                accionistasSection.style.display = 'none';
            });
        }

        // Inicializar eventos del modal (ahora que los elementos existen)
        inicializarEventosModal();

        // Si ya hay tipo preseleccionado, cargar datos
        if (tipoSelect.value) {
            tipoSelect.dispatchEvent(new Event('change'));
        }
    } else {
        // Rol no Ofertante: mostrar Alta General
        if (ofertanteDiv) ofertanteDiv.style.display = 'none';
        if (generalDiv) generalDiv.style.display = 'block';

        try {
            const response = await fetch('get_proveedor.php?tipo=general');
            const result = await response.json();
            if (result.success && result.data) {
                const data = result.data;
                proveedorIdActual = data.id;
                for (const [key, value] of Object.entries(data)) {
                    if (value === null || value === undefined) continue;
                    const input = document.querySelector(`#generalForm [name="${key}"]`);
                    if (input) input.value = value;
                }
            }
        } catch (error) { console.error('Error cargando datos generales:', error); }

        const generalForm = document.getElementById('generalForm');
        if (generalForm) {
            generalForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = generalForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Guardando...';
                submitBtn.disabled = true;
                try {
                    const formData = new FormData(generalForm);
                    formData.append('tipo_proveedor', 'general');
                    const response = await fetch('save_proveedor.php', { method: 'POST', body: formData });
                    const textResponse = await response.text();
                    let result;
                    try { result = JSON.parse(textResponse); } 
                    catch (e) { throw new Error('Respuesta no válida'); }
                    if (result.success) {
                        mostrarMensaje('generalMessage', result.message, 'success');
                        setTimeout(() => { window.location.reload(); }, 1500);
                    } else {
                        mostrarMensaje('generalMessage', result.message, 'error');
                    }
                } catch (error) {
                    mostrarMensaje('generalMessage', 'Error de conexión: ' + error.message, 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
}

// ---------- Eventos del modal de accionistas (se llama cuando el DOM está listo) ----------
function inicializarEventosModal() {
    const btnAgregar = document.getElementById('btnAgregarAccionista');
    const btnCerrar = document.getElementById('btnCerrarModal');
    const btnGuardar = document.getElementById('btnGuardarAccionista');

    if (btnAgregar) {
        // Remover listeners previos (para evitar duplicados al cambiar de módulo)
        btnAgregar.replaceWith(btnAgregar.cloneNode(true));
        const newBtnAgregar = document.getElementById('btnAgregarAccionista');
        newBtnAgregar.addEventListener('click', () => {
            document.getElementById('accionistaId').value = '0';
            document.getElementById('accNombre').value = '';
            document.getElementById('accCurp').value = '';
            document.getElementById('accIne').value = '';
            document.getElementById('accFechaAlta').value = new Date().toISOString().slice(0,10);
            document.getElementById('modalTitle').textContent = 'Agregar Accionista';
            document.getElementById('modalAccionista').classList.remove('hidden');
        });
    }

    if (btnCerrar) {
        btnCerrar.replaceWith(btnCerrar.cloneNode(true));
        document.getElementById('btnCerrarModal').addEventListener('click', () => {
            document.getElementById('modalAccionista').classList.add('hidden');
        });
    }

    if (btnGuardar) {
        btnGuardar.replaceWith(btnGuardar.cloneNode(true));
        document.getElementById('btnGuardarAccionista').addEventListener('click', async () => {
            const id = document.getElementById('accionistaId').value;
            const nombre = document.getElementById('accNombre').value.trim();
            const curp = document.getElementById('accCurp').value.trim().toUpperCase();
            const ine = document.getElementById('accIne').value.trim().toUpperCase();
            const fecha_alta = document.getElementById('accFechaAlta').value;
            if (!nombre || !curp || !ine || !fecha_alta) {
                alert('Todos los campos son obligatorios');
                return;
            }
            if (!proveedorIdActual) {
                alert('Primero guarde los datos del proveedor');
                return;
            }
            const formData = new FormData();
            formData.append('proveedor_id', proveedorIdActual);
            formData.append('id', id);
            formData.append('nombre_completo', nombre);
            formData.append('curp', curp);
            formData.append('ine', ine);
            formData.append('fecha_alta', fecha_alta);
            try {
                const resp = await fetch('save_accionista.php', { method: 'POST', body: formData });
                const data = await resp.json();
                if (data.success) {
                    document.getElementById('modalAccionista').classList.add('hidden');
                    cargarAccionistas(proveedorIdActual);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert('Error de conexión');
            }
        });
    }
}

// ---------------- Actividades Económicas ----------------
async function cargarActividadesExistentes(proveedorId) {
    if (!proveedorId) return;
    try {
        const resp = await fetch(`get_actividades.php?proveedor_id=${proveedorId}`);
        const data = await resp.json();
        if (data.success && data.data.length > 0) {
            document.getElementById('numActividades').value = data.data.length;
            generarTablaActividades(data.data.length, data.data);
        } else {
            document.getElementById('numActividades').value = 0;
            generarTablaActividades(0);
        }
    } catch (e) { console.error(e); }
}

function generarTablaActividades(num, datos = []) {
    const container = document.getElementById('actividadesContainer');
    if (num <= 0) {
        container.innerHTML = '<p class="text-gray-500">No hay actividades registradas.</p>';
        return;
    }
    let html = `<table class="min-w-full border text-sm">
        <thead class="bg-gray-100"><tr><th class="border p-2">Actividad</th><th class="border p-2">%</th><th class="border p-2">Fecha Inicio</th></tr></thead><tbody>`;
    for (let i = 0; i < num; i++) {
        const act = datos[i] || {};
        html += `<tr>
            <td class="border p-1"><input type="text" name="actividad[]" value="${act.actividad || ''}" class="w-full border rounded px-2 py-1" required></td>
            <td class="border p-1"><input type="number" step="0.01" min="0" max="100" name="porcentaje[]" value="${act.porcentaje || ''}" class="w-full border rounded px-2 py-1"></td>
            <td class="border p-1"><input type="date" name="fecha_inicio[]" value="${act.fecha_inicio || ''}" class="w-full border rounded px-2 py-1" required></td>
        </tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

async function guardarActividades(proveedorId) {
    const actividades = [];
    const filas = document.querySelectorAll('#actividadesContainer tbody tr');
    filas.forEach(fila => {
        const inputs = fila.querySelectorAll('input');
        if (inputs.length >= 3) {
            actividades.push({
                actividad: inputs[0].value,
                porcentaje: inputs[1].value,
                fecha_inicio: inputs[2].value
            });
        }
    });
    const formData = new FormData();
    formData.append('proveedor_id', proveedorId);
    formData.append('actividades', JSON.stringify(actividades));
    try {
        const resp = await fetch('save_actividades.php', { method: 'POST', body: formData });
        const text = await resp.text(); // Obtener como texto primero
        console.log('Respuesta cruda save_actividades:', text); // Ver en consola
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('La respuesta no es JSON válido:', text);
            mostrarMensaje('formMessage', 'Error del servidor: respuesta inesperada', 'error');
            return;
        }
        if (!data.success) {
            mostrarMensaje('formMessage', 'Error al guardar actividades: ' + data.message, 'error');
        }
    } catch (e) {
        console.error('Error de conexión:', e);
        mostrarMensaje('formMessage', 'Error de conexión al guardar actividades', 'error');
    }
}

// ---------------- Relación de Accionistas ----------------
async function cargarAccionistas(proveedorId) {
    if (!proveedorId) return;
    try {
        const resp = await fetch(`get_accionistas.php?proveedor_id=${proveedorId}`);
        const data = await resp.json();
        if (data.success) {
            renderizarTablaAccionistas(data.data);
        }
    } catch (e) { console.error(e); }
}

function renderizarTablaAccionistas(accionistas) {
    const container = document.getElementById('accionistasTableContainer');
    if (!accionistas.length) {
        container.innerHTML = '<p class="text-gray-500">No hay accionistas registrados.</p>';
        return;
    }
    let html = `<table class="min-w-full border text-sm">
        <thead class="bg-gray-100"><tr><th class="border p-2">Nombre</th><th class="border p-2">CURP</th><th class="border p-2">INE</th><th class="border p-2">Fecha Alta</th><th class="border p-2">Estado</th><th class="border p-2">Acciones</th></tr></thead><tbody>`;
    accionistas.forEach(a => {
        const baja = a.fecha_baja ? `Baja: ${a.fecha_baja}` : 'Activo';
        const rowClass = a.fecha_baja ? 'bg-gray-100 text-gray-500' : '';
        html += `<tr class="${rowClass}">
            <td class="border p-1">${a.nombre_completo}</td>
            <td class="border p-1">${a.curp}</td>
            <td class="border p-1">${a.ine}</td>
            <td class="border p-1">${a.fecha_alta}</td>
            <td class="border p-1">${baja}</td>
            <td class="border p-1">
                ${!a.fecha_baja ? `<button type="button" onclick="editarAccionista(${a.id})" class="text-blue-600 mr-2"><i class="fas fa-edit"></i></button>
                <button type="button" onclick="darBajaAccionista(${a.id})" class="text-red-600"><i class="fas fa-trash"></i></button>` : '-'}
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Funciones globales para los botones de la tabla
window.editarAccionista = function(id) {
    const fila = document.querySelector(`button[onclick="editarAccionista(${id})"]`).closest('tr');
    const celdas = fila.querySelectorAll('td');
    const nombre = celdas[0].textContent;
    const curp = celdas[1].textContent;
    const ine = celdas[2].textContent;
    const fecha_alta = celdas[3].textContent;
    document.getElementById('accionistaId').value = id;
    document.getElementById('accNombre').value = nombre;
    document.getElementById('accCurp').value = curp;
    document.getElementById('accIne').value = ine;
    document.getElementById('accFechaAlta').value = fecha_alta;
    document.getElementById('modalTitle').textContent = 'Editar Accionista';
    document.getElementById('modalAccionista').classList.remove('hidden');
};

window.darBajaAccionista = async function(id) {
    if (!confirm('¿Dar de baja a este accionista? Se registrará la fecha de baja.')) return;
    const formData = new FormData();
    formData.append('id', id);
    try {
        const resp = await fetch('delete_accionista.php', { method: 'POST', body: formData });
        const data = await resp.json();
        if (data.success) {
            if (proveedorIdActual) cargarAccionistas(proveedorIdActual);
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Error de conexión');
    }
};

// ============================================================
// Funciones HTML auxiliares
// ============================================================
function generarCamposFisica() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${campoBaseHTML()}
            <div class="md:col-span-2">
                <label class="block text-gray-700 font-medium mb-1">Actividades:</label>
                <textarea name="actividades" class="w-full border p-2 rounded" rows="3" placeholder="Describe las actividades empresariales..."></textarea>
            </div>
        </div>
    `;
}

function generarCamposMoral() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${campoBaseHTML()}
            <div class="md:col-span-2">
                <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS DEL ACTA CONSTITUTIVA</h3>
            </div>
            <div class="md:col-span-2">
                <label class="block text-gray-700 font-medium mb-1">Objeto Social:</label>
                <textarea name="objeto_social" class="w-full border p-2 rounded" rows="3" placeholder="Describe el objeto social..."></textarea>
            </div>
            <div><label class="block text-gray-700">Núm. Acta Constitutiva:</label><input type="text" name="num_acta_constitutiva" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha Acta Constitutiva:</label><input type="date" name="fecha_acta_constitutiva" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Núm. Notario:</label><input type="text" name="num_notario_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Nombre del Notario:</label><input type="text" name="nombre_notario_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Ciudad donde se constituyó:</label><input type="text" name="ciudad_acta" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Folio Mercantil:</label><input type="text" name="folio_mercantil" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha de Registro:</label><input type="date" name="fecha_registro_acta" class="w-full border p-2 rounded"></div>
            <div class="md:col-span-2">
                <h3 class="font-bold text-[#0b3b5b] mt-4 mb-2 border-b pb-1">PODER NOTARIAL (Solo si aplica)</h3>
            </div>
            <div><label class="block text-gray-700">Núm. de Poder Notarial:</label><input type="text" name="poder_notarial_num" class="w-full border p-2 rounded" placeholder="N/A si no aplica"></div>
            <div><label class="block text-gray-700">Fecha del Poder Notarial:</label><input type="date" name="poder_notarial_fecha" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Núm. del Notario:</label><input type="text" name="poder_notarial_notario_num" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Nombre del Notario:</label><input type="text" name="poder_notarial_notario_nombre" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Ciudad donde se registró:</label><input type="text" name="poder_notarial_ciudad" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Folio Mercantil:</label><input type="text" name="poder_notarial_folio" class="w-full border p-2 rounded"></div>
            <div><label class="block text-gray-700">Fecha de Registro:</label><input type="date" name="poder_notarial_fecha_registro" class="w-full border p-2 rounded"></div>
            <div class="md:col-span-2">
                <label class="block text-gray-700">Apoderados:</label>
                <textarea name="apoderados" class="w-full border p-2 rounded" rows="2" placeholder="Nombres de los apoderados..."></textarea>
            </div>
        </div>
    `;
}

function campoBaseHTML() {
    return `
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS FISCALES</h3>
        </div>
        <div><label class="block text-gray-700">RFC:</label><input type="text" name="rfc" class="w-full border p-2 rounded" required maxlength="13" placeholder="RFC (13 caracteres)"></div>
        <div><label class="block text-gray-700">Razón Social:</label><input type="text" name="razon_social" class="w-full border p-2 rounded" required></div>
        <div><label class="block text-gray-700">Régimen Fiscal:</label><input type="text" name="regimen_fiscal" class="w-full border p-2 rounded" required></div>
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DOMICILIO FISCAL</h3>
        </div>
        <div><label class="block text-gray-700">Vialidad:</label><input type="text" name="nombre_vialidad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Núm. Exterior:</label><input type="text" name="num_exterior" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Núm. Interior:</label><input type="text" name="num_interior" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Colonia o Fraccionamiento:</label><input type="text" name="colonia" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Localidad:</label><input type="text" name="localidad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Código Postal:</label><input type="text" name="codigo_postal" class="w-full border p-2 rounded" maxlength="5"></div>
        <div><label class="block text-gray-700">Ciudad:</label><input type="text" name="ciudad" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Estado:</label><input type="text" name="estado" class="w-full border p-2 rounded"></div>
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">CONTACTO</h3>
        </div>
        <div><label class="block text-gray-700">Teléfono:</label><input type="text" name="telefono" class="w-full border p-2 rounded" placeholder="Ej: 5551234567"></div>
        <div><label class="block text-gray-700">Extensión:</label><input type="text" name="extension" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Fax:</label><input type="text" name="fax" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Extensión Fax:</label><input type="text" name="fax_extension" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Representante Legal:</label><input type="text" name="representante_legal" class="w-full border p-2 rounded"></div>
        <div class="md:col-span-2"><label class="block text-gray-700">Correo Electrónico:</label><input type="email" name="email" class="w-full border p-2 rounded" required></div>
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-2 mb-2 border-b pb-1">DATOS BANCARIOS</h3>
        </div>
        <div><label class="block text-gray-700">Banco:</label><input type="text" name="banco" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Sucursal:</label><input type="text" name="sucursal_bancaria" class="w-full border p-2 rounded"></div>
        <div><label class="block text-gray-700">Número de Cuenta:</label><input type="text" name="cuenta_bancaria" class="w-full border p-2 rounded"></div>
        <div class="md:col-span-2"><label class="block text-gray-700">CLABE Interbancaria:</label><input type="text" name="clabe_interbancaria" class="w-full border p-2 rounded" maxlength="18"></div>
    `;
}

function mostrarMensaje(containerId, mensaje, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = mensaje;
    container.className = `mt-2 text-sm ${tipo === 'error' ? 'text-red-600' : 'text-green-600'}`;
    setTimeout(() => { container.textContent = ''; }, 5000);
}