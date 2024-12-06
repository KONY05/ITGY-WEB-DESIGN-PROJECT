<?php
require 'db.php';

$stmt = $conn->prepare("SELECT * FROM incidents ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$incidents = [];
while ($row = $result->fetch_assoc()) {
    $incidents[] = $row;
}

echo json_encode($incidents);

$stmt->close();
$conn->close();
?>
