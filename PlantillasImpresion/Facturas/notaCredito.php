<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota crédito</title>
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
    $fechaEmision = date("d/m/Y");

    // Variables de la nota de crédito
    $numeroNota = "NC-001-2023";
    $enfc = "E310000000001";
    $enfcModificado = "B310000000001";
    $tituloDocumento = "NOTA DE CRÉDITO";

    // Datos del cliente
    $nombreCliente = "Comercio, SRL";
    $rncCliente = "123456789";

    // Array de productos
    $productos = array(
        array(
            "cantidad" => 2,
            "descripcion" => "Producto de ejemplo 1",
            "unidad" => "Unidad",
            "precio" => 1000.00,
            "itbis" => 180.00,
            "valor" => 2000.00
        ),
        array(
            "cantidad" => 1,
            "descripcion" => "Producto de ejemplo 2",
            "unidad" => "Unidad",
            "precio" => 500.00,
            "itbis" => 90.00,
            "valor" => 500.00
        )
    );

    // Calcular totales
    $subtotalGravado = 0;
    $totalItbis = 0;
    $total = 0;

    foreach ($productos as $producto) {
        $subtotalGravado += $producto['valor'];
        $totalItbis += $producto['itbis'];
    }

    $total = $subtotalGravado + $totalItbis;
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

        <!-- Bloque derecho - Información de la nota de crédito -->
        <div class="info-factura">
            <div class="titulo-factura"><?php echo $tituloDocumento; ?></div>
            <div class="detalle-info">e-NCF: <?php echo $enfc; ?></div>
            <div class="detalle-info">NCF Modificado: <?php echo $enfcModificado; ?></div>
            <div class="detalle-info">Corrige montos del NCF modificado</div>
            <div class="detalle-info">Fecha: <?php echo $fechaEmision; ?></div>
        </div>
    </div>

    <hr class="separador-inferior">

    <!-- Sección de datos del cliente -->
    <div class="datos-cliente">
        <h3 class="titulo-factura">DATOS DEL CLIENTE</h3>
        <p><strong>Razón social:</strong> <?php echo $nombreCliente; ?></p>
        <p><strong>RNC:</strong> <?php echo $rncCliente; ?></p>
    </div>

    <!-- Separador superior -->
    <hr class="separador-superior">

    <!-- Tabla de productos -->
    <table>
        <thead>
            <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th>Unidad de Medida</th>
                <th>Precio</th>
                <th>ITBIS</th>
                <th>Valor</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($productos as $producto): ?>
                <tr>
                    <td><?php echo $producto['cantidad']; ?></td>
                    <td><?php echo $producto['descripcion']; ?></td>
                    <td><?php echo $producto['unidad']; ?></td>
                    <td><?php echo number_format($producto['precio'], 2); ?></td>
                    <td><?php echo number_format($producto['itbis'], 2); ?></td>
                    <td><?php echo number_format($producto['valor'], 2); ?></td>
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
                <div class="etiqueta-total">Subtotal Gravado:</div>
                <div class="valor-total"><?php echo number_format($subtotalGravado, 2); ?></div>
            </div>
            <div class="fila-total">
                <div class="etiqueta-total">Total ITBIS:</div>
                <div class="valor-total"><?php echo number_format($totalItbis, 2); ?></div>
            </div>
            <div class="fila-total">
                <div class="etiqueta-total">Total:</div>
                <div class="valor-total"><?php echo number_format($total, 2); ?></div>
            </div>
        </div>
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