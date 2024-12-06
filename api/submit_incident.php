<?php
require 'db.php'; // Include your database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = 1; // Replace with the logged-in user's ID (e.g., from session)
    $description = $_POST['incidentDesc'];
    $classification = $_POST['classification'];
    $urgency_level = $_POST['urgency_level'];
    $location = $_POST['location'];
    $time = $_POST['time'];

    // Handle file upload
    $target_dir = "uploads/"; // Directory where files will be saved
    $media_path = null;

    if (!empty($_FILES['media']['name'])) {
        $target_file = $target_dir . basename($_FILES["media"]["name"]);
        if (move_uploaded_file($_FILES["media"]["tmp_name"], $target_file)) {
            $media_path = $target_file; // Save file path
        } else {
            echo "Error uploading file.";
            exit();
        }
    }

    // Insert incident into the database
    $stmt = $conn->prepare("INSERT INTO incidents (user_id, description, media_url, classification, urgency_level, location, time) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $description, $media_path, $classification, $urgency_level, $location, $time);

    if ($stmt->execute()) {
        echo "Incident reported successfully!";
        header("Location: ApplicationPage.html");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
    $stmt->close();
    $conn->close();
}
?>
