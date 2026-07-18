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
        mensaje.textContent = texto || '';
        mensaje.className = tipo === 'error'
            ? 'text-sm mb-4 text-red-600'
            : 'text-sm mb-4 text-gray-600';
    }

    function optionDefault(texto) {
        return `<option value="">${texto}</option>`;
    }

    function llenarSelect(select, datos, textoDefault) {
        select.innerHTML = optionDefault(textoDefault);

        datos.forEach(item => {
            const option = document.createElement('option');

            option.value = item.codigo || item.id;
            option.textContent = `${item.codigo} - ${item.nombre}`;

            select.appendChild(option);
        });
    }

    async function cargarCategorias(nivel, parentId = '') {
        const resp = await fetch(`get_categorias_concierge.php?nivel=${nivel}&parent_id=${parentId}`);
        const data = await resp.json();

        if (!data.success) {
            throw new Error(data.message || 'Error al cargar categorías');
        }

        return data.data;
    }

    async function buscarConcierge() {
        const params = new URLSearchParams({
            nivel1: nivel1.value || '',
            nivel2: nivel2.value || '',
            nivel3: nivel3.value || '',
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

            if (!data.data || !data.data.length) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="4" class="border p-4 text-center text-gray-500">
                            No se encontraron resultados.
                        </td>
                    </tr>
                `;
                mostrarMensajeConcierge('Sin resultados. Intenta con otra palabra o categoría.');
                return;
            }

            tabla.innerHTML = data.data.map(row => {
                const nombreProveedor =
                    row.nombre_comercial ||
                    row.razon_social ||
                    'Sin nombre registrado';

                const razonSocial = row.razon_social || '';

                const rolTipo = [
                    row.rol || '',
                    row.tipo_proveedor || ''
                ].filter(Boolean).join(' · ');

                const actividad =
                    row.descripcion_actividad ||
                    'Sin descripción registrada';

                const palabrasClave = row.palabras_clave
                    ? `<div class="text-xs text-gray-500 mt-1">${escapeHtml(row.palabras_clave)}</div>`
                    : '';

                const partesCategoria = [];

                if (row.nivel1_codigo && row.nivel1_nombre) {
                    partesCategoria.push(`${row.nivel1_codigo} - ${row.nivel1_nombre}`);
                }

                if (row.nivel2_codigo && row.nivel2_nombre) {
                    partesCategoria.push(`${row.nivel2_codigo} - ${row.nivel2_nombre}`);
                }

                if (row.nivel3_codigo && row.nivel3_nombre) {
                    partesCategoria.push(`${row.nivel3_codigo} - ${row.nivel3_nombre}`);
                }

                const categoria = partesCategoria.length
                    ? partesCategoria.map(escapeHtml).join('<br>')
                    : 'Sin categoría';

                const correo = row.email || row.correo || 'Sin correo';
                const telefono = row.telefono || 'Sin teléfono';

                return `
                    <tr>
                        <td class="border p-2 align-top">
                            <strong>${escapeHtml(nombreProveedor)}</strong><br>
                            <span class="text-gray-600">${escapeHtml(razonSocial)}</span><br>
                            <span class="text-xs text-gray-500">${escapeHtml(rolTipo)}</span>
                        </td>

                        <td class="border p-2 align-top">
                            ${escapeHtml(actividad)}
                            ${palabrasClave}
                        </td>

                        <td class="border p-2 align-top">
                            ${categoria}
                        </td>

                        <td class="border p-2 align-top">
                            ${escapeHtml(correo)}<br>
                            <span class="text-gray-600">${escapeHtml(telefono)}</span>
                        </td>
                    </tr>
                `;
            }).join('');

            mostrarMensajeConcierge(`${data.data.length} resultado(s) encontrado(s).`);
        } catch (error) {
            console.error(error);
            mostrarMensajeConcierge('Error de conexión al buscar proveedores.', 'error');
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

    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarConcierge);
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') buscarConcierge();
        });
    }

    if (btnLimpiar) {
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
                        Selecciona una categoría o escribe una búsqueda.
                    </td>
                </tr>
            `;

            mostrarMensajeConcierge('');
        });
    }
}

function escapeHtml(value) {
    if (value === null || value === undefined) return '';

    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}