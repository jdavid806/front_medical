<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $titulo ?> - Impresión</title>
    <style>
        body {
            font-family: "Open Sans", sans-serif;
            margin: 0px 10px 10px 10px;
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
            border-spacing: 0;
            border-collapse: collapse;
        }

        .header-table td {
            padding: 2px;
            vertical-align: top;
        }

        .logo {
            width: 20%;
            height: 70px;
        }

        .logo img {
            max-width: 100%;
            height: 100px;
            display: block;
        }

        .info-medica {
            width: 70%;
            border-left: 4px solid #132030;
            padding-left: 8px;
            font-size: 14px;
        }

        .info-medica h2 {
            margin: 0 0 5px 0;
            font-size: 18px;
        }

        .info-medica table {
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
        }

        .info-medica table td {
            padding: 0 10px 0 0;
        }

        .info-medica tr {
            line-height: 1.2;
        }

        .info-medica td {
            padding: 3px 5px;
            vertical-align: top;
        }


        /* .header-table {
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
    } */

        .table-datos-paciente {
            width: 100%;
            border-collapse: collapse;
            border-left: 4px solid #132030;
            margin-top: 8px;
            font-size: 13px;
        }

        .table-datos-paciente td {
            border-bottom: 1px solid #EAEAEA;
            padding: 4px 8px;
            vertical-align: top;
            line-height: 1.3;
        }

        /* .table-datos-paciente {
      width: 100%;
      border-collapse: collapse;
      border-left: 4px solid #132030;
      margin-top: 15px;
    }

    .table-datos-paciente td {
      border-bottom: 1px solid #EAEAEA;
      padding: 8px 12px;
      vertical-align: top;
    } */

        .contenido {
            border-left: 4px solid #132030;
            padding-left: 10px;
            margin-top: 10px;
            font-size: 14px;
        }

        .contenido hr {
            margin: 0.25rem 0 0.25rem 0 !important;
        }

        .footer {
            display: flex;
            justify-content: center;
            position: relative;
            margin-top: 10px;
            page-break-inside: avoid;
        }

        .firma {
            text-align: center;
        }

        .sello {
            position: absolute;
            right: 5%;
            top: 120px;
        }

        .sello img {
            max-height: 90px;
            opacity: 0.8;
            transform: rotate(-10deg);
        }

        .firma img {
            max-height: 100px;
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
        <div class="sello">
            <img src="<?= $sello_doctor ?>" alt="Sello Doctor">
        </div>
        <div class="firma">
            <?php if (!$sin_firma): ?>
                <img src="<?= $firma_doctor ?>" alt="Firma Doctor">
            <?php endif; ?>
            <hr class="firma-linea">
            <p><strong><?= ucfirst($nombre_doctor) ?></strong></p>
            <?php if ($registro_medico): ?>
                <p><strong>Registro medico: </strong><?= ucfirst($registro_medico) ?></p>
            <?php endif; ?>
            <p><?= ucfirst($especialidad_doctor) ?></p>
            <?= $firmaDigital ?>
        </div>
    </div>

</body>

</html>