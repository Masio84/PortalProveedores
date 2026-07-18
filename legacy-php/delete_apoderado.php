<?php
require_once 'config/db.php';
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$user_id = $_SESSION['user_id'];
$id = $_POST['id'] ?? 0;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID requerido']);
    exit;
}

$conn = getConnection();
$sql = "UPDATE apoderados_legales al 
        INNER JOIN proveedores p ON al.proveedor_id = p.id 
        SET al.fecha_baja = CURDATE() 
        WHERE al.id = ? AND p.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Apoderado dado de baja']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al dar de baja']);
}
$stmt->close();
$conn->close();
?>