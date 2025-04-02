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

    if (!isset($input['username']) || !isset($input['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Faltan datos requeridos'
        ]);
        exit;
    }

    $user_input = $input['username'];
    $pass_input = $input['password'];

    // Consulta para verificar las credenciales
    $sql = "SELECT * FROM usuarios WHERE username = :username AND password = :password";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $user_input);
    $stmt->bindParam(':password', $pass_input);
    $stmt->execute();

    // Verificar si se encontró un usuario
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            'success' => true,
            'message' => 'Inicio de sesión exitoso.',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario o contraseña incorrectos.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $e->getMessage()
    ]);
}
?>