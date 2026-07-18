<?php
require_once 'config/db.php';

// Verificar si la sesión ya está activa antes de iniciarla
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];
$tipo = $_GET['tipo'] ?? '';

if (!in_array($tipo, ['fisica_empresarial', 'moral', 'general'])) {
    echo json_encode(['success' => false, 'message' => 'Tipo de proveedor no válido']);
    exit;
}

$conn = getConnection();
$sql = "SELECT * FROM proveedores WHERE user_id = ? AND tipo_proveedor = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $tipo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $data]);
} else {
    echo json_encode(['success' => true, 'data' => null]);
}

$stmt->close();
$conn->close();
?>