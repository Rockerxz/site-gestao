<?php
session_start();
header('Content-Type: application/json');

$INACTIVITY_LIMIT = 15 * 60; // 15 minutos em segundos
$currentTime = time();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (isset($_SESSION['user'])) {
    // Verifica inatividade
    if (isset($_SESSION['ultimoAcesso'])) {
        $elapsed = $currentTime - $_SESSION['ultimoAcesso'];
        if ($elapsed > $INACTIVITY_LIMIT) {
            // Sessão expirada por inatividade
            session_unset();
            session_destroy();
            echo json_encode(['authenticated' => false]);
            exit;
        }
    }
    // Atualiza último acesso para renovar sessão
    $_SESSION['ultimoAcesso'] = $currentTime;

    echo json_encode([
        'authenticated' => true,
        'user' => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        'authenticated' => false
    ]);
}