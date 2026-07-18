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
$sql = "SELECT a.id, a.nombre_completo, a.curp, a.ine, a.fecha_alta, a.fecha_baja, a.porcentaje_participacion 
        FROM accionistas a 
        INNER JOIN proveedores p ON a.proveedor_id = p.id 
        WHERE a.proveedor_id = ? AND p.user_id = ? 
        ORDER BY a.id";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $proveedor_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

$accionistas = [];
while ($row = $result->fetch_assoc()) {
    $accionistas[] = $row;
}
echo json_encode(['success' => true, 'data' => $accionistas]);
$stmt->close();
$conn->close();