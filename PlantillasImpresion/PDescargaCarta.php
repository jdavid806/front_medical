<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $titulo ?> - Impresión</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 10px;
      line-height: 1.4;
      padding: 5%;
    }

    /* Marca de agua */
    .marca-agua {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      color: rgba(0, 0, 0, 0.05);
      text-align: center;
      white-space: nowrap;
    }

    .marca-agua img {
      opacity: 0.2;
      max-width: 200px;
    }

    /* Tabla para el encabezado */
    .header-table {
      width: 100%;
      border-collapse: collapse;
    }

    .header-table td {
      vertical-align: top;
      padding: 5px;
      border: none; /* Se eliminan los bordes en el encabezado */
    }

    .logo {
      width: 30%;
      text-align: left;
    }

    .logo img {
      max-width: 150px;
    }

    .info-medica {
      width: 70%;
      text-align: left;
    }

    /* Estilos para la tabla de datos del paciente */
    .table-datos-paciente {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .table-datos-paciente td {
      border: 2px solid black;
      padding: 5px;
      text-align: left;
    }

    .contenido{
      margin: 3% auto;
    }

    .footer {
      width: 100%;
      page-break-inside: avoid;
      margin-top: 2em;
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
      overflow: hidden;
    }

    .espacio-firma img {
      max-width: 17em;
      max-height: 5em;
      object-fit: contain;
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
      <div class="espacio-firma">
        <?php if (!$sin_firma): ?>
          <img src="<?= $firma_doctor ?>" alt="Firma Doctor">
        <?php endif; ?>
      </div>
      <hr class="firma-linea">
      <p><strong><?= $nombre_doctor ?></strong></p>
      <p><?= $especialidad_doctor ?></p>
      <?= $firmaDigital ?>
    </div>
  </div>

</body>

</html>
