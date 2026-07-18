<?php
require_once __DIR__ . '/config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$tipo_contratacion = $_POST['tipo_contratacion'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

$conn = getConnection();

// Buscar usuario por email
$sql = "SELECT u.id, u.email, u.contrasena, u.rol_id, r.nombre as rol_nombre 
        FROM usuarios u 
        INNER JOIN roles r ON u.rol_id = r.id 
        WHERE u.email = ?";
        
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    exit;
}

$user = $result->fetch_assoc();

// Verificar contraseña
if (!password_verify($password, $user['contrasena'])) {
    echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    exit;
}

// Validar tipo de contratación según el rol
$rol = $user['rol_nombre'];
$tipo_valido = false;

if ($tipo_contratacion === 'publica') {
    // Contratación pública: solo Ofertantes e instituciones públicas
    $tipo_valido = in_array($rol, ['Ofertante', 'institucion_publica']);
} else if ($tipo_contratacion === 'privada') {
    // Contratación privada: solo usuarios privados
    $tipo_valido = ($rol === 'privado');
}

if (!$tipo_valido) {
    echo json_encode(['success' => false, 'message' => 'No tienes acceso a este tipo de contratación']);
    exit;
}

// Guardar datos en sesión
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_rol'] = $rol;
$_SESSION['tipo_contratacion'] = $tipo_contratacion;
$_SESSION['logged_in'] = true;

echo json_encode([
    'success' => true,
    'message' => 'Inicio de sesión exitoso',
    'rol' => $rol,
    'tipo_contratacion' => $tipo_contratacion
]);

$stmt->close();
$conn->close();
?>