const profilePreview = document.getElementById("profilePreview");
const uploadImage = document.getElementById("uploadImage");
const takePhoto = document.getElementById("takePhoto");
const capturePhoto = document.getElementById("capturePhoto");
const camera = document.getElementById("camera");
let stream;

// Manejar carga de imagen
uploadImage.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Activar la cámara
takePhoto.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    camera.srcObject = stream;
    camera.style.display = "block";
    takePhoto.classList.add("d-none");
    capturePhoto.classList.remove("d-none");
  } catch (err) {
    alert("No se pudo acceder a la cámara: " + err.message);
  }
});

// Capturar foto
capturePhoto.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);

  // Mostrar la foto capturada
  profilePreview.src = canvas.toDataURL("image/png");

  // Detener la cámara
  stream.getTracks().forEach((track) => track.stop());
  camera.style.display = "none";
  capturePhoto.classList.add("d-none");
  takePhoto.classList.remove("d-none");
});
