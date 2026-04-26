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
$accionista_id = $_POST['id'] ?? 0; // 0 para nuevo
$nombre = trim($_POST['nombre_completo'] ?? '');
$curp = strtoupper(trim($_POST['curp'] ?? ''));
$ine = strtoupper(trim($_POST['ine'] ?? ''));
$fecha_alta = $_POST['fecha_alta'] ?? date('Y-m-d');

if (!$proveedor_id || empty($nombre) || empty($curp) || empty($ine)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

$conn = getConnection();

// Verificar unicidad de CURP e INE (excluyendo el registro actual si es edición)
$sqlCheck = "SELECT id FROM accionistas WHERE (curp = ? OR ine = ?)";
$params = [$curp, $ine];
$types = "ss";
if ($accionista_id > 0) {
    $sqlCheck .= " AND id != ?";
    $params[] = $accionista_id;
    $types .= "i";
}
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param($types, ...$params);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();
if ($resultCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'La CURP o el número de INE ya están registrados en el sistema.']);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

if ($accionista_id > 0) {
    // Actualizar (sin modificar fecha_baja)
    $sql = "UPDATE accionistas SET nombre_completo=?, curp=?, ine=?, fecha_alta=? WHERE id=? AND proveedor_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssii", $nombre, $curp, $ine, $fecha_alta, $accionista_id, $proveedor_id);
} else {
    // Insertar nuevo
    $sql = "INSERT INTO accionistas (proveedor_id, nombre_completo, curp, ine, fecha_alta) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issss", $proveedor_id, $nombre, $curp, $ine, $fecha_alta);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => $accionista_id > 0 ? 'Accionista actualizado' : 'Accionista agregado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}
$stmt->close();
$conn->close();