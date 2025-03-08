<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["pdf"])) {
  $tempDir = sys_get_temp_dir();
  $fileName = "documento_" . time() . ".pdf";
  $filePath = $tempDir . DIRECTORY_SEPARATOR . $fileName;

  if (move_uploaded_file($_FILES["pdf"]["tmp_name"], $filePath)) {
    echo json_encode(["ruta" => $filePath]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar el archivo."]);
  }
} else {
  http_response_code(400);
  echo json_encode(["error" => "No se recibió ningún archivo."]);
}
