<?php
require 'db.php';

$stmt = $conn->prepare("SELECT * FROM incidents ORDER BY created_at DESC");
$stmt->execute();
$result = $stmt->get_result();

$incidents = [];
while ($incident = $result->fetch_assoc()) {
    $incidents[] = $incident;
}

echo json_encode($incidents);

$stmt->close();
$conn->close();
?>
