async function cargarApoderados(proveedorId) {
    if (!proveedorId) return;
    try {
        const resp = await fetch(`get_apoderados.php?proveedor_id=${proveedorId}`);
        const data = await resp.json();
        if (data.success) {
            renderizarTablaApoderados(data.data);
        }
    } catch (e) { console.error(e); }
}

function renderizarTablaApoderados(apoderados) {
     const container = document.getElementById('apoderadosTableContainer');
    if (!container) return;
    if (!apoderados.length) {
        apoderadosTableContainer.innerHTML = '<p class="text-gray-500">No hay apoderados registrados.</p>';
        return;
    }
    let html = `<table class="min-w-full border text-sm">
        <thead class="bg-gray-100">
            <tr>
                <th class="border p-2">Nombre</th>
                <th class="border p-2">CURP</th>
                <th class="border p-2">INE</th>
                <th class="border p-2">Fecha Alta</th>
                <th class="border p-2">Estado</th>
                <th class="border p-2">Acciones</th>
            </tr>
        </thead>
        <tbody>`;
    apoderados.forEach(a => {
        const baja = a.fecha_baja ? `Baja: ${a.fecha_baja}` : 'Activo';
        const rowClass = a.fecha_baja ? 'bg-gray-100 text-gray-500' : '';
        html += `<tr class="${rowClass}">
            <td class="border p-1">${escapeHtml(a.nombre_completo)}</td>
            <td class="border p-1">${escapeHtml(a.curp)}</td>
            <td class="border p-1">${escapeHtml(a.ine)}</td>
            <td class="border p-1">${a.fecha_alta}</td>
            <td class="border p-1">${baja}</td>
            <td class="border p-1">
                ${!a.fecha_baja ? `<button type="button" onclick="editarApoderado(${a.id})" class="text-blue-600 mr-2"><i class="fas fa-edit"></i></button>
                <button type="button" onclick="darBajaApoderado(${a.id})" class="text-red-600"><i class="fas fa-trash"></i></button>` : '-'}
            </td>
        </tr>`;
    });
    html += '</tbody></table>';
    apoderadosTableContainer.innerHTML = html;
}


function inicializarEventosModalApoderado() {
    const btnAgregar = document.getElementById('btnAgregarApoderado');
    const btnCerrar = document.getElementById('btnCerrarModalApoderado');
    const btnGuardar = document.getElementById('btnGuardarApoderado');

    if (btnAgregar) {
        btnAgregar.replaceWith(btnAgregar.cloneNode(true));
        const newBtn = document.getElementById('btnAgregarApoderado');
        newBtn.addEventListener('click', () => {
            document.getElementById('apoderadoId').value = '0';
            document.getElementById('apodNombre').value = '';
            document.getElementById('apodCurp').value = '';
            document.getElementById('apodIne').value = '';
            document.getElementById('apodFechaAlta').value = new Date().toISOString().slice(0,10);
            document.getElementById('modalTitleApoderado').textContent = 'Agregar Apoderado';
            document.getElementById('modalApoderado').classList.remove('hidden');
        });
    }

    if (btnCerrar) {
        btnCerrar.replaceWith(btnCerrar.cloneNode(true));
        document.getElementById('btnCerrarModalApoderado').addEventListener('click', () => {
            document.getElementById('modalApoderado').classList.add('hidden');
        });
    }

    if (btnGuardar) {
        btnGuardar.replaceWith(btnGuardar.cloneNode(true));
        document.getElementById('btnGuardarApoderado').addEventListener('click', async () => {
            const id = document.getElementById('apoderadoId').value;
            const nombre = document.getElementById('apodNombre').value.trim();
            const curp = document.getElementById('apodCurp').value.trim().toUpperCase();
            const ine = document.getElementById('apodIne').value.trim().toUpperCase();
            const fecha_alta = document.getElementById('apodFechaAlta').value;
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
                const resp = await fetch('save_apoderado.php', { method: 'POST', body: formData });
                const data = await resp.json();
                if (data.success) {
                    document.getElementById('modalApoderado').classList.add('hidden');
                    cargarApoderados(proveedorIdActual);
                } else {
                    alert(data.message);
                }
            } catch (e) {
                alert('Error de conexión');
            }
        });
    }
}

// Funciones globales para editar y dar baja
window.editarApoderado = function(id) {
    const fila = document.querySelector(`button[onclick="editarApoderado(${id})"]`).closest('tr');
    const celdas = fila.querySelectorAll('td');
    const nombre = celdas[0].textContent;
    const curp = celdas[1].textContent;
    const ine = celdas[2].textContent;
    const fecha_alta = celdas[3].textContent;
    document.getElementById('apoderadoId').value = id;
    document.getElementById('apodNombre').value = nombre;
    document.getElementById('apodCurp').value = curp;
    document.getElementById('apodIne').value = ine;
    document.getElementById('apodFechaAlta').value = fecha_alta;
    document.getElementById('modalTitleApoderado').textContent = 'Editar Apoderado';
    document.getElementById('modalApoderado').classList.remove('hidden');
};

window.darBajaApoderado = async function(id) {
    if (!confirm('¿Dar de baja a este apoderado? Se registrará la fecha de baja.')) return;
    const formData = new FormData();
    formData.append('id', id);
    try {
        const resp = await fetch('delete_apoderado.php', { method: 'POST', body: formData });
        const data = await resp.json();
        if (data.success) {
            if (proveedorIdActual) cargarApoderados(proveedorIdActual);
        } else {
            alert(data.message);
        }
    } catch (e) {
        alert('Error de conexión');
    }
};
