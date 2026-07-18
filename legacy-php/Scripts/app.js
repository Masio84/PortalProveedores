document.addEventListener('DOMContentLoaded', async () => {
    await cargarNav();
    await cargarDatosUsuario();
    cargarModuloPorDefecto();
});
