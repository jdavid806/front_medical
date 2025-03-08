const secretKey = "123AjIL*456TYu789?";

function encryptData(data) {
  const encodedData = btoa(data + secretKey);
  return encodedData;
}

function decryptData(encryptedData) {
  const decodedData = atob(encryptedData);
  return decodedData.replace(secretKey, "");
}
