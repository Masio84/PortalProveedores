function generarCamposFisica() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${campoBaseHTML()}
            
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


function camposConciergeProveedorHTML() {
    return `
        <div class="md:col-span-2">
            <h3 class="font-bold text-[#0b3b5b] mt-4 mb-2 border-b pb-1">INFORMACIÓN PARA CONCIERGE</h3>
            <p class="text-sm text-gray-500 mb-3">
                Esta información permitirá que otros usuarios encuentren tu perfil en el buscador Concierge.
            </p>
        </div>
        <div>
            <label class="block text-gray-700">Nombre comercial:</label>
            <input type="text" name="nombre_comercial" class="w-full border p-2 rounded" placeholder="Ej: Servicios Integrales Campos">
        </div>
        <div>
            <label class="block text-gray-700">Palabras clave:</label>
            <input type="text" name="palabras_clave" class="w-full border p-2 rounded" placeholder="Ej: software, limpieza, mantenimiento">
        </div>
        <div class="md:col-span-2">
            <label class="block text-gray-700">Descripción de actividad / servicios:</label>
            <textarea name="descripcion_actividad" class="w-full border p-2 rounded" rows="3" placeholder="Describe brevemente qué productos o servicios ofreces."></textarea>
        </div>
        <div>
            <label class="block text-gray-700">Categoría Concierge - 1er nivel:</label>
            <select name="categoria_nivel_1" data-cat-nivel="1" class="w-full border p-2 rounded">
                <option value="">-- Selecciona --</option>
            </select>
        </div>
        <div>
            <label class="block text-gray-700">Categoría Concierge - 2do nivel:</label>
            <select name="categoria_nivel_2" data-cat-nivel="2" class="w-full border p-2 rounded" disabled>
                <option value="">-- Selecciona --</option>
            </select>
        </div>
        <div>
            <label class="block text-gray-700">Categoría Concierge - 3er nivel:</label>
            <select name="categoria_nivel_3" data-cat-nivel="3" class="w-full border p-2 rounded" disabled>
                <option value="">-- Selecciona --</option>
            </select>
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
        ${camposConciergeProveedorHTML()}
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
