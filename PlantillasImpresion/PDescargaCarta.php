<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $titulo ?> - Impresión</title>
  <style>
    body {
      font-family: "Segoe UI", sans-serif;
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

    /* Borde lateral azul SOLO en la info del consultorio */
    .header-table .info-medica {
      border-left: 4px solid #132030;
      padding-left: 12px;
    }

    /* Tabla del paciente mantiene borde lateral */
    .table-datos-paciente {
      width: 100%;
      border-collapse: collapse;
      border-left: 4px solid #132030;
      margin-top: 15px;
    }

    .table-datos-paciente td {
      border-bottom: 1px solid #EAEAEA;
      padding: 10px;
    }

    /* Contenido general también con borde lateral azul */
    .contenido {
      border-left: 4px solid #132030;
      padding-left: 10px;
      margin-top: 15px;
    }

    /* Ajustes para la firma (footer) */
    .firma img {
      max-height: 90px;
    }

    .firma-linea {
      border-top: 1px solid #aaa;
      margin: 10px 0;
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
        <h2><?= $nombre_consultorio ?></h2>
        <table>
          <?php foreach ($datos_consultorio as $fila): ?>
            <tr>
              <?php foreach ($fila as $titulo => $dato): ?>
                <td><b><?= $titulo ?>:</b> <?= $dato ?></td>
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
            <td><b><?= $titulo ?>:</b> <?= $dato ?></td>
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
      <p><strong><?= $nombre_doctor ?></strong></p>
      <p><?= $especialidad_doctor ?></p>
      <?= $firmaDigital ?>
    </div>
  </div>
</body>

</html>