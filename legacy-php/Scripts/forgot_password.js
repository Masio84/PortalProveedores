// Función para convertir número a texto en español
function numeroATexto(num) {
  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  
  if (num === 100) return 'cien';
  if (num >= 20 && num <= 99) {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;
    if (unidad === 0) return decenas[decena];
    if (decena === 2 && unidad > 0) return `veinti${unidades[unidad]}`;
    return `${decenas[decena]} y ${unidades[unidad]}`;
  }
  if (num >= 10 && num <= 19) return especiales[num - 10];
  if (num >= 1 && num <= 9) return unidades[num];
  return num.toString();
}

// Generar captcha con operaciones más complejas
function generateCaptcha() {
  // Números más grandes (entre 10 y 99)
  const num1 = Math.floor(Math.random() * 90) + 10;
  const num2 = Math.floor(Math.random() * 90) + 10;
  
  // Operaciones aleatorias
  const operations = [
    { 
      symbol: '+', 
      func: (a, b) => a + b,
      text: 'suma'
    },
    { 
      symbol: '-', 
      func: (a, b) => Math.abs(a - b), // valor absoluto para evitar negativos
      text: 'resta'
    },
    { 
      symbol: '×', 
      func: (a, b) => a * b,
      text: 'multiplicación'
    }
  ];
  
  const op = operations[Math.floor(Math.random() * operations.length)];
  const result = op.func(num1, num2);
  
  // Limitar resultado máximo a 9999 para evitar números enormes
  let finalResult = result;
  if (result > 9999) {
    // Si es muy grande, usar suma simple como fallback
    finalResult = num1 + num2;
  }
  
  // Guardar resultado esperado
  document.getElementById('captchaExpected').value = finalResult;
  
  // Mostrar la operación
  document.getElementById('captchaQuestion').innerHTML = `${num1} ${op.symbol} ${num2} = ?`;
  
  // Mostrar instrucción adicional
  const hint = document.getElementById('captchaHint');
  if (hint) {
    hint.innerHTML = `(Escribe el resultado en números, no en letras)`;
  }
  
  return finalResult;
}

// Validar captcha (se ejecuta en el servidor también, pero esta es validación adicional)
function validateCaptcha(clientAnswer, expectedResult) {
  const answer = parseInt(clientAnswer);
  if (isNaN(answer)) return false;
  return answer === parseInt(expectedResult);
}

// Mostrar mensaje en paso 1 o 2
function showMessage(step, msg, isError = true) {
  const msgDiv = step === 1 ? document.getElementById('step1Message') : document.getElementById('step2Message');
  msgDiv.innerHTML = `<span class="${isError ? 'text-red-600' : 'text-green-600'}">${msg}</span>`;
  setTimeout(() => {
    msgDiv.innerHTML = '';
  }, 5000);
}

// Función para mostrar captcha en texto (opcional, más difícil)
function generateTextCaptcha() {
  const num1 = Math.floor(Math.random() * 90) + 10;
  const num2 = Math.floor(Math.random() * 90) + 10;
  
  const operations = [
    { symbol: 'más', func: (a, b) => a + b },
    { symbol: 'menos', func: (a, b) => Math.abs(a - b) },
    { symbol: 'por', func: (a, b) => a * b }
  ];
  
  const op = operations[Math.floor(Math.random() * operations.length)];
  const result = op.func(num1, num2);
  
  // Si es multiplicación y el resultado es muy grande, usar suma
  let finalResult = result;
  if (result > 9999) {
    finalResult = num1 + num2;
    document.getElementById('captchaQuestion').innerHTML = `¿Cuánto es ${numeroATexto(num1)} ${operations[0].symbol} ${numeroATexto(num2)}?`;
  } else {
    document.getElementById('captchaQuestion').innerHTML = `¿Cuánto es ${numeroATexto(num1)} ${op.symbol} ${numeroATexto(num2)}?`;
  }
  
  document.getElementById('captchaExpected').value = finalResult;
  return finalResult;
}

document.addEventListener('DOMContentLoaded', () => {
  // Variable para almacenar el resultado esperado del captcha
  let expectedCaptcha = 0;
  
  // Generar captcha inicial
  expectedCaptcha = generateCaptcha();
  
  // Botón para regenerar captcha (opcional)
  const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', () => {
      expectedCaptcha = generateCaptcha();
      document.getElementById('captchaAnswer').value = '';
    });
  }
  
  // Paso 1: verificar email y captcha
  document.getElementById('formStep1').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const captchaAnswer = document.getElementById('captchaAnswer').value.trim();
    const captchaExpected = document.getElementById('captchaExpected').value;

    if (!email) {
      showMessage(1, 'Por favor ingresa un correo electrónico', true);
      return;
    }
    if (!captchaAnswer) {
      showMessage(1, 'Resuelve el captcha correctamente', true);
      return;
    }
    
    // Validación más estricta del captcha
    const answer = parseInt(captchaAnswer);
    if (isNaN(answer)) {
      showMessage(1, 'El captcha debe ser un número válido', true);
      document.getElementById('captchaAnswer').value = '';
      expectedCaptcha = generateCaptcha();
      return;
    }
    
    if (answer !== parseInt(captchaExpected)) {
      showMessage(1, 'Captcha incorrecto. Intenta de nuevo.', true);
      expectedCaptcha = generateCaptcha();
      document.getElementById('captchaAnswer').value = '';
      return;
    }

    const btn = document.getElementById('btnCheckEmail');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    try {
      const formData = new FormData();
      formData.append('action', 'check_email');
      formData.append('email', email);
      // Enviar captcha al servidor también para validación adicional
      formData.append('captcha_answer', captchaAnswer);
      formData.append('captcha_expected', captchaExpected);

      const response = await fetch('process_forgot_password.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('reset_email', email);
        document.getElementById('step2EmailDisplay').innerHTML = `Restableciendo para: <strong>${email}</strong>`;
        document.getElementById('step1').classList.add('hidden-step');
        document.getElementById('step2').classList.remove('hidden-step');
        showMessage(2, data.message, false);
      } else {
        showMessage(1, data.message, true);
        expectedCaptcha = generateCaptcha();
        document.getElementById('captchaAnswer').value = '';
      }
    } catch (error) {
      console.error(error);
      showMessage(1, 'Error de conexión. Intenta más tarde.', true);
      expectedCaptcha = generateCaptcha();
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Verificar correo';
    }
  });

  // Paso 2: actualizar contraseña
  document.getElementById('formStep2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const email = sessionStorage.getItem('reset_email');

    if (!email) {
      showMessage(2, 'Sesión expirada. Vuelve a empezar.', true);
      document.getElementById('backToStep1').click();
      return;
    }
    
    // Validación de contraseña más fuerte
    if (newPass.length < 8) {
      showMessage(2, 'La contraseña debe tener al menos 8 caracteres', true);
      return;
    }
    
    if (!/[A-Z]/.test(newPass)) {
      showMessage(2, 'La contraseña debe contener al menos una letra mayúscula', true);
      return;
    }
    
    if (!/[0-9]/.test(newPass)) {
      showMessage(2, 'La contraseña debe contener al menos un número', true);
      return;
    }
    
    if (newPass !== confirmPass) {
      showMessage(2, 'Las contraseñas no coinciden', true);
      return;
    }

    const btn = document.getElementById('btnUpdatePassword');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';

    try {
      const formData = new FormData();
      formData.append('action', 'update_password');
      formData.append('email', email);
      formData.append('new_password', newPass);

      const response = await fetch('process_forgot_password.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        showMessage(2, data.message, false);
        sessionStorage.removeItem('reset_email');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        showMessage(2, data.message, true);
      }
    } catch (error) {
      console.error(error);
      showMessage(2, 'Error de conexión. Intenta más tarde.', true);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-save"></i> Actualizar contraseña';
    }
  });

  // Botón para volver al paso 1
  document.getElementById('backToStep1').addEventListener('click', () => {
    sessionStorage.removeItem('reset_email');
    document.getElementById('step2').classList.add('hidden-step');
    document.getElementById('step1').classList.remove('hidden-step');
    document.getElementById('formStep1').reset();
    expectedCaptcha = generateCaptcha();
    document.getElementById('step1Message').innerHTML = '';
    document.getElementById('step2Message').innerHTML = '';
  });
});