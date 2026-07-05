<?php
require_once 'config/db.php';
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}

$nivel = $_GET['nivel'] ?? '';
$parent_id = trim($_GET['parent_id'] ?? ''); // aquí se recibe el código: 20000, 21000, etc.

$conn = getConnection();

try {
    if ($nivel === '1') {
        $sql = "SELECT codigo AS id, codigo, nombre FROM categorias_nivel_1 WHERE activo = 1 ORDER BY codigo";
        $stmt = $conn->prepare($sql);
    } elseif ($nivel === '2') {
        if ($parent_id === '') throw new Exception('Código de primer nivel requerido');
        $sql = "SELECT codigo AS id, codigo, nombre FROM categorias_nivel_2 WHERE nivel_1_codigo = ? AND activo = 1 ORDER BY codigo";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $parent_id);
    } elseif ($nivel === '3') {
        if ($parent_id === '') throw new Exception('Código de segundo nivel requerido');
        $sql = "SELECT codigo AS id, codigo, nombre FROM categorias_nivel_3 WHERE nivel_2_codigo = ? AND activo = 1 ORDER BY codigo";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('s', $parent_id);
    } else {
        throw new Exception('Nivel no válido');
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $data]);
    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
