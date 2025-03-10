<?php
function encryptData($data)
{
  $encodedData = base64_encode($data . "123AjIL*456TYu789?");
  return $encodedData;
}


function decryptData($encryptedData)
{
  $decodedData = base64_decode($encryptedData);
  return str_replace("123AjIL*456TYu789?", '', $decodedData);
}
?>