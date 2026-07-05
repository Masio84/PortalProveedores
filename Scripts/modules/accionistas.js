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
            const porcentaje = document.getElementById('accPorcentaje').value;
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
            formData.append('porcentaje', porcentaje);
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
        <thead class="bg-gray-100"><tr><th class="border p-2">Nombre</th><th class="border p-2">CURP</th><th class="border p-2">INE</th><th class="border p-2">% Participación</th><th class="border p-2">Fecha Alta</th><th class="border p-2">Estado</th><th class="border p-2">Acciones</th></tr></thead><tbody>`;
    accionistas.forEach(a => {
        const baja = a.fecha_baja ? `Baja: ${a.fecha_baja}` : 'Activo';
        const rowClass = a.fecha_baja ? 'bg-gray-100 text-gray-500' : '';
        html += `<tr class="${rowClass}">
            <td class="border p-1">${a.nombre_completo}</td>
            <td class="border p-1">${a.curp}</td>
            <td class="border p-1">${a.ine}</td>
            <td class="border p-1">${a.porcentaje_participacion}%</td>
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
    const porcentaje = celdas[3].textContent.replace('%', '');
    const fecha_alta = celdas[4].textContent;
    document.getElementById('accionistaId').value = id;
    document.getElementById('accNombre').value = nombre;
    document.getElementById('accCurp').value = curp;
    document.getElementById('accIne').value = ine;
    document.getElementById('accPorcentaje').value = porcentaje;
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
