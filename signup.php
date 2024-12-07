<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? null;
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;


    $hashed_password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    try{
    if ($stmt->execute()) {
        echo "Signup successful!";
        // Redirect to login page after successful signup
        header("Location: LoginPage.html");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
    } catch(mysqli_sql_exception $e) {
    echo "Error: " . $e->getMessage();
    }
    
    $stmt->close();
    $conn->close();
}
?>
