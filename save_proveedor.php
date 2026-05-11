<?php
require_once 'config/db.php';

// Verificar si la sesión ya está activa antes de iniciarla
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
$tipo_proveedor = $_POST['tipo_proveedor'] ?? '';

if (!in_array($tipo_proveedor, ['fisica_empresarial', 'moral', 'general'])) {
    echo json_encode(['success' => false, 'message' => 'Tipo de proveedor inválido']);
    exit;
}

// Mapeo de campos obligatorios según tipo
$campos_base = [
    'rfc', 'razon_social', 'regimen_fiscal', 'nombre_vialidad', 'num_exterior',
    'num_interior', 'colonia', 'localidad', 'codigo_postal', 'ciudad', 'estado',
    'telefono', 'extension', 'fax', 'fax_extension', 'representante_legal',
    'email', 'banco', 'sucursal_bancaria', 'cuenta_bancaria', 'clabe_interbancaria'
];

$data = [];
foreach ($campos_base as $campo) {
    $data[$campo] = $_POST[$campo] ?? null;
}

// Campos específicos
if ($tipo_proveedor === 'moral') {
    $data['objeto_social'] = $_POST['objeto_social'] ?? null;
    $data['num_acta_constitutiva'] = $_POST['num_acta_constitutiva'] ?? null;
    $data['fecha_acta_constitutiva'] = !empty($_POST['fecha_acta_constitutiva']) ? $_POST['fecha_acta_constitutiva'] : null;
    $data['num_notario_acta'] = $_POST['num_notario_acta'] ?? null;
    $data['nombre_notario_acta'] = $_POST['nombre_notario_acta'] ?? null;
    $data['ciudad_acta'] = $_POST['ciudad_acta'] ?? null;
    $data['folio_mercantil'] = $_POST['folio_mercantil'] ?? null;
    $data['fecha_registro_acta'] = !empty($_POST['fecha_registro_acta']) ? $_POST['fecha_registro_acta'] : null;
    $data['poder_notarial_num'] = $_POST['poder_notarial_num'] ?? null;
    $data['poder_notarial_fecha'] = !empty($_POST['poder_notarial_fecha']) ? $_POST['poder_notarial_fecha'] : null;
    $data['poder_notarial_notario_num'] = $_POST['poder_notarial_notario_num'] ?? null;
    $data['poder_notarial_notario_nombre'] = $_POST['poder_notarial_notario_nombre'] ?? null;
    $data['poder_notarial_ciudad'] = $_POST['poder_notarial_ciudad'] ?? null;
    $data['poder_notarial_folio'] = $_POST['poder_notarial_folio'] ?? null;
    $data['poder_notarial_fecha_registro'] = !empty($_POST['poder_notarial_fecha_registro']) ? $_POST['poder_notarial_fecha_registro'] : null;
    $data['apoderados'] = $_POST['apoderados'] ?? null;
}

$conn = getConnection();

// Verificar si ya existe registro para este usuario y tipo
$sql_check = "SELECT id FROM proveedores WHERE user_id = ? AND tipo_proveedor = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("is", $user_id, $tipo_proveedor);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
$exists = $result_check->num_rows > 0;
$stmt_check->close();

if ($exists) {
    // Actualizar
    $set_parts = [];
    $params = [];
    $types = '';
    foreach ($data as $key => $value) {
        $set_parts[] = "`$key` = ?";
        $params[] = $value;
        $types .= 's';
    }
    $params[] = $user_id;
    $params[] = $tipo_proveedor;
    $types .= 'is';
    $sql = "UPDATE proveedores SET " . implode(', ', $set_parts) . " WHERE user_id = ? AND tipo_proveedor = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
} else {
    // Insertar
    $columns = array_keys($data);
    $placeholders = array_fill(0, count($columns), '?');
    $sql = "INSERT INTO proveedores (user_id, tipo_proveedor, " . implode(', ', $columns) . ") VALUES (?, ?, " . implode(', ', $placeholders) . ")";
    $params = array_merge([$user_id, $tipo_proveedor], array_values($data));
    $types = 'is' . str_repeat('s', count($data));
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => $exists ? 'Datos actualizados correctamente' : 'Datos guardados correctamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>