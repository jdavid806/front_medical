<?php
$sin_logo = empty($logo_consultorio) || in_array(strtolower(trim($logo_consultorio)), ["vacío", "No especificado", "null", ""]);
$sin_marca_agua = empty($marca_agua) || in_array(strtolower(trim($marca_agua)), ["vacío", "No especificado", "null", ""]);

if (!$sin_logo) {
  $tamañoDiv = "100%";
} else {
  $tamañoDiv = "700%";
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> <?= $titulo ?> - Impresión</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      position: relative;
    }

    .marca-agua {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 50px;
      color: rgba(0, 0, 0, 0.005);
      z-index: -1;
      text-align: center;
      white-space: nowrap;
    }

    .marca-agua img {
      opacity: 0.2;
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
    }

    .info-Medica {
      flex-basis:
        <?= $tamañoDiv ?>
      ;
      max-width:
        <?= $tamañoDiv ?>
      ;
    }

    .table-sm td,
    .table-sm th {
      padding: 4px !important;
    }

    hr {
      border: 1px solid #000;
      margin: 15px 0;
    }

    .footer {
      position: relative;
      width: 100%;
      padding-top: 20px;
      page-break-before: always;
    }

    .firma {
      text-align: left;
      max-width: 250px;
      margin-bottom: 50px;
    }

    .firma-linea {
      width: 100%;
      border: 1px solid black;
      margin: 20px 0 5px 0;
    }

    .espacio-firma {
      width: 17em;
      max-width: 17em;
      height: 5em;
      max-height: 5em;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      margin-top: 10em;
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

    @page {
      size: A4;
      margin: 2cm 1.5cm 2cm 1.5cm;
    }

    @media print {
      .no-print {
        display: none;
      }

      .logo {
        flex-basis: 30% !important;
        max-width: 30% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .header,
      .footer {
        position: fixed;
        width: 100%;
        left: 0;
      }

      .header {
        top: 0;
        background: white;
        padding: 10px 0;
      }

      .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: white;
        padding: 10px 0;
      }

      .contenido {
        page-break-inside: avoid;
      }

      .firma {
        text-align: left;
        max-width: 250px;
        margin-bottom: 50px;
      }

      body {
        margin-top: 150px;
        margin-bottom: 120px;
      }
    }
  </style>
</head>

<body>
  <button class="btn btn-primary print-button no-print btn-vertical" onclick="window.print()">
    🖨️ Imprimir
  </button>

  <?php if (!$sin_marca_agua): ?>
    <div class="marca-agua"> <?= $marca_agua ?> </div>
  <?php endif; ?>

  <div class="header">
    <div class="">
      <div class="d-flex pb-0">
        <?php if (!$sin_logo): ?>
          <div class="logo">
            <img src="<?= $logo_consultorio ?>" alt="Logo Consultorio" class="img-fluid">
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
      <hr>
    </div>
  </div>

  <div class="contenido mt-2">
    <div>
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
    </div>

    <hr>

    <div>
      <?= $contenido ?>
    </div>

    <div class="footer">
      <div class="container">
        <div class="firma">
          <div class="espacio-firma">

          </div>
          <hr class="firma-linea">
          <p><strong><?= $nombre_doctor ?></strong></p>
          <p><?= $especialidad_doctor ?></p>
        </div>
      </div>
    </div>
</body>

</html>