<?php
if (isset($_GET["ruta"])) {
  $filePath = $_GET["ruta"];

  if (file_exists($filePath)) {
    header("Content-Type: application/pdf");
    header("Content-Disposition: inline; filename=documento.pdf");
    readfile($filePath);
    exit;
  } else {
    echo "El archivo no existe.";
  }
} else {
  echo "No se especificó una ruta.";
}
?>