async function cargarActividadesExistentes(proveedorId) {
    if (!proveedorId) return;
    try {
        const resp = await fetch(`get_actividades.php?proveedor_id=${proveedorId}`);
        const data = await resp.json();
        if (data.success) {
            // Reemplaza completamente la tabla con los datos existentes
            generarTablaActividades(data.data, true);  // true = reemplazar
        } else {
            generarTablaActividades([], true); // tabla vacía
        }
    } catch (e) { console.error(e); }
}

function generarTablaActividades(datos, reemplazar = true) {
    const container = document.getElementById('actividadesContainer');
    const tbodyId = 'actividadesTbody';
    
    // Crear estructura de tabla si no existe
    if (reemplazar || !document.getElementById(tbodyId)) {
        container.innerHTML = `
            <table class="min-w-full border text-sm">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border p-2">Actividad</th>
                        <th class="border p-2">%</th>
                        <th class="border p-2">Fecha Inicio</th>
                        <th class="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody id="${tbodyId}"></tbody>
            </table>
        `;
    }
    
    const tbody = document.getElementById(tbodyId);
    
    if (reemplazar) {
        tbody.innerHTML = ''; // limpiar
        datos.forEach(act => agregarFilaActividad(tbody, act));
    } else {
        // Agregar filas vacías (tantas como indique el usuario)
        const num = parseInt(document.getElementById('numActividades').value) || 1;
        for (let i = 0; i < num; i++) {
            agregarFilaActividad(tbody, { id: 0, actividad: '', porcentaje: '', fecha_inicio: '' });
        }
    }
}

function agregarFilaActividad(tbody, act) {
    const row = tbody.insertRow();
    row.setAttribute('data-id', act.id || 0);
    row.innerHTML = `
        <td class="border p-1"><input type="text" name="actividad[]" value="${escapeHtml(act.actividad || '')}" class="w-full border rounded px-2 py-1" required></td>
        <td class="border p-1"><input type="number" step="0.01" min="0" max="100" name="porcentaje[]" value="${act.porcentaje || ''}" class="w-full border rounded px-2 py-1"></td>
        <td class="border p-1"><input type="date" name="fecha_inicio[]" value="${act.fecha_inicio || ''}" class="w-full border rounded px-2 py-1" required></td>
        <td class="border p-1 text-center">
            ${act.id ? `<button type="button" onclick="eliminarActividad(${act.id})" class="text-red-600 hover:underline"><i class="fas fa-trash-alt"></i> Eliminar</button>` : '<span class="text-gray-400">Nuevo</span>'}
        </td>
    `;
}

window.eliminarActividad = async function(id) {
    if (!confirm('¿Estás seguro de eliminar esta actividad económica?')) return;
    if (!proveedorIdActual) {
        alert('Primero guarda los datos generales del proveedor');
        return;
    }
    
    const row = document.querySelector(`#actividadesContainer tbody tr[data-id='${id}']`);
    if (row) {
        // Si es una fila nueva (id 0), solo la quitamos del DOM
        if (id === 0) {
            row.remove();
            return;
        }
        // Si tiene ID real, llamamos al servidor
        const formData = new FormData();
        formData.append('id', id);
        formData.append('proveedor_id', proveedorIdActual);
        try {
            const resp = await fetch('delete_actividad.php', { method: 'POST', body: formData });
            const data = await resp.json();
            if (data.success) {
                row.remove();
            } else {
                alert(data.message);
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión al eliminar la actividad');
        }
    }
};

async function guardarActividades(proveedorId) {
    const actividades = [];
    const filas = document.querySelectorAll('#actividadesContainer tbody tr');
    filas.forEach(fila => {
        const actInput = fila.querySelector('[name="actividad[]"]');
        const porInput = fila.querySelector('[name="porcentaje[]"]');
        const fecInput = fila.querySelector('[name="fecha_inicio[]"]');
        if (actInput && porInput && fecInput) {
            actividades.push({
                actividad: actInput.value,
                porcentaje: porInput.value,
                fecha_inicio: fecInput.value
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

