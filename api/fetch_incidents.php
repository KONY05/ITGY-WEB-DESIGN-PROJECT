<?php

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
$stmt = $conn->prepare("SELECT * FROM incidents ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$incidents = [];
while ($row = $result->fetch_assoc()) {
    $incidents[] = $row;
}

// Return incidents as JSON
header('Content-Type: application/json');
echo json_encode($incidents);


$stmt->close();
$conn->close();
}
?>
