<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $titulo ?> - Impresión</title>
    <style>
        body {
            font-family: "Open Sans", sans-serif;
            margin: 0 auto;
            color: #444;
            position: relative;
            width: 5.5in;
            /* Ancho media carta */
            padding: 0.25in;
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
            max-width: 300px;
        }

        .header-table {
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 5px;
        }

        .header-table td {
            padding: 2px;
            vertical-align: top;
        }

        .logo {
            width: 25%;
            height: 60px;
        }

        .logo img {
            max-width: 100%;
            height: 80px;
            display: block;
        }

        .info-medica {
            width: 75%;
            border-left: 3px solid #132030;
            padding-left: 6px;
            font-size: 12px;
        }

        .info-medica h2 {
            margin: 0 0 4px 0;
            font-size: 16px;
        }

        .info-medica table {
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;
        }

        .info-medica table td {
            padding: 0 8px 0 0;
        }

        .info-medica tr {
            line-height: 1.1;
        }

        .info-medica td {
            padding: 2px 3px;
            vertical-align: top;
        }

        .table-datos-paciente {
            width: 100%;
            border-collapse: collapse;
            border-left: 3px solid #132030;
            margin-top: 6px;
            font-size: 11px;
        }

        .table-datos-paciente td {
            border-bottom: 1px solid #EAEAEA;
            padding: 3px 6px;
            vertical-align: top;
            line-height: 1.2;
        }

        .contenido {
            border-left: 3px solid #132030;
            padding-left: 8px;
            margin-top: 8px;
            font-size: 12px;
            line-height: 1.3;
        }

        .contenido hr {
            margin: 0.2rem 0 0.2rem 0 !important;
        }

        .footer {
            display: flex;
            justify-content: center;
            position: relative;
            margin-top: 8px;
            page-break-inside: avoid;
            font-size: 11px;
        }

        .firma {
            text-align: center;
        }

        .sello {
            position: absolute;
            right: 5%;
            top: 80px;
        }

        .sello img {
            max-height: 70px;
            opacity: 0.8;
            transform: rotate(-10deg);
        }

        .firma img {
            max-height: 70px;
            margin-bottom: 8px;
        }

        .firma-linea {
            border-top: 1px solid #aaa;
            width: 60%;
            margin: 8px auto;
        }

        .footer p {
            margin: 1px 0;
            font-size: 11px;
        }

        @page {
            size: 5.5in 8.5in;
            /* Tamaño media carta */
            margin: 0.25in;
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