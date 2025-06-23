<?php
// backend/utilizadores.php
header('Content-Type: application/json');
session_start();

// Check if user is authenticated (adjust as needed)
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// Path to JSON data file
$dataFile = __DIR__ . '/../data/utilizadores.json';

// Helper function to read JSON data
function readData($file) {
    if (!file_exists($file)) {
        return [];
    }
    $json = file_get_contents($file);
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

// Helper function to write JSON data
function writeData($file, $data) {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($file, $json) !== false;
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Allow CORS and credentials for local dev (optional, adjust as needed)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($method === 'OPTIONS') {
    // Preflight request for CORS
    http_response_code(204);
    exit;
}

$utilizadores = readData($dataFile);

switch ($method) {
    case 'GET':
        // Return all utilizadores
        respond(['data' => $utilizadores]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['nome'],  $input['email'], $input['password'])) {
            respond(['error' => 'Dados incompletos'], 400);
        }

        // Check if email already exists
        foreach ($utilizadores as $u) {
            if (strcasecmp($u['email'], $input['email']) === 0) {
                respond(['error' => 'Email já existe'], 409);
            }
        }

        // Generate new ID
        $ids = array_column($utilizadores, 'id');
        $newId = $ids ? max($ids) + 1 : 1;

        // Default estado to 'ativo' if not provided
        $estado = $input['estado'] ?? 'ativo';

        // Store password as is or hashed? The JSON example uses "password" field, but frontend uses "password"
        // For simplicity, store password as "password" field (plaintext) - consider hashing in real app
        $novoUtilizador = [
            'id' => $newId,
            'perfil' => $input['perfil'], // default profile
            'nome' => $input['nome'],
            'email' => $input['email'],
            'password' => $input['password'], // store password as "password"
            'estado' => $estado,
        ];

        $utilizadores[] = $novoUtilizador;

        if (writeData($dataFile, $utilizadores)) {
            respond(['success' => true, 'item' => $novoUtilizador]);
        } else {
            respond(['error' => 'Erro ao adicionar utilizador'], 500);
        }
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'], $input['nome'], $input['email'], $input['password'], $input['estado'])) {
            respond(['error' => 'Dados incompletos'], 400);
        }

        // Check if email is used by another user
        foreach ($utilizadores as $u) {
            if ($u['id'] != $input['id'] && strcasecmp($u['email'], $input['email']) === 0) {
                respond(['error' => 'Email já existe para outro utilizador'], 409);
            }
        }

        $found = false;
        foreach ($utilizadores as &$u) {
            if ($u['id'] == $input['id']) {
                $u['perfil'] = $input['perfil'];
                $u['nome'] = $input['nome'];
                $u['email'] = $input['email'];
                $u['password'] = $input['password'];
                $u['estado'] = $input['estado'];
                $found = true;
                break;
            }
        }
        unset($u);

        if (!$found) {
            respond(['error' => 'Utilizador não encontrado'], 404);
        }

        if (writeData($dataFile, $utilizadores)) {
            respond(['success' => true]);
        } else {
            respond(['error' => 'Erro ao atualizar utilizador'], 500);
        }
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['id'])) {
            respond(['error' => 'ID não fornecido'], 400);
        }

        $index = null;
        foreach ($utilizadores as $key => $u) {
            if ($u['id'] == $input['id']) {
                $index = $key;
                break;
            }
        }

        if ($index === null) {
            respond(['error' => 'Utilizador não encontrado'], 404);
        }

        array_splice($utilizadores, $index, 1);

        if (writeData($dataFile, $utilizadores)) {
            respond(['success' => true]);
        } else {
            respond(['error' => 'Erro ao remover utilizador'], 500);
        }
        break;

    default:
        respond(['error' => 'Método não suportado'], 405);
}