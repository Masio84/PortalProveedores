<?php
require_once 'config/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

echo json_encode([
    'success' => true,
    'email' => $_SESSION['user_email'],
    'rol' => $_SESSION['user_rol'],
    'tipo_contratacion' => $_SESSION['tipo_contratacion'],
    'user_id' => $_SESSION['user_id']
]);
?>