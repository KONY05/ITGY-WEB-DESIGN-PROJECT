<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $incident_id = $_POST['incident_id'];

    $stmt = $conn->prepare("DELETE FROM incidents WHERE id = ?");
    $stmt->bind_param("i", $incident_id);

    if ($stmt->execute()) {
        echo "Incident deleted successfully.";
    } else {
        echo "Error deleting incident: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
