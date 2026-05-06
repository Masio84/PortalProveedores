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

$id = intval($_POST['id'] ?? 0);
$proveedor_id = intval($_POST['proveedor_id'] ?? 0);
if (!$id || !$proveedor_id) {
    echo json_encode(['success' => false, 'message' => 'Parámetros insuficientes']);
    exit;
}

$conn = getConnection();

// Verificar que la actividad pertenezca al proveedor indicado
$sqlCheck = "SELECT id FROM actividades_economicas WHERE id = ? AND proveedor_id = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $id, $proveedor_id);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
if ($resultCheck->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Actividad no encontrada o no autorizada']);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

// Eliminar la actividad (borrado físico)
$sqlDelete = "DELETE FROM actividades_economicas WHERE id = ?";
$stmt = $conn->prepare($sqlDelete);
$stmt->bind_param("i", $id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Actividad eliminada correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conn->error]);
}
$stmt->close();
$conn->close();