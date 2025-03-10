<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> <?= $titulo ?> - Impresión</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      position: relative;
      font-family: Arial, sans-serif;
      font-size: 10px;
      line-height: 1.4;
    }

    .marca-agua {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      color: rgba(0, 0, 0, 0.05);
      z-index: -1;
      text-align: center;
      white-space: nowrap;
    }

    .marca-agua img {
      opacity: 0.2;
    }

    .header {
      display: flex;
      align-items: flex-start;
      padding-top: 10px;
    }

    .logo {
      flex-basis: 30%;
      max-width: 30%;
      padding: 1em;
    }

    .logo img {
      width: 100%;
      height: auto;
      display: block;
      max-width: 150px;
    }

    .info-Medica {
      .info-medica {
        width:
          <?= $tamañoDiv ?>
        ;
        display: inline-block;
        vertical-align: top;
        padding-left:
          <?= $paddingDiv ?>
        ;
      }
    }

    .table-sm td,
    .table-sm th {
      padding: 2px !important;
    }

    hr {
      border: 1px solid #000;
      margin: 15px 0;
    }

    .footer {
      position: relative;
      width: 100%;
      page-break-inside: avoid;
      margin-top: 2em;
      margin-bottom: 0;
    }

    .firma {
      text-align: left;
      max-width: 250px;
      margin-bottom: 20px;
    }

    .firma-linea {
      width: 65%;
      border: 1px solid black;
      margin: 10px 0 5px 0;
    }

    .espacio-firma {
      width: 17em;
      max-width: 17em;
      height: 4em;
      max-height: 5em;
      overflow: hidden;
    }

    .espacio-firma img {
      max-width: 17em;
      max-height: 5em;
      object-fit: contain;
    }

    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .btn-vertical {
      writing-mode: vertical-rl;
      text-orientation: upright;
      padding: 10px;
      font-size: 1.2rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      border: 2px solid #0056b3;
      transition: all 0.3s ease-in-out;
    }

    .btn-vertical:hover {
      background-color: #0056b3;
      border-color: #003f7f;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f2f2f2;
      font-weight: bold;
    }

    thead td,
    {
    border: 2px solid black;
    padding: 8px;
    text-align: left;
    }

    @page {
      size: A4;
      margin: 1.5cm;
    }
  </style>
</head>

<body>

  <?php if (!$sin_marca_agua): ?>
    <div class="marca-agua">
      <img src="<?= $marca_agua ?>" alt="Marca de Agua" class="img-fluid">
    </div>
  <?php endif; ?>

  <table>
    <thead>
      <tr>
        <td>
          <div class="header">
            <?php if (!$sin_logo): ?>
              <div class="logo">
                <img src="<?= $logo_consultorio ?>" alt="Logo Consultorio" class="img-fluid" style="max-width: 150px;">
              </div>
            <?php endif; ?>
            <div class="info-Medica">
              <h2 class="text-center"><?= $nombre_consultorio ?></h2>
              <table class="table table-bordered table-sm">
                <?php foreach ($datos_consultorio as $fila): ?>
                  <tr>
                    <?php foreach ($fila as $titulo => $dato): ?>
                      <td><b><?= $titulo ?>:</b> <?= $dato ?></td>
                    <?php endforeach; ?>
                  </tr>
                <?php endforeach; ?>
              </table>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <hr>
          <table class="table table-bordered table-sm">
            <tbody>
              <?php foreach ($datos_paciente as $fila): ?>
                <tr>
                  <?php foreach ($fila as $titulo => $dato): ?>
                    <td><b><?= $titulo ?>:</b> <?= $dato ?></td>
                  <?php endforeach; ?>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
          <hr>
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><?= $contenido ?></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>
          <div class="footer">
            <div class="firma">
              <div class="espacio-firma">
                <?php if (!$sin_firma): ?>
                  <img src="<?= $firma_doctor ?>" alt="Firma Doctor" class="img-fluid">
                <?php endif; ?>
              </div>
              <hr class="firma-linea">
              <p><strong><?= $nombre_doctor ?></strong></p>
              <p><?= $especialidad_doctor ?></p>
              <?= $firmaDigital ?>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</body>

</html>