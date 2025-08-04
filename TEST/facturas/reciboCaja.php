<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de caja</title>
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
    </style>
</head>

<body>
    <!-- Primera línea: solo el logo -->
    <div class="logo-container">
        <img src="https://monaros.co/sistema/p/cenode.jpeg" alt="Logo de la empresa" class="logo">
    </div>

    <!-- Segunda línea: información empresa (izq) y factura (der) -->
    <div class="fila-informacion">
        <!-- Bloque izquierdo - Información de la empresa -->
        <div class="info-empresa">
            <div class="nombre-empresa">Nombre de la Empresa</div>
            <div>Sucursal: [Nombre de la Sucursal]</div>
            <div>RNC: [Código RNC]</div>
            <div>[Dirección completa de la empresa]</div>
            <div>Fecha de emisión: [Fecha actual]</div>
        </div>

        <!-- Bloque derecho - Información de la factura -->
        <div class="info-factura">
            <div class="titulo-factura">RECIBO DE CAJA</div>
            <div class="detalle-info">No. 32131231</div>
            <div class="detalle-info"><strong>Fecha: </strong> [Fecha actual]</div>
        </div>
    </div>

    <hr class="separador-inferior">

    <!-- Sección de datos del cliente -->
    <div class="datos-cliente">
        <h3 class="titulo-factura">DATOS DEL CLIENTE</h3>
        <p><strong>Nombre:</strong> Comercio, SRL</p>
        <p><strong>Identificación:</strong> 123456789</p>
        <p><strong>Dirección:</strong> Calle Principal #123, Ciudad, País</p>
    </div>

    <!-- Separador superior -->
    <hr class="separador-superior">

    <!-- Concepto -->
    <div class="concepto">
        <strong>Por concepto de:</strong> Venta de mercancías
    </div>

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
            <!-- Ejemplo de fila de producto -->
            <tr>
                <td>2</td>
                <td>Producto de ejemplo</td>
                <td>Unidad</td>
                <td>1,000.00</td>
                <td>180.00</td>
                <td>2,000.00</td>
            </tr>
            <!-- Aquí irían más filas de productos según sea necesario -->
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
                Fecha firma: 16/05/2023 14:30:45
            </div>
        </div>

        <!-- Sección derecha con totales -->
        <div class="totales">
            <div class="fila-total">
                <div class="etiqueta-total">Subtotal Gravado:</div>
                <div class="valor-total">2,000.00</div>
            </div>
            <div class="fila-total">
                <div class="etiqueta-total">Total:</div>
                <div class="valor-total">2,180.00</div>
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
            <tr>
                <td>Efectivo</td>
                <td>2,180.00</td>
            </tr>
            <!-- Puedes agregar más formas de pago si es necesario -->
        </tbody>
    </table>

    <hr class="separador-inferior">
    <!-- Espacio para firma -->
    <div class="texto-firma">FIRMA DE RECIBO</div>
    <div class="firma">
        __________________________<br>
        CC O NIT
    </div>
</body>

</html>