<?php
require_once 'config/db.php';
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$nivel1 = trim($_GET['nivel1'] ?? '');
$nivel2 = trim($_GET['nivel2'] ?? '');
$nivel3 = trim($_GET['nivel3'] ?? '');
$q = trim($_GET['q'] ?? '');

$conn = getConnection();

$sql = "SELECT
            p.id,
            p.tipo_proveedor,
            p.rfc,
            p.razon_social,
            p.nombre_comercial,
            p.descripcion_actividad,
            p.palabras_clave,
            p.email AS email_contacto,
            p.telefono,
            u.email AS email_usuario,
            r.nombre AS rol_usuario,
            c1.codigo AS nivel_1_codigo,
            c1.nombre AS nivel_1_nombre,
            c2.codigo AS nivel_2_codigo,
            c2.nombre AS nivel_2_nombre,
            c3.codigo AS nivel_3_codigo,
            c3.nombre AS nivel_3_nombre
        FROM proveedores p
        INNER JOIN usuarios u ON u.id = p.user_id
        INNER JOIN roles r ON r.id = u.rol_id
        LEFT JOIN categorias_nivel_1 c1 ON c1.codigo = p.categoria_nivel_1
        LEFT JOIN categorias_nivel_2 c2 ON c2.codigo = p.categoria_nivel_2
        LEFT JOIN categorias_nivel_3 c3 ON c3.codigo = p.categoria_nivel_3
        WHERE 1 = 1";

$params = [];
$types = '';

if ($nivel1 !== '' && $nivel1 !== '0') {
    $sql .= " AND p.categoria_nivel_1 = ?";
    $params[] = $nivel1;
    $types .= 's';
}

if ($nivel2 !== '' && $nivel2 !== '0') {
    $sql .= " AND p.categoria_nivel_2 = ?";
    $params[] = $nivel2;
    $types .= 's';
}

if ($nivel3 !== '' && $nivel3 !== '0') {
    $sql .= " AND p.categoria_nivel_3 = ?";
    $params[] = $nivel3;
    $types .= 's';
}

if ($q !== '') {
    $like = '%' . $q . '%';
    $sql .= " AND (
        p.rfc LIKE ? OR
        p.razon_social LIKE ? OR
        p.nombre_comercial LIKE ? OR
        p.descripcion_actividad LIKE ? OR
        p.palabras_clave LIKE ? OR
        p.email LIKE ? OR
        u.email LIKE ? OR
        c1.nombre LIKE ? OR
        c2.nombre LIKE ? OR
        c3.nombre LIKE ?
    )";
    array_push($params, $like, $like, $like, $like, $like, $like, $like, $like, $like, $like);
    $types .= 'ssssssssss';
}

$sql .= " ORDER BY COALESCE(p.nombre_comercial, p.razon_social), p.razon_social LIMIT 100";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error SQL: ' . $conn->error]);
    $conn->close();
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['success' => true, 'data' => $data]);

$stmt->close();
$conn->close();
?>
