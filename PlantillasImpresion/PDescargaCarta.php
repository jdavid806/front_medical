<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $titulo ?> - Impresión</title>
  <style>
    body {
      font-family: "Open Sans", sans-serif;
      margin: 1.3cm;
      color: #444;
      position: relative;
    }
    .marca-agua {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.07;
      z-index: -1;
    }
    .marca-agua img {
      max-width: 400px;
    }
    .header-table {
      width: 100%;
      margin-bottom: 20px;
    }
    .header-table .info-medica {
      border-left: 4px solid #132030;
      padding-left: 12px;
      vertical-align: top;
    }
    .header-table .info-medica table {
      width: 100%;
    }
    .header-table td {
      padding: 5px;
    }
    .table-datos-paciente {
      width: 100%;
      border-collapse: collapse;
      border-left: 4px solid #132030;
      margin-top: 15px;
    }
    .table-datos-paciente td {
      border-bottom: 1px solid #EAEAEA;
      padding: 8px 12px;
      vertical-align: top;
    }
    .contenido {
      border-left: 4px solid #132030;
      padding-left: 10px;
      margin-top: 15px;
    }
    .firma {
      margin-top: 30px;
      text-align: center;
      page-break-inside: avoid;
    }
    .firma img {
      max-height: 120px;
      margin-bottom: 10px;
    }
    .firma-linea {
      border-top: 2px solid #aaa;
      width: 60%;
      margin: 10px auto;
    }
    .footer p {
      margin: 2px 0;
    }
    @page {
      size: A4;
      margin: 1.3cm;
    }
  </style>
</head>
<body>
  <?php if (!$sin_marca_agua): ?>
    <div class="marca-agua">
      <img src="<?= $marca_agua ?>" alt="Marca de Agua">
    </div>
  <?php endif; ?>

  <table class="header-table">
    <tr>
      <?php if (!$sin_logo): ?>
        <td class="logo">
          <img src="<?= $logo_consultorio ?>" alt="Logo Consultorio">
        </td>
      <?php endif; ?>
      <td class="info-medica">
        <h2><?= ucfirst($nombre_consultorio) ?></h2>
        <table>
          <?php foreach ($datos_consultorio as $fila): ?>
            <tr>
              <?php foreach ($fila as $titulo => $dato): ?>
                <td><b><?= ucfirst($titulo) ?>:</b> <?= $dato ?></td>
              <?php endforeach; ?>
            </tr>
          <?php endforeach; ?>
        </table>
      </td>
    </tr>
  </table>

  <table class="table-datos-paciente">
    <tbody>
      <?php foreach ($datos_paciente as $fila): ?>
        <tr>
          <?php foreach ($fila as $titulo => $dato): ?>
            <td><b><?= ucfirst($titulo) ?>:</b> <?= $dato ?></td>
          <?php endforeach; ?>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>

  <div class="contenido">
    <?= $contenido ?>
  </div>

  <div class="footer">
    <div class="firma">
      <?php if (!$sin_firma): ?>
        <img src="<?= $firma_doctor ?>" alt="Firma Doctor">
      <?php endif; ?>
      <hr class="firma-linea">
      <p><strong><?= ucfirst($nombre_doctor) ?></strong></p>
      <p><?= ucfirst($especialidad_doctor) ?></p>
      <?= $firmaDigital ?>
    </div>
  </div>
</body>
</html>
