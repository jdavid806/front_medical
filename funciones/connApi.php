<?php
$hostApi = '154.38.165.62';
$userdbApi = 'apidian24';
$passApi = 'EL9u;UC)b!AY';
$DBApi = 'apidian24';
$connApi = mysqli_connect($hostApi, $userdbApi, $passApi, $DBApi) or die('Ha fallado la conexion MySQL: ' . mysqli_error($connApi));

?>