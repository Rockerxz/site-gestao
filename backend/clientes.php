<?php
header("Content-Type: application/json");

// CORS headers (adjusted to allow credentials and dynamic origin)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(204);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$file = "../data/clientes.json";

function readData($file) {
  if (!file_exists($file)) file_put_contents($file, json_encode([]));
  $json = file_get_contents($file);
  return json_decode($json, true);
}

function writeData($file, $data) {
  file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
  case 'GET':
    echo json_encode(['data' => readData($file)]);
    break;

  case 'POST':
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !is_array($input)) {
      http_response_code(400);
      echo json_encode(['error' => 'Dados inválidos']);
      exit();
    }
    // Validate required fields (at least nome)
    if (empty($input['nome'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Campo nome é obrigatório']);
      exit();
    }
    $data = readData($file);
    $input['id'] = time();
    // Ensure all expected fields exist
    $fields = ['nome', 'empresa', 'endereco', 'email', 'telefone', 'comentarios'];
    $newItem = [];
    foreach ($fields as $field) {
      $newItem[$field] = isset($input[$field]) ? $input[$field] : '';
    }
    $newItem['id'] = $input['id'];
    $data[] = $newItem;
    writeData($file, $data);
    echo json_encode(['success' => true, 'item' => $newItem]);
    break;

  case 'PUT':
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Campo id obrigatório']);
      exit();
    }
    $data = readData($file);
    $found = false;
    foreach($data as &$item) {
      if($item['id'] == $input['id']) {
        $item = array_merge($item, $input);
        $found = true;
        break;
      }
    }
    if(!$found) {
      http_response_code(404);
      echo json_encode(['error'=>'Item não encontrado']);
      exit;
    }
    writeData($file, $data);
    echo json_encode(['success' => true]);
    break;

  case 'DELETE':
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Campo id obrigatório']);
      exit();
    }
    $data = readData($file);
    $newData = array_filter($data, fn($item) => $item['id'] != $input['id']);
    if (count($data) == count($newData)) {
      http_response_code(404);
      echo json_encode(['error' => 'Item não encontrado']);
      exit();
    }
    writeData($file, array_values($newData));
    echo json_encode(['success' => true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    break;
}