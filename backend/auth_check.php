<?php
session_start();
header('Content-Type: application/json');

$INACTIVITY_LIMIT = 20; // 1 minuto (em segundos)
$currentTime = time();

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