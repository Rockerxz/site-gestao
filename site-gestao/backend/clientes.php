<?php
// Template base para criar endpoints REST para cada recurso JSON

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Lida com preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$resource = basename(__FILE__, '.php');
$file = "../data/{$resource}.json";

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
    $data = readData($file);
    $input['id'] = time();
    $data[] = $input;
    writeData($file, $data);
    echo json_encode(['success' => true, 'item' => $input]);
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
      exit;
    }
    writeData($file, array_values($newData));
    echo json_encode(['success' => true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    break;
}
