<?php
require_once 'config/db.php';
if (session_status() === PHP_SESSION_NONE) session_start();

// Forzar salida JSON sin advertencias
header('Content-Type: application/json');
error_reporting(0);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$proveedor_id = $_POST['proveedor_id'] ?? 0;
if (!$proveedor_id) {
    echo json_encode(['success' => false, 'message' => 'ID de proveedor requerido']);
    exit;
}

// Decodificar el JSON con control de errores
$actividades_raw = $_POST['actividades'] ?? '[]';
$actividades = json_decode($actividades_raw, true);
if (!is_array($actividades)) {
    $actividades = []; // Si falla la decodificación, usar array vacío
}

$conn = getConnection();
$conn->begin_transaction();
try {
    // Eliminar actividades existentes del proveedor
    $stmtDel = $conn->prepare("DELETE FROM actividades_economicas WHERE proveedor_id = ?");
    $stmtDel->bind_param("i", $proveedor_id);
    $stmtDel->execute();
    $stmtDel->close();

    // Insertar nuevas actividades
    $stmtIns = $conn->prepare("INSERT INTO actividades_economicas (proveedor_id, actividad, porcentaje, fecha_inicio) VALUES (?, ?, ?, ?)");
    foreach ($actividades as $act) {
        if (!is_array($act)) continue; // Evitar elementos que no sean array
        $actividad = trim($act['actividad'] ?? '');
        $porcentaje = is_numeric($act['porcentaje']) ? $act['porcentaje'] : null;
        $fecha = $act['fecha_inicio'] ?? '';
        if (empty($actividad) || empty($fecha)) continue;
        $stmtIns->bind_param("isss", $proveedor_id, $actividad, $porcentaje, $fecha);
        $stmtIns->execute();
    }
    $stmtIns->close();
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Actividades guardadas correctamente']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
$conn->close();