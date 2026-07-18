// Variables de estado
let tipoContratacion = '';

// Elementos del DOM
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const btnPublica = document.getElementById('btnPublica');
const btnPrivada = document.getElementById('btnPrivada');
const btnRegistro = document.getElementById('btnRegistro');
const btnVolver = document.getElementById('btnVolver');
const btnVolverLogin = document.getElementById('btnVolverLogin');
const btnIrRegistro = document.getElementById('btnIrRegistro');
const tipoSeleccionado = document.getElementById('tipoSeleccionado');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const registerMessage = document.getElementById('registerMessage');

// Función para mostrar mensajes de error
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#dc2626';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Función para mostrar mensaje de éxito
function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#10b981';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

// Selección de contratación pública
btnPublica.addEventListener('click', () => {
    tipoContratacion = 'publica';
    tipoSeleccionado.textContent = 'Contratación Pública';
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

// Selección de contratación privada
btnPrivada.addEventListener('click', () => {
    tipoContratacion = 'privada';
    tipoSeleccionado.textContent = 'Contratación Privada';
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

// Botón registro desde paso 1
btnRegistro.addEventListener('click', () => {
    step1.classList.add('hidden');
    step3.classList.remove('hidden');
});

// Botón ir a registro desde paso 2
btnIrRegistro.addEventListener('click', () => {
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
});

// Botón volver al paso 1 desde login
btnVolver.addEventListener('click', () => {
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    tipoContratacion = '';
    loginForm.reset();
    errorMessage.style.display = 'none';
});

// Botón volver al login desde registro
btnVolverLogin.addEventListener('click', () => {
    step3.classList.add('hidden');
    step2.classList.remove('hidden');
    registerForm.reset();
    registerMessage.style.display = 'none';
});

// Procesar login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showError(errorMessage, 'Por favor completa todos los campos');
        return;
    }
    
    // Deshabilitar botón
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('tipo_contratacion', tipoContratacion);
        
        // Usar ruta relativa desde la raíz del proyecto
        const response = await fetch('/PortalProveedores_RP/process_login.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Guardar datos en sessionStorage para usar en index
            sessionStorage.setItem('user_email', email);
            sessionStorage.setItem('user_rol', data.rol);
            sessionStorage.setItem('tipo_contratacion', tipoContratacion);
            // Redirigir al index
            window.location.href = '/PortalProveedores_RP/Index.html';
        } else {
            showError(errorMessage, data.message);
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
        }
    } catch (error) {
        console.error('Error:', error);
        showError(errorMessage, 'Error de conexión. Verifica que el servidor esté funcionando.');
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
    }
});

// Procesar registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const telefono = document.getElementById('regTelefono').value;
    const tipoUsuario = document.getElementById('regTipoUsuario').value;
    
    if (!email || !password || !telefono || !tipoUsuario) {
        showError(registerMessage, 'Por favor completa todos los campos');
        return;
    }
    
    // Validar teléfono (10 dígitos)
    if (!/^\d{10}$/.test(telefono)) {
        showError(registerMessage, 'El teléfono debe tener 10 dígitos numéricos');
        return;
    }
    
    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
        showError(registerMessage, 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Validar email
    if (!email.includes('@')) {
        showError(registerMessage, 'Ingresa un email válido');
        return;
    }
    
    // Deshabilitar botón
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('telefono', telefono);
        formData.append('tipo_usuario', tipoUsuario);
        
        const response = await fetch('/PortalProveedores_RP/process_register.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Mostrar éxito
            showSuccess(registerMessage, data.message);
            
            // Limpiar formulario
            registerForm.reset();
            
            // Volver al login después de 2 segundos
            setTimeout(() => {
                step3.classList.add('hidden');
                step2.classList.remove('hidden');
                registerMessage.style.display = 'none';
            }, 2000);
        } else {
            showError(registerMessage, data.message);
        }
        
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<i class="fas fa-user-check"></i> Registrarse';
    } catch (error) {
        console.error('Error:', error);
        showError(registerMessage, 'Error de conexión. Verifica que el servidor esté funcionando.');
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<i class="fas fa-user-check"></i> Registrarse';
    }
});