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
$porcentaje = floatval($_POST['porcentaje'] ?? 0);

if (!$proveedor_id || empty($nombre) || empty($curp) || empty($ine)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar porcentaje
if ($porcentaje < 0 || $porcentaje > 100) {
    echo json_encode(['success' => false, 'message' => 'El porcentaje debe estar entre 0 y 100']);
    exit;
}

$conn = getConnection();

$user_id = $_SESSION['user_id'];
$sqlCheckOwner = "SELECT id FROM proveedores WHERE id = ? AND user_id = ?";
$stmtOwner = $conn->prepare($sqlCheckOwner);
$stmtOwner->bind_param("ii", $proveedor_id, $user_id);
$stmtOwner->execute();
if ($stmtOwner->get_result()->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Proveedor no autorizado o inexistente']);
    $stmtOwner->close();
    $conn->close();
    exit;
}
$stmtOwner->close();

// Verificar unicidad de CURP e INE solo en registros ACTIVOS (sin fecha_baja)
$sqlCheck = "SELECT id FROM accionistas WHERE (curp = ? OR ine = ?) AND fecha_baja IS NULL";
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
    echo json_encode(['success' => false, 'message' => 'La CURP o el número de INE ya están registrados en un accionista activo.']);
    $stmtCheck->close();
    $conn->close();
    exit;
}
$stmtCheck->close();

if ($accionista_id > 0) {
    // Actualizar (sin modificar fecha_baja)
    $sql = "UPDATE accionistas SET nombre_completo=?, curp=?, ine=?, fecha_alta=?, porcentaje_participacion=? WHERE id=? AND proveedor_id=?";
    $stmt = $conn->prepare($sql);
    // tipos: s s s s d i i (string, string, string, string, double, int, int)
    $stmt->bind_param("ssssdii", $nombre, $curp, $ine, $fecha_alta, $porcentaje, $accionista_id, $proveedor_id);
} else {
    // Insertar nuevo
    $sql = "INSERT INTO accionistas (proveedor_id, nombre_completo, curp, ine, fecha_alta, porcentaje_participacion) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    // tipos: i s s s s d
    $stmt->bind_param("issssd", $proveedor_id, $nombre, $curp, $ine, $fecha_alta, $porcentaje);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => $accionista_id > 0 ? 'Accionista actualizado' : 'Accionista agregado']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
}
$stmt->close();
$conn->close();
?>