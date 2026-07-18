<?php
require_once 'config/db.php';

// Destruir sesión
session_destroy();

// Redirigir al login
header('Location: login.html');
exit;
?>