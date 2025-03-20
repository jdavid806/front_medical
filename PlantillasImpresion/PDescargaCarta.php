<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $titulo ?> - Impresión</title>
  <style>
    body {
      font-family: "Open Sans", sans-serif;
      margin: 0.8cm;
      color: #444;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .section {
      border-left: 3px solid #132030;
      padding-left: 5px;
    }

    .tabla-compacta {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .tabla-compacta td {
      padding: 4px 6px;
      border-bottom: 1px solid #EAEAEA;
      vertical-align: top;
    }

    .marca-agua {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.05;
      z-index: -1;
    }

    .marca-agua img {
      max-width: 250px;
    }

    .firma {
      text-align: center;
      margin-top: 15%;
    }

    .firma img {
      max-height: 80px;
      margin-bottom: 5px;
    }

    .firma-linea {
      border-top: 1.5px solid #aaa;
      width: 50%;
      margin: 5px auto;
    }

    .footer p {
      margin: 2px 0;
      font-size: 12px;
    }

    @media print {
      body {
        margin: 0.5cm;
      }

      .marca-agua {
        display: none;
      }
    }
  </style>
</head>
<body>
  <?php if (!$sin_marca_agua): ?>
    <div class="marca-agua">
      <img src="<?= $marca_agua ?>" alt="Marca de Agua">
    </div>
  <?php endif; ?>

  <div class="container">
    <div class="section">
      <h3><?= ucfirst($nombre_consultorio) ?></h3>
      <table class="tabla-compacta">
        <?php foreach ($datos_consultorio as $fila): ?>
          <tr>
            <?php foreach ($fila as $titulo => $dato): ?>
              <td><b><?= ucfirst($titulo) ?>:</b> <?= $dato ?></td>
            <?php endforeach; ?>
          </tr>
        <?php endforeach; ?>
      </table>
    </div>

    <div class="section">
      <h3>Datos del Paciente</h3>
      <table class="tabla-compacta">
        <?php foreach ($datos_paciente as $fila): ?>
          <tr>
            <?php foreach ($fila as $titulo => $dato): ?>
              <td><b><?= ucfirst($titulo) ?>:</b> <?= $dato ?></td>
            <?php endforeach; ?>
          </tr>
        <?php endforeach; ?>
      </table>
    </div>

    <div class="section">
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
  </div>
</body>
</html>
