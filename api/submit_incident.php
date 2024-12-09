<?php
require 'db.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json'); // Ensure JSON response

try {
    // Parse the JSON input
    $inputData = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    if (
        empty($inputData['description']) || 
        empty($inputData['classification']) || 
        empty($inputData['urgency_level']) || 
        empty($inputData['location']) || 
        empty($inputData['time'])
    ) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    // Extract fields from the input data
    $description = $inputData['description'];
    $classification = $inputData['classification'];
    $urgency_level = $inputData['urgency_level'];
    $location = $inputData['location'];
    $time = $inputData['time'];
    $media_path = null;

    // Handle file uploads if media is provided
    if (!empty($_FILES['media']['name'])) {
        $target_dir = "../uploads/"; // Adjust the directory as needed
        $media_path = $target_dir . basename($_FILES["media"]["name"]);

        if (!move_uploaded_file($_FILES["media"]["tmp_name"], $media_path)) {
            echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
            exit();
        }
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO incidents (description, media_url, classification, urgency_level, location, time) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $description, $media_path, $classification, $urgency_level, $location, $time);

    // Execute the query and handle results
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Incident reported successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database insertion failed: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Catch any other errors
    echo json_encode(['status' => 'error', 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
    exit();
}
?>
