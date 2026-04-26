<?php
require_once 'config/db.php';
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$proveedor_id = $_GET['proveedor_id'] ?? 0;
if (!$proveedor_id) {
    echo json_encode(['success' => false, 'message' => 'ID de proveedor requerido']);
    exit;
}

$conn = getConnection();
$sql = "SELECT id, actividad, porcentaje, fecha_inicio FROM actividades_economicas WHERE proveedor_id = ? ORDER BY id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $proveedor_id);
$stmt->execute();
$result = $stmt->get_result();

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}
echo json_encode(['success' => true, 'data' => $actividades]);
$stmt->close();
$conn->close();