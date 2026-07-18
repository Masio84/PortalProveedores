<?php
require_once 'config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$action = $_POST['action'] ?? '';

if ($action === 'check_email') {
    // Verificar si el correo existe
    $email = trim($_POST['email'] ?? '');
    $captcha_answer = $_POST['captcha_answer'] ?? '';
    $captcha_expected = $_POST['captcha_expected'] ?? '';
    
    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Correo requerido']);
        exit;
    }
    
    // Validar captcha en el servidor (doble validación)
    if (empty($captcha_answer) || empty($captcha_expected)) {
        echo json_encode(['success' => false, 'message' => 'Captcha requerido']);
        exit;
    }
    
    if (intval($captcha_answer) !== intval($captcha_expected)) {
        echo json_encode(['success' => false, 'message' => 'Captcha incorrecto']);
        exit;
    }

    $conn = getConnection();
    $sql = "SELECT id FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Correo verificado. Ahora puedes establecer una nueva contraseña.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'El correo no está registrado en el sistema.']);
    }

    $stmt->close();
    $conn->close();
} 
else if ($action === 'update_password') {
    // Actualizar la contraseña
    $email = trim($_POST['email'] ?? '');
    $new_password = $_POST['new_password'] ?? '';

    if (empty($email) || empty($new_password)) {
        echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
        exit;
    }

    // Validación de contraseña más fuerte
    if (strlen($new_password) < 8) {
        echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 8 caracteres']);
        exit;
    }
    
    if (!preg_match('/[A-Z]/', $new_password)) {
        echo json_encode(['success' => false, 'message' => 'La contraseña debe contener al menos una letra mayúscula']);
        exit;
    }
    
    if (!preg_match('/[0-9]/', $new_password)) {
        echo json_encode(['success' => false, 'message' => 'La contraseña debe contener al menos un número']);
        exit;
    }

    $conn = getConnection();

    // Verificar nuevamente que el email existe (por seguridad)
    $sql_check = "SELECT id FROM usuarios WHERE email = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("s", $email);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'El correo no existe.']);
        $stmt_check->close();
        $conn->close();
        exit;
    }
    $stmt_check->close();

    // Hashear la nueva contraseña
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    // Actualizar en la base de datos
    $sql_update = "UPDATE usuarios SET contrasena = ? WHERE email = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("ss", $hashed_password, $email);

    if ($stmt_update->execute()) {
        echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente. Redirigiendo al login...']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $conn->error]);
    }

    $stmt_update->close();
    $conn->close();
}
else {
    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
}
?>