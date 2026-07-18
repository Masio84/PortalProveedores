async function cargarNav() {
    try {
        const response = await fetch('partials/nav.html');
        const html = await response.text();
        document.getElementById('nav-placeholder').innerHTML = html;
        setTimeout(() => {
            // Inicializar drawer de Flowbite (para el sidebar móvil)
            if (typeof Flowbite !== 'undefined' && Flowbite.init) {
                Flowbite.init();
            }
            // Manejar clic en logo para cargar dashboard
            const logoLink = document.getElementById('logoLink');
            if (logoLink) {
                logoLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    cargarModulo('dashboard');
                });
            }
            // Ya no hay dropdown que inicializar
        }, 100);
    } catch (error) {
        console.error('Error cargando la navegación:', error);
    }
}

// Nueva función para actualizar el email en la barra superior
function actualizarEmailTop(email) {
    const topEmailSpan = document.getElementById('topUserEmail');
    if (topEmailSpan) topEmailSpan.textContent = email;
}

async function cargarDatosUsuario() {
    try {
        const response = await fetch('get_user_data.php');
        const data = await response.json();
        if (data.success) {
            userData = data;
            actualizarEmailTop(data.email);  // Mostrar email en la barra superior
            // Ya no hay dropdown, solo actualizar infoUsuario en sidebar
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

function configurarMenu(rol) {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    let menuItems = [];
    switch(rol) {
        case 'Ofertante':
            menuItems = [
                { nombre: 'Sourcing', icono: 'fa-search', id: 'perfil' },
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
                { nombre: 'Sourcing', icono: 'fa-search', id: 'perfil' },
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
    
    // Generar HTML de los módulos dinámicos
    let menuHtml = menuItems.map(item => `
        <li>
            <a href="#" class="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group" data-modulo="${item.id}">
                <i class="fas ${item.icono} w-5 h-5 transition duration-75 group-hover:text-fg-brand"></i>
                <span class="ms-3">${item.nombre}</span>
            </a>
        </li>
    `).join('');
    
    // Agregar ítem de Cerrar sesión al final
    menuHtml += `
        <li class="pt-4 mt-4 border-t border-default">
            <a href="logout.php" class="flex items-center px-2 py-1.5 text-red-600 rounded-base hover:bg-red-50 group">
                <i class="fas fa-sign-out-alt w-5 h-5"></i>
                <span class="ms-3">Cerrar sesión</span>
            </a>
        </li>
    `;
    
    sidebarMenu.innerHTML = menuHtml;
    
    // Asignar eventos a los enlaces de módulos (excepto logout que ya es un enlace normal)
    document.querySelectorAll('[data-modulo]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            cargarModulo(link.getAttribute('data-modulo'));
        });
    });
}

// La función actualizarInfoUsuario() se mantiene igual (muestra rol y email en sidebar)
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
