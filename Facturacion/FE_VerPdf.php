<?php
include "../funciones/conn3.php";
include "../funciones/connApi";
include "../funciones/FE_Api.php";
$idOperacion = $_GET['idOperacion'];
$queryList = mysqli_query($conn3, "SELECT * FROM FacturaOperacion WHERE idOperacion = $idOperacion");
$nrowl = mysqli_num_rows($queryList);
while ($rowMotorizado = mysqli_fetch_array($queryList)) {
  $numeroDoc = $rowMotorizado['numeroDoc'];
}

$queryList2 = mysqli_query($connApi, "SELECT * FROM  documents where prefix = 'FE' AND number='$numeroDoc'");
$nrowl = mysqli_num_rows($queryList2);
while ($rowMotorizado2 = mysqli_fetch_array($queryList2)) {
  $identification_number        = $rowMotorizado2['identification_number'];
  $pdf        = $rowMotorizado2['pdf'];
}
$identification_number=901841973;
$pdf='FES-FE3.pdf';
$PDF =$identification_number.'/'.$pdf;
$ConsultarPDF = ConsultarPDF($PDF);

  echo '<iframe src="data:application/pdf;base64,' . base64_encode($ConsultarPDF) . '" width="100%" height="100%"></iframe>';
