<?php

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    

    $stmt = $conn->prepare("SELECT id, password, is_admin FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && ($password === $user['password'])) {
        // Store user session details
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['is_admin'] = $user['is_admin'];

        // Redirect based on user role
        if ($user['is_admin']) {
            header("Location: /ITGY401PROJECT/AdminPage.html");
        } else {
            header("Location: /ITGY401PROJECT/ApplicationPage.html");
        }
        exit();
    } else {
        echo json_encode ("Invalid username or password.");
    }

    $stmt->close();
    $conn->close();
}
?>
