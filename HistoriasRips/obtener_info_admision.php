<?php
header('Content-Type: application/json');

include "../funciones/conn3.php";

// Obtén el ID del parámetro GET
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $query = $conn3->prepare("SELECT * FROM sAdmision WHERE ID = ?");
    $query->bind_param("i", $id);
    $query->execute();
    $result = $query->get_result();
    
    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $data]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontraron datos.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
}

$conn->close();
