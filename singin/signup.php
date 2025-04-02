<?php
// Mostrar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Habilitar CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Información del servidor
$host = "db-fletetel-pro.c3mwwk2mi6ry.us-east-2.rds.amazonaws.com";
$dbname = "fletetel";
$username = "admin";
$password = "201135Sata";
$port = 3306;

try {
    // Conexión a la base de datos
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Leer datos enviados desde el cliente
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['nombre']) || !isset($input['email']) || !isset($input['username']) || !isset($input['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Faltan datos requeridos'
        ]);
        exit;
    }

    $nombre = $input['nombre'];
    $email = $input['email'];
    $username = $input['username'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT); // Encriptamos la contraseña
    $tipo_usuario = 'cliente'; // Por defecto será cliente
    $fecha_actual = date('Y-m-d H:i:s');

    // Verificar si el usuario ya existe
    $checkUser = $pdo->prepare("SELECT COUNT(*) FROM usuarios WHERE username = ? OR email = ?");
    $checkUser->execute([$username, $email]);
    
    if ($checkUser->fetchColumn() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El usuario o correo electrónico ya está registrado'
        ]);
        exit;
    }

    // Insertar nuevo usuario
    $sql = "INSERT INTO usuarios (username, password, nombre, email, tipo_usuario, fecha_registro, activo) 
            VALUES (:username, :password, :nombre, :email, :tipo_usuario, :fecha_registro, 1)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':username' => $username,
        ':password' => $password,
        ':nombre' => $nombre,
        ':email' => $email,
        ':tipo_usuario' => $tipo_usuario,
        ':fecha_registro' => $fecha_actual
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado exitosamente'
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $e->getMessage()
    ]);
}
?>