<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Habilitar CORS (ajusta '*' en producción a tu dominio del frontend)
header('Access-Control-Allow-Origin: *'); // Ejemplo: 'http://localhost:5500' o tu dominio de fletes.html
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // OPTIONS es importante para 'preflight requests' con algunos headers
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Content-Type es común
header('Content-Type: application/json');

// Si es una solicitud OPTIONS (preflight), terminar aquí.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Iniciar sesión PHP ANTES de cualquier salida.
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// --- CONFIGURACIÓN DE BASE DE DATOS ---
$host_db = "flete.c3mwwk2mi6ry.us-east-2.rds.amazonaws.com";
$dbname_db = "fletetel";
$username_db = "admin";
$password_db_cred = "fletetel"; // Renombré para claridad, "password" es un nombre muy común
$port_db = 3306;
$charset_db = 'utf8mb4';

$pdo = null;
try {
    $dsn = "mysql:host={$host_db};port={$port_db};dbname={$dbname_db};charset={$charset_db}";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $username_db, $password_db_cred, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos.']);
    exit;
}

// --- RUTEO DE ACCIONES ---
$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents('php://input'), true); // Datos del cuerpo de la solicitud

if (!$input) { // Si json_decode falla o el cuerpo está vacío pero se espera (para POST)
    $input = []; // Asegurar que $input sea un array
}


switch ($action) {
    case 'register':
        handle_register($pdo, $input);
        break;
    case 'login':
        handle_login($pdo, $input);
        break;
    case 'logout':
        handle_logout();
        break;
    case 'crear_flete':
        handle_crear_flete($pdo, $input);
        break;
    case 'check_session': // Acción adicional para verificar si hay sesión activa
        handle_check_session();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
        break;
}

// --- FUNCIONES MANEJADORAS ---

function handle_register($pdo, $data) {
    $response = ['success' => false, 'message' => 'Datos inválidos.'];

    if (isset($data['nombre'], $data['email'], $data['username'], $data['password'])) {
        $nombre = trim($data['nombre']);
        $email = trim($data['email']);
        $username_form = trim($data['username']);
        $password_form = $data['password'];

        if (empty($nombre) || empty($email) || empty($username_form) || empty($password_form)) {
            $response['message'] = 'Todos los campos son obligatorios.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['message'] = 'El formato del correo electrónico no es válido.';
        } elseif (strlen($password_form) < 6) {
            $response['message'] = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
            try {
                $stmt_check = $pdo->prepare("SELECT id FROM usuarios WHERE username = :username OR email = :email");
                $stmt_check->execute(['username' => $username_form, 'email' => $email]);
                if ($stmt_check->fetch()) {
                    $response['message'] = 'El nombre de usuario o correo electrónico ya está registrado.';
                } else {
                    $hashed_password = password_hash($password_form, PASSWORD_DEFAULT);
                    $sql = "INSERT INTO usuarios (username, password, nombre, email, tipo_usuario, activo) 
                            VALUES (:username, :password, :nombre, :email, 'cliente', true)";
                    $stmt_insert = $pdo->prepare($sql);
                    $stmt_insert->execute([
                        'username' => $username_form,
                        'password' => $hashed_password,
                        'nombre'   => $nombre,
                        'email'    => $email,
                    ]);
                    if ($stmt_insert->rowCount() > 0) {
                        $response['success'] = true;
                        $response['message'] = '¡Usuario registrado exitosamente!';
                    } else {
                        $response['message'] = 'Error al registrar el usuario.';
                    }
                }
            } catch (\PDOException $e) {
                $response['message'] = 'Error del servidor durante el registro.';
                 // Log $e->getMessage() en producción
            }
        }
    } else {
        $response['message'] = 'Faltan datos requeridos para el registro.';
    }
    echo json_encode($response);
}

function handle_login($pdo, $data) {
    $response = ['success' => false, 'message' => 'Datos inválidos.'];

    if (isset($data['username'], $data['password'])) {
        $username_form = trim($data['username']);
        $password_form = $data['password'];

        if (empty($username_form) || empty($password_form)) {
            $response['message'] = 'Usuario y contraseña son obligatorios.';
        } else {
            try {
                $stmt = $pdo->prepare("SELECT id, username, password, nombre, email, tipo_usuario, activo FROM usuarios WHERE username = :username");
                $stmt->execute(['username' => $username_form]);
                $user = $stmt->fetch();

                if ($user) {
                    if (!$user['activo']) {
                        $response['message'] = 'Esta cuenta ha sido desactivada.';
                    } elseif (password_verify($password_form, $user['password'])) {
                        $_SESSION['user_id'] = $user['id'];
                        $_SESSION['username'] = $user['username'];
                        $_SESSION['nombre'] = $user['nombre'];
                        $_SESSION['tipo_usuario'] = $user['tipo_usuario'];

                        $response['success'] = true;
                        $response['message'] = 'Inicio de sesión exitoso.';
                        $response['user'] = [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'nombre' => $user['nombre'],
                            'email' => $user['email'],
                            'tipo_usuario' => $user['tipo_usuario']
                        ];
                    } else {
                        $response['message'] = 'Usuario o contraseña incorrectos.';
                    }
                } else {
                    $response['message'] = 'Usuario o contraseña incorrectos.';
                }
            } catch (\PDOException $e) {
                $response['message'] = 'Error del servidor durante el inicio de sesión.';
                // Log $e->getMessage() en producción
            }
        }
    } else {
        $response['message'] = 'Faltan datos requeridos para el login.';
    }
    echo json_encode($response);
}

function handle_logout() {
    $_SESSION = array();
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada.']);
}

function handle_crear_flete($pdo, $data) {
    $response = ['success' => false, 'message' => 'No autenticado o datos inválidos.'];

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        $response['message'] = 'Debes iniciar sesión para confirmar un flete.';
        echo json_encode($response);
        exit;
    }

    if (isset($data['origen'], $data['destino'], $data['fecha'], $data['hora'], $data['peso'], $data['precio_estimado'], $data['metodo_pago'], $data['confirmado'])) {
        $id_usuario = $_SESSION['user_id'];
        $origen = trim($data['origen']);
        $destino = trim($data['destino']);
        $fecha = $data['fecha'];
        $hora = $data['hora'];
        $peso = filter_var($data['peso'], FILTER_VALIDATE_FLOAT);
        $precio_estimado = filter_var($data['precio_estimado'], FILTER_VALIDATE_FLOAT);
        $metodo_pago = trim($data['metodo_pago']);
        $confirmado = filter_var($data['confirmado'], FILTER_VALIDATE_BOOLEAN);
        $estado_pago = isset($data['estado_pago']) ? trim($data['estado_pago']) : 'pendiente';
        $id_transaccion_paypal = isset($data['id_transaccion_paypal']) ? trim($data['id_transaccion_paypal']) : null;

        if (empty($origen) || empty($destino) || empty($fecha) || empty($hora) || $peso === false || $precio_estimado === false) {
            $response['message'] = 'Faltan datos obligatorios o tienen formato incorrecto para el flete.';
        } else {
            try {
                $sql = "INSERT INTO fletes (id_usuario, origen, destino, fecha, hora, peso, precio_estimado, metodo_pago, estado_pago, id_transaccion_paypal, confirmado)
                        VALUES (:id_usuario, :origen, :destino, :fecha, :hora, :peso, :precio_estimado, :metodo_pago, :estado_pago, :id_transaccion_paypal, :confirmado)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'id_usuario' => $id_usuario,
                    'origen' => $origen,
                    'destino' => $destino,
                    'fecha' => $fecha,
                    'hora' => $hora,
                    'peso' => $peso,
                    'precio_estimado' => $precio_estimado,
                    'metodo_pago' => $metodo_pago,
                    'estado_pago' => $estado_pago,
                    'id_transaccion_paypal' => ($metodo_pago === 'paypal' && !empty($id_transaccion_paypal)) ? $id_transaccion_paypal : null,
                    'confirmado' => $confirmado ? 1 : 0 // Asegurar que sea 1 o 0 para BOOLEAN/TINYINT en SQL
                ]);
                if ($stmt->rowCount() > 0) {
                    $flete_id = $pdo->lastInsertId();
                    $response['success'] = true;
                    $response['message'] = 'Flete registrado exitosamente.';
                    $response['flete_id'] = $flete_id;
                } else {
                    $response['message'] = 'Error al registrar el flete.';
                }
            } catch (\PDOException $e) {
                $response['message'] = 'Error del servidor al registrar el flete.';
                // Log $e->getMessage() en producción
            }
        }
    } else {
        $response['message'] = 'Faltan datos requeridos para el flete.';
    }
    echo json_encode($response);
}

function handle_check_session() {
    if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
        echo json_encode([
            'success' => true,
            'loggedIn' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'nombre' => $_SESSION['nombre'],
                'tipo_usuario' => $_SESSION['tipo_usuario']
            ]
        ]);
    } else {
        echo json_encode(['success' => true, 'loggedIn' => false]);
    }
}

?>