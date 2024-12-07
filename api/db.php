<?php
$host = 'localhost';       // Hostname of your MySQL server
$db = 'alertnet_db';       // Replace with your database schema name
$user = 'root';            // MySQL username (default is 'root' for local servers)
$pass = '';                // MySQL password (leave empty if using default for local)
$port = 3306;              // Default MySQL port

// Create the connection
$conn = new mysqli($host, $user, $pass, $db, $port);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
