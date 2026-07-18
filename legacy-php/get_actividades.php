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

$user_id = $_SESSION['user_id'];

$conn = getConnection();
$sql = "SELECT ae.id, ae.actividad, ae.porcentaje, ae.fecha_inicio 
        FROM actividades_economicas ae 
        INNER JOIN proveedores p ON ae.proveedor_id = p.id 
        WHERE ae.proveedor_id = ? AND p.user_id = ? 
        ORDER BY ae.id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $proveedor_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

$actividades = [];
while ($row = $result->fetch_assoc()) {
    $actividades[] = $row;
}
echo json_encode(['success' => true, 'data' => $actividades]);
$stmt->close();
$conn->close();