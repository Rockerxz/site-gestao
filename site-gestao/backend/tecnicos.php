<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Ajuste para seu domínio se quiser mais segurança
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$file = '../data/tecnicos.json';

// Para requests OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Lê o arquivo JSON e retorna o array
function readData() {
    global $file;
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    $json = file_get_contents($file);
    return json_decode($json, true);
}

// Grava o array no arquivo JSON
function writeData($data) {
    global $file;
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
  case 'GET':
    $data = readData();
    echo json_encode($data);
    break;

  case 'POST':
    $input = json_decode(file_get_contents('php://input'), true);
    if(!isset($input['nome']) || !isset($input['email'])) {
      http_response_code(400);
      echo json_encode(['error'=>'Campos nome e email são obrigatórios']);
      exit;
    }
    $data = readData();
    $novo = [
      'id' => time(),
      'nome' => $input['nome'],
      'email' => $input['email']
    ];
    $data[] = $novo;
    writeData($data);
    echo json_encode($novo);
    break;

  case 'PUT':
    $input = json_decode(file_get_contents('php://input'), true);
    if(!isset($input['id'])) {
      http_response_code(400);
      echo json_encode(['error'=>'Campo id obrigatório']);
      exit;
    }
    $data = readData();
    $found = false;
    foreach($data as &$item) {
      if($item['id'] == $input['id']) {
        if(isset($input['nome'])) $item['nome'] = $input['nome'];
        if(isset($input['email'])) $item['email'] = $input['email'];
        $found = true;
        break;
      }
    }
    if(!$found) {
      http_response_code(404);
      echo json_encode(['error'=>'Técnico não encontrado']);
      exit;
    }
    writeData($data);
    echo json_encode(['success'=>true]);
    break;

  case 'DELETE':
    $input = json_decode(file_get_contents('php://input'), true);
    if(!isset($input['id'])) {
      http_response_code(400);
      echo json_encode(['error'=>'Campo id obrigatório']);
      exit;
    }
    $data = readData();
    $newData = array_filter($data, fn($item) => $item['id'] != $input['id']);
    if(count($data) == count($newData)) {
      http_response_code(404);
      echo json_encode(['error'=>'Técnico não encontrado']);
      exit;
    }
    writeData(array_values($newData));
    echo json_encode(['success'=>true]);
    break;

  default:
    http_response_code(405);
    echo json_encode(['error'=>'Método não permitido']);
    break;
}
