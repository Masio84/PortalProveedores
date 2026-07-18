// Utilidades generales reutilizables
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function mostrarMensaje(containerId, mensaje, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = mensaje;
    container.className = `mt-2 text-sm ${tipo === 'error' ? 'text-red-600' : 'text-green-600'}`;
    setTimeout(() => { container.textContent = ''; }, 5000);
}
