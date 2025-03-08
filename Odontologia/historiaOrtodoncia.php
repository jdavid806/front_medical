<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visualizador DICOM</title>
  <script src="https://unpkg.com/cornerstone-core"></script>
  <script src="https://unpkg.com/cornerstone-wado-image-loader"></script>
  <style>
    #dicomViewer {
      width: 512px;
      height: 512px;
      border: 1px solid black;
      margin: auto;
    }
  </style>
</head>
<body>
  <h1>Visualizador de archivos DICOM</h1>
  <input type="file" id="fileInput">
  <div id="dicomViewer"></div>

  <script>
    const element = document.getElementById("dicomViewer");
    cornerstone.enable(element);

    document.getElementById("fileInput").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
          const arrayBuffer = e.target.result;
          const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
          cornerstone.loadImage(imageId).then((image) => {
            cornerstone.displayImage(element, image);
          });
        };
        fileReader.readAsArrayBuffer(file);
      }
    });
  </script>
</body>
</html>
