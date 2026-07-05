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

    if (modulo === 'concierge') {
        inicializarConcierge();
    }
}
