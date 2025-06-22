<?php
session_start();

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$loginInput = $data['email'] ?? ''; // pode ser email ou nome
$password = $data['password'] ?? '';

$utilizadoresPath = __DIR__ . '/../data/utilizadores.json';
if (!file_exists($utilizadoresPath)) {
    echo json_encode(['success' => false, 'error' => 'Ficheiro de utilizadores não encontrado']);
    exit;
}

$utilizadores = json_decode(file_get_contents($utilizadoresPath), true);

foreach ($utilizadores as $u) {
    if (($u['email'] === $loginInput || $u['nome'] === $loginInput) && $u['password'] === $password) {
        if (isset($u['estado']) && $u['estado'] === 'bloqueado') {
            echo json_encode(['success' => false, 'error' => 'Este perfil está desativado']);
            exit;
        }
        $_SESSION['user'] = [
            'id' => $u['id'],
            'nome' => $u['nome'],
            'email' => $u['email'],
            'perfil' => $u['perfil'],
            'estado' => $u['estado'] ?? 'ativo'
        ];
        $_SESSION['ultimoAcesso'] = time(); // Regista o tempo do login
        echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Credenciais inválidas']);