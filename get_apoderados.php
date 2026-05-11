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
$sql = "SELECT id, nombre_completo, curp, ine, fecha_alta, fecha_baja FROM apoderados_legales WHERE proveedor_id = ? ORDER BY id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $proveedor_id);
$stmt->execute();
$result = $stmt->get_result();

$apoderados = [];
while ($row = $result->fetch_assoc()) {
    $apoderados[] = $row;
}
echo json_encode(['success' => true, 'data' => $apoderados]);
$stmt->close();
$conn->close();
?>