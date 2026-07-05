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
        const apoderadosSection = document.getElementById('apoderados-section');
        const apoderadosTableContainer = document.getElementById('apoderadosTableContainer');

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
            inicializarCategoriasPerfil('#proveedorForm');
        }

        function mostrarFormularioConDatos(tipo, data) {
            if (tipo === 'fisica_empresarial') formCampos.innerHTML = generarCamposFisica();
            else if (tipo === 'moral') formCampos.innerHTML = generarCamposMoral();
            for (const [key, value] of Object.entries(data)) {
                if (value === null || value === undefined) continue;
                const input = document.querySelector(`#proveedorForm [name="${key}"]`);
                if (input && !input.matches('[data-cat-nivel]')) input.value = value;
            }
            inicializarCategoriasPerfil('#proveedorForm', data);
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
if (tipo === 'fisica_empresarial' || tipo === 'moral') {
    if (apoderadosSection) {
        apoderadosSection.style.display = 'block';
        if (proveedorIdActual) cargarApoderados(proveedorIdActual);
    } else {
        console.warn('Sección Apoderados Legales no encontrada en el HTML');
    }
} else {
    if (apoderadosSection) {
        apoderadosSection.style.display = 'none';
    }
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
    generarTablaActividades([], false); // false = agregar filas al final
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
        inicializarEventosModalApoderado();

        // Si ya hay tipo preseleccionado, cargar datos
        if (tipoSelect.value) {
            tipoSelect.dispatchEvent(new Event('change'));
        }
    } else {
        // Rol no Ofertante: mostrar Alta General
        if (ofertanteDiv) ofertanteDiv.style.display = 'none';
        if (generalDiv) generalDiv.style.display = 'block';

        let datosGenerales = {};
        try {
            const response = await fetch('get_proveedor.php?tipo=general');
            const result = await response.json();
            if (result.success && result.data) {
                datosGenerales = result.data;
                proveedorIdActual = datosGenerales.id;
                for (const [key, value] of Object.entries(datosGenerales)) {
                    if (value === null || value === undefined) continue;
                    const input = document.querySelector(`#generalForm [name="${key}"]`);
                    if (input && !input.matches('[data-cat-nivel]')) input.value = value;
                }
            }
        } catch (error) { console.error('Error cargando datos generales:', error); }

        inicializarCategoriasPerfil('#generalForm', datosGenerales);

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



// ============================================================
// Categorías Concierge dentro del perfil del proveedor/usuario
// ============================================================
async function obtenerCategoriasConcierge(nivel, parentId = '') {
    const params = new URLSearchParams({ nivel });
    if (parentId) params.append('parent_id', parentId);

    const response = await fetch(`get_categorias_concierge.php?${params.toString()}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Error al cargar categorías Concierge');
    return data.data || [];
}

function llenarSelectCategorias(select, datos, textoDefault) {
    if (!select) return;
    select.innerHTML = `<option value="">${textoDefault}</option>`;
    datos.forEach(item => {
        const option = document.createElement('option');
        option.value = item.codigo;
        option.textContent = `${item.codigo} - ${item.nombre}`;
        select.appendChild(option);
    });
}

async function inicializarCategoriasPerfil(formSelector, data = {}) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const nivel1 = form.querySelector('[name="categoria_nivel_1"]');
    const nivel2 = form.querySelector('[name="categoria_nivel_2"]');
    const nivel3 = form.querySelector('[name="categoria_nivel_3"]');

    if (!nivel1 || !nivel2 || !nivel3) return;

    const valor1 = data.categoria_nivel_1 || '';
    const valor2 = data.categoria_nivel_2 || '';
    const valor3 = data.categoria_nivel_3 || '';

    async function cargarNivel2(parentValue = nivel1.value, selectedValue = '') {
        llenarSelectCategorias(nivel2, [], '-- Selecciona --');
        llenarSelectCategorias(nivel3, [], '-- Selecciona --');
        nivel2.disabled = true;
        nivel3.disabled = true;

        if (!parentValue) return;
        const datos = await obtenerCategoriasConcierge('2', parentValue);
        llenarSelectCategorias(nivel2, datos, '-- Selecciona --');
        nivel2.disabled = false;
        if (selectedValue) nivel2.value = selectedValue;
    }

    async function cargarNivel3(parentValue = nivel2.value, selectedValue = '') {
        llenarSelectCategorias(nivel3, [], '-- Selecciona --');
        nivel3.disabled = true;

        if (!parentValue) return;
        const datos = await obtenerCategoriasConcierge('3', parentValue);
        llenarSelectCategorias(nivel3, datos, '-- Selecciona --');
        nivel3.disabled = false;
        if (selectedValue) nivel3.value = selectedValue;
    }

    nivel1.onchange = async () => {
        try {
            await cargarNivel2(nivel1.value);
        } catch (error) {
            console.error(error);
            mostrarMensaje('formMessage', 'No se pudieron cargar las categorías de segundo nivel', 'error');
        }
    };

    nivel2.onchange = async () => {
        try {
            await cargarNivel3(nivel2.value);
        } catch (error) {
            console.error(error);
            mostrarMensaje('formMessage', 'No se pudieron cargar las categorías de tercer nivel', 'error');
        }
    };

    try {
        const datosNivel1 = await obtenerCategoriasConcierge('1');
        llenarSelectCategorias(nivel1, datosNivel1, '-- Selecciona --');
        if (valor1) {
            nivel1.value = valor1;
            await cargarNivel2(valor1, valor2);
        }
        if (valor2) {
            await cargarNivel3(valor2, valor3);
        }
    } catch (error) {
        console.error(error);
    }
}
