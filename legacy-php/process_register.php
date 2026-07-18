<?php
require_once 'config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$telefono = trim($_POST['telefono'] ?? '');
$tipo_usuario = $_POST['tipo_usuario'] ?? ''; // Ofertante, institucion_publica, privado

// Validaciones
if (empty($email) || empty($password) || empty($telefono) || empty($tipo_usuario)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
    exit;
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Formato de email no válido']);
    exit;
}

// Validar teléfono (solo números)
if (!preg_match('/^[0-9]{10}$/', $telefono)) {
    echo json_encode(['success' => false, 'message' => 'El teléfono debe tener 10 dígitos numéricos']);
    exit;
}

// Validar contraseña (mínimo 6 caracteres)
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}

// Validar tipo de usuario
$roles_validos = ['Ofertante', 'institucion_publica', 'privado'];
if (!in_array($tipo_usuario, $roles_validos)) {
    echo json_encode(['success' => false, 'message' => 'Tipo de usuario no válido']);
    exit;
}

$conn = getConnection();

// Verificar si el email ya existe
$sql_check = "SELECT id FROM usuarios WHERE email = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
    $stmt_check->close();
    $conn->close();
    exit;
}
$stmt_check->close();

// Obtener el ID del rol
$sql_rol = "SELECT id FROM roles WHERE nombre = ?";
$stmt_rol = $conn->prepare($sql_rol);
$stmt_rol->bind_param("s", $tipo_usuario);
$stmt_rol->execute();
$result_rol = $stmt_rol->get_result();

if ($result_rol->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Rol no encontrado']);
    $stmt_rol->close();
    $conn->close();
    exit;
}

$rol = $result_rol->fetch_assoc();
$rol_id = $rol['id'];
$stmt_rol->close();

// Hashear contraseña
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$sql_insert = "INSERT INTO usuarios (rol_id, email, contrasena, telefono) VALUES (?, ?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);
$stmt_insert->bind_param("isss", $rol_id, $email, $hashed_password, $telefono);

if ($stmt_insert->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Registro exitoso. Ya puedes iniciar sesión.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar usuario: ' . $conn->error
    ]);
}

$stmt_insert->close();
$conn->close();
?>