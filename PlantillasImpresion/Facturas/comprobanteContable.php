<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante Contable</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }

        .logo-container {
            margin-bottom: 15px;
        }

        .logo {
            width: 150px;
            height: auto;
        }

        .fila-informacion {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .info-empresa {
            line-height: 1.5;
            width: 60%;
        }

        .nombre-empresa {
            color: #132030;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .info-factura {
            text-align: right;
            line-height: 1.5;
            width: 35%;
        }

        .titulo-factura {
            color: #132030;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .detalle-info {
            font-size: 14px;
            margin-bottom: 3px;
        }

        .separador-superior {
            margin: 25px 0 15px 0;
            border: 0;
            border-top: 1px solid #132030;
        }

        .separador-inferior {
            margin: 15px 0 10px 0;
            border: 0;
            border-top: 1px solid #132030;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        th {
            background-color: #132030;
            color: white;
            text-align: left;
            padding: 8px;
            font-weight: bold;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .seccion-final {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .info-qr {
            width: 40%;
        }

        .qr-image {
            width: 120px;
            height: 120px;
            background-color: #f0f0f0;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }

        .codigo-seguridad {
            font-weight: bold;
            margin-bottom: 15px;
        }

        .fecha-firma {
            font-style: italic;
        }

        .totales {
            text-align: right;
            width: 65%;
        }

        .fila-total {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
        }

        .etiqueta-total {
            font-weight: bold;
            width: 150px;
        }

        .valor-total {
            width: 120px;
            text-align: right;
        }

        .datos-cliente {
            margin-bottom: 15px;
        }

        .datos-cliente h3 {
            color: #132030;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .datos-cliente p {
            margin: 5px 0;
        }

        .concepto {
            margin-bottom: 15px;
            font-style: italic;
        }

        .tabla-pago {
            width: 50%;
            margin: 20px 0 30px 0;
        }

        .firma {
            margin-top: 50px;
            text-align: center;
            width: 100%;
            padding-top: 100px;
        }

        .texto-firma {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .btn-print {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #132030;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-print:hover {
            background-color: #1a2a40;
        }

        @media print {
            .btn-print {
                display: none;
            }

            body {
                padding: 0;
                margin: 0;
            }
        }
    </style>
</head>

<body>
    <?php
    // Variables de la empresa
    $nombreEmpresa = "Mi Empresa SRL";
    $sucursal = "Sucursal Principal";
    $rnc = "123-456789-1";
    $direccionEmpresa = "Calle Principal #123, Santo Domingo, RD";
    $fechaEmision = date("d/m/Y H:i:s");

    // Variables del comprobante
    $numeroComprobante = "COMP-001-2023";
    $tituloComprobante = "COMPROBANTE CONTABLE";

    // Datos del cliente
    $nombreCliente = "Comercio, SRL";
    $nitCliente = "123456789";
    $direccionCliente = "Calle Principal #123, Ciudad, País";

    // Detalle del comprobante
    $concepto = "Venta de mercancías";

    // Array de items contables
    $itemsContables = array(
        array(
            "centro_costos" => "4",
            "codigo" => "A123",
            "descripcion" => "Producto de ejemplo 1",
            "valor" => 1000.00
        ),
        array(
            "centro_costos" => "5",
            "codigo" => "B456",
            "descripcion" => "Producto de ejemplo 2",
            "valor" => 500.00
        )
    );

    // Formas de pago
    $formasPago = array(
        array(
            "forma" => "Banco #1",
            "valor" => 1500.00
        ),
        array(
            "forma" => "Efectivo",
            "valor" => 180.00
        )
    );

    // Calcular totales
    $total = 0;
    foreach ($itemsContables as $item) {
        $total += $item['valor'];
    }
    ?>

    <!-- Primera línea: solo el logo -->
    <div class="logo-container">
        <img src="https://monaros.co/sistema/p/cenode.jpeg" alt="Logo de la empresa" class="logo">
    </div>

    <!-- Segunda línea: información empresa (izq) y factura (der) -->
    <div class="fila-informacion">
        <!-- Bloque izquierdo - Información de la empresa -->
        <div class="info-empresa">
            <div class="nombre-empresa"><?php echo $nombreEmpresa; ?></div>
            <div>Sucursal: <?php echo $sucursal; ?></div>
            <div>RNC: <?php echo $rnc; ?></div>
            <div><?php echo $direccionEmpresa; ?></div>
            <div>Fecha de emisión: <?php echo $fechaEmision; ?></div>
        </div>

        <!-- Bloque derecho - Información del comprobante -->
        <div class="info-factura">
            <div class="titulo-factura"><?php echo $tituloComprobante; ?></div>
            <div class="detalle-info"><strong>Saldos iniciales No. </strong><?php echo $numeroComprobante; ?></div>
            <div class="detalle-info"><strong>Fecha: </strong> <?php echo $fechaEmision; ?></div>
        </div>
    </div>

    <hr class="separador-inferior">

    <!-- Sección de datos del cliente -->
    <div class="datos-cliente">
        <h3 class="titulo-factura">RECIBIDO DE</h3>
        <p><strong>Nombre:</strong> <?php echo $nombreCliente; ?></p>
        <p><strong>NIT:</strong> <?php echo $nitCliente; ?></p>
        <p><strong>Dirección:</strong> <?php echo $direccionCliente; ?></p>
    </div>

    <!-- Separador superior -->
    <hr class="separador-superior">

    <!-- Concepto -->
    <div class="concepto">
        <strong>DETALLE:</strong> <?php echo $concepto; ?>
    </div>

    <!-- Tabla de items contables -->
    <table>
        <thead>
            <tr>
                <th>Centro de costos</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($itemsContables as $item): ?>
                <tr>
                    <td><?php echo $item['centro_costos']; ?></td>
                    <td><?php echo $item['codigo']; ?></td>
                    <td><?php echo $item['descripcion']; ?></td>
                    <td><?php echo number_format($item['valor'], 2); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <!-- Separador inferior -->
    <hr class="separador-inferior">

    <!-- Sección final con QR y totales -->
    <div class="seccion-final">
        <!-- Sección izquierda con QR y datos -->
        <div class="info-qr">
            <div class="qr-image">
                <!-- Espacio para el código QR -->
                [Código QR]
            </div>
            <div class="codigo-seguridad">
                Código de seguridad: S/DQdu
            </div>
            <div class="fecha-firma">
                Fecha firma: <?php echo date("d/m/Y H:i:s"); ?>
            </div>
        </div>

        <!-- Sección derecha con totales -->
        <div class="totales">
            <div class="fila-total">
                <div class="etiqueta-total">Total:</div>
                <div class="valor-total"><?php echo number_format($total, 2); ?></div>
            </div>
        </div>
    </div>

    <!-- Tabla de forma de pago -->
    <table class="tabla-pago">
        <thead>
            <tr>
                <th>Forma de pago</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($formasPago as $pago): ?>
                <tr>
                    <td><?php echo $pago['forma']; ?></td>
                    <td><?php echo number_format($pago['valor'], 2); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <hr class="separador-inferior">
    <!-- Espacio para firma -->
    <div class="texto-firma">FIRMA DE RECIBO</div>
    <div class="firma">
        __________________________<br>
        CC O NIT
    </div>

    <button class="btn-print" onclick="window.print()" title="Imprimir documento">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
    </button>
</body>

</html>