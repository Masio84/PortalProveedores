// Agrega esto dentro de afterModuleLoad(modulo)
// if (modulo === 'concierge') {
//     inicializarConcierge();
// }

async function inicializarConcierge() {
    const nivel1 = document.getElementById('categoriaNivel1');
    const nivel2 = document.getElementById('categoriaNivel2');
    const nivel3 = document.getElementById('categoriaNivel3');
    const inputBusqueda = document.getElementById('busquedaConcierge');
    const btnBuscar = document.getElementById('btnBuscarConcierge');
    const btnLimpiar = document.getElementById('btnLimpiarConcierge');
    const tabla = document.getElementById('tablaResultadosConcierge');
    const mensaje = document.getElementById('conciergeMensaje');

    if (!nivel1 || !nivel2 || !nivel3 || !tabla) return;

    function mostrarMensajeConcierge(texto, tipo = 'info') {
        mensaje.textContent = texto;
        mensaje.className = tipo === 'error' ? 'text-sm mb-4 text-red-600' : 'text-sm mb-4 text-gray-600';
    }

    function optionDefault(texto) {
        return `<option value="">${texto}</option>`;
    }

    function llenarSelect(select, datos, textoDefault) {
        select.innerHTML = optionDefault(textoDefault);
        datos.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.codigo} - ${item.nombre}`;
            select.appendChild(option);
        });
    }

    async function cargarCategorias(nivel, parentId = 0) {
        const resp = await fetch(`get_categorias_concierge.php?nivel=${nivel}&parent_id=${parentId}`);
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Error al cargar categorías');
        return data.data;
    }

    async function buscarConcierge() {
        const params = new URLSearchParams({
            nivel1: nivel1.value || '0',
            nivel2: nivel2.value || '0',
            nivel3: nivel3.value || '0',
            q: inputBusqueda.value.trim()
        });

        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="border p-4 text-center text-gray-500">
                    Buscando...
                </td>
            </tr>
        `;

        try {
            const resp = await fetch(`search_concierge.php?${params.toString()}`);
            const data = await resp.json();

            if (!data.success) {
                mostrarMensajeConcierge(data.message || 'Error al buscar', 'error');
                return;
            }

            if (!data.data.length) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="4" class="border p-4 text-center text-gray-500">
                            No se encontraron usuarios registrados con esos criterios.
                        </td>
                    </tr>
                `;
                mostrarMensajeConcierge('Sin resultados. Intenta con otra palabra, categoría o proveedor.');
                return;
            }

            tabla.innerHTML = data.data.map(row => {
                const nombre = row.nombre_comercial || row.razon_social || 'Sin nombre';
                const email = row.email_contacto || row.email_usuario || '';
                const categoria = [
                    row.nivel_1_codigo ? `${row.nivel_1_codigo} - ${row.nivel_1_nombre}` : '',
                    row.nivel_2_codigo ? `${row.nivel_2_codigo} - ${row.nivel_2_nombre}` : '',
                    row.nivel_3_codigo ? `${row.nivel_3_codigo} - ${row.nivel_3_nombre}` : ''
                ].filter(Boolean).join('<br>');

                return `
                    <tr>
                        <td class="border p-2 align-top">
                            <strong>${escapeHtml(nombre)}</strong><br>
                            <span class="text-gray-500">${escapeHtml(row.razon_social || '')}</span><br>
                            <span class="text-xs text-gray-500">${escapeHtml(row.rol_usuario || '')} · ${escapeHtml(row.tipo_proveedor || '')}</span>
                        </td>
                        <td class="border p-2 align-top">
                            ${escapeHtml(row.descripcion_actividad || 'Sin descripción registrada')}<br>
                            <span class="text-xs text-gray-500">${escapeHtml(row.palabras_clave || '')}</span>
                        </td>
                        <td class="border p-2 align-top">${categoria || '<span class="text-gray-400">Sin categoría</span>'}</td>
                        <td class="border p-2 align-top">
                            ${email ? `<a class="text-blue-600 hover:underline" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : 'Sin correo'}<br>
                            <span class="text-gray-500">${escapeHtml(row.telefono || '')}</span>
                        </td>
                    </tr>
                `;
            }).join('');

            mostrarMensajeConcierge(`${data.data.length} resultado(s) encontrado(s).`);
        } catch (error) {
            console.error(error);
            mostrarMensajeConcierge('Error de conexión al buscar usuarios registrados.', 'error');
        }
    }

    try {
        const datosNivel1 = await cargarCategorias(1);
        llenarSelect(nivel1, datosNivel1, '-- Selecciona el primer nivel --');
    } catch (error) {
        console.error(error);
        mostrarMensajeConcierge('No se pudieron cargar las categorías.', 'error');
    }

    nivel1.addEventListener('change', async () => {
        nivel2.innerHTML = optionDefault('-- Selecciona el segundo nivel --');
        nivel3.innerHTML = optionDefault('-- Selecciona el tercer nivel --');
        nivel2.disabled = true;
        nivel3.disabled = true;

        if (!nivel1.value) {
            buscarConcierge();
            return;
        }

        try {
            const datosNivel2 = await cargarCategorias(2, nivel1.value);
            llenarSelect(nivel2, datosNivel2, '-- Selecciona el segundo nivel --');
            nivel2.disabled = false;
            buscarConcierge();
        } catch (error) {
            mostrarMensajeConcierge(error.message, 'error');
        }
    });

    nivel2.addEventListener('change', async () => {
        nivel3.innerHTML = optionDefault('-- Selecciona el tercer nivel --');
        nivel3.disabled = true;

        if (!nivel2.value) {
            buscarConcierge();
            return;
        }

        try {
            const datosNivel3 = await cargarCategorias(3, nivel2.value);
            llenarSelect(nivel3, datosNivel3, '-- Selecciona el tercer nivel --');
            nivel3.disabled = false;
            buscarConcierge();
        } catch (error) {
            mostrarMensajeConcierge(error.message, 'error');
        }
    });

    nivel3.addEventListener('change', buscarConcierge);
    btnBuscar.addEventListener('click', buscarConcierge);
    inputBusqueda.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') buscarConcierge();
    });

    btnLimpiar.addEventListener('click', () => {
        nivel1.value = '';
        nivel2.innerHTML = optionDefault('-- Selecciona el segundo nivel --');
        nivel3.innerHTML = optionDefault('-- Selecciona el tercer nivel --');
        nivel2.disabled = true;
        nivel3.disabled = true;
        inputBusqueda.value = '';
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="border p-4 text-center text-gray-500">
                    Selecciona una categoría o escribe una búsqueda para encontrar usuarios registrados.
                </td>
            </tr>
        `;
        mostrarMensajeConcierge('');
    });
}
