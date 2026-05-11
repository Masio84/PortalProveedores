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

$proveedor_id = $_POST['proveedor_id'] ?? 0;
$apoderado_id = $_POST['id'] ?? 0;
$nombre = trim($_POST['nombre_completo'] ?? '');
$curp = strtoupper(trim($_POST['curp'] ?? ''));
$ine = strtoupper(trim($_POST['ine'] ?? ''));
$fecha_alta = $_POST['fecha_alta'] ?? date('Y-m-d');

if (!$proveedor_id || empty($nombre) || empty($curp) || empty($ine)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

$conn = getConnection();

// Verificar unicidad de CURP e INE solo en registros ACTIVOS (sin fecha_baja)
$sqlCheck = "SELECT id FROM apoderados_legales WHERE (curp = ? OR ine = ?) AND fecha_baja IS NULL";
$params = [$curp, $ine];
$types = "ss";
if ($apoderado_id > 0) {
    $sqlCheck .= " AND id != ?";
    $params[] = $apoderado_id;
    $types .= "i";
}
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param($types, ...$params);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
if ($resultCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'La CURP o el INE ya están registrados en un apoderado activo.']);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

if ($apoderado_id > 0) {
    // Actualizar
    $sql = "UPDATE apoderados_legales SET nombre_completo=?, curp=?, ine=?, fecha_alta=? WHERE id=? AND proveedor_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssii", $nombre, $curp, $ine, $fecha_alta, $apoderado_id, $proveedor_id);
} else {
    // Insertar nuevo
    $sql = "INSERT INTO apoderados_legales (proveedor_id, nombre_completo, curp, ine, fecha_alta) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issss", $proveedor_id, $nombre, $curp, $ine, $fecha_alta);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => $apoderado_id > 0 ? 'Apoderado actualizado' : 'Apoderado agregado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}
$stmt->close();
$conn->close();
?>