<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balance General</title>
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

        .info-balance {
            text-align: right;
            line-height: 1.5;
            width: 35%;
        }

        .titulo-balance {
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
            font-size: 12px;
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

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .totales {
            font-weight: bold;
            background-color: #f5f5f5;
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

    // Variables del balance
    $tituloDocumento = "BALANCE GENERAL";
    $fechaDesde = "01/01/2023";
    $fechaHasta = date("d/m/Y");

    // Datos de cuentas contables
    $cuentas = [
        [
            "nivel" => 1,
            "transaccional" => "No",
            "codigo" => "1101",
            "nombre" => "Caja y Bancos",
            "saldo_inicial" => 500000.00,
            "mov_debito" => 250000.00,
            "mov_credito" => 150000.00,
            "saldo_final" => 600000.00
        ],
        [
            "nivel" => 2,
            "transaccional" => "Sí",
            "codigo" => "110101",
            "nombre" => "Caja General",
            "saldo_inicial" => 200000.00,
            "mov_debito" => 100000.00,
            "mov_credito" => 50000.00,
            "saldo_final" => 250000.00
        ],
        [
            "nivel" => 2,
            "transaccional" => "Sí",
            "codigo" => "110102",
            "nombre" => "Banco Principal",
            "saldo_inicial" => 300000.00,
            "mov_debito" => 150000.00,
            "mov_credito" => 100000.00,
            "saldo_final" => 350000.00
        ],
        [
            "nivel" => 1,
            "transaccional" => "No",
            "codigo" => "1201",
            "nombre" => "Cuentas por Cobrar",
            "saldo_inicial" => 800000.00,
            "mov_debito" => 300000.00,
            "mov_credito" => 400000.00,
            "saldo_final" => 700000.00
        ]
    ];

    // Calcular totales
    $totalSaldoInicial = 0;
    $totalDebito = 0;
    $totalCredito = 0;
    $totalSaldoFinal = 0;

    foreach ($cuentas as $cuenta) {
        if ($cuenta['nivel'] == 1) { // Solo sumamos cuentas de nivel 1 para los totales
            $totalSaldoInicial += $cuenta['saldo_inicial'];
            $totalDebito += $cuenta['mov_debito'];
            $totalCredito += $cuenta['mov_credito'];
            $totalSaldoFinal += $cuenta['saldo_final'];
        }
    }
    ?>

    <!-- Primera línea: solo el logo -->
    <div class="logo-container">
        <img src="https://monaros.co/sistema/p/cenode.jpeg" alt="Logo de la empresa" class="logo">
    </div>

    <!-- Segunda línea: información empresa (izq) y balance (der) -->
    <div class="fila-informacion">
        <!-- Bloque izquierdo - Información de la empresa -->
        <div class="info-empresa">
            <div class="nombre-empresa"><?php echo $nombreEmpresa; ?></div>
            <div>Sucursal: <?php echo $sucursal; ?></div>
            <div>RNC: <?php echo $rnc; ?></div>
            <div><?php echo $direccionEmpresa; ?></div>
            <div>Fecha de emisión: <?php echo $fechaEmision; ?></div>
        </div>

        <!-- Bloque derecho - Información del balance -->
        <div class="info-balance">
            <div class="titulo-balance"><?php echo $tituloDocumento; ?></div>
            <div class="detalle-info">Desde: <?php echo $fechaDesde; ?> - Hasta: <?php echo $fechaHasta; ?></div>
        </div>
    </div>

    <!-- Separador superior -->
    <hr class="separador-superior">

    <!-- Tabla de cuentas contables -->
    <table>
        <thead>
            <tr>
                <th class="text-center">Nivel</th>
                <th class="text-center">Transaccional</th>
                <th class="text-center">Código</th>
                <th>Nombre Cuenta Contable</th>
                <th class="text-right">Saldo Inicial</th>
                <th class="text-right">Mov. Débito</th>
                <th class="text-right">Mov. Crédito</th>
                <th class="text-right">Saldo Final</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($cuentas as $cuenta): ?>
                <tr>
                    <td class="text-center"><?php echo $cuenta['nivel']; ?></td>
                    <td class="text-center"><?php echo $cuenta['transaccional']; ?></td>
                    <td class="text-center"><?php echo $cuenta['codigo']; ?></td>
                    <td><?php echo str_repeat('&nbsp;', ($cuenta['nivel'] - 1) * 4) . $cuenta['nombre']; ?></td>
                    <td class="text-right"><?php echo number_format($cuenta['saldo_inicial'], 2); ?></td>
                    <td class="text-right"><?php echo number_format($cuenta['mov_debito'], 2); ?></td>
                    <td class="text-right"><?php echo number_format($cuenta['mov_credito'], 2); ?></td>
                    <td class="text-right"><?php echo number_format($cuenta['saldo_final'], 2); ?></td>
                </tr>
            <?php endforeach; ?>

            <!-- Totales -->
            <tr class="totales">
                <td colspan="4" class="text-right">TOTALES:</td>
                <td class="text-right"><?php echo number_format($totalSaldoInicial, 2); ?></td>
                <td class="text-right"><?php echo number_format($totalDebito, 2); ?></td>
                <td class="text-right"><?php echo number_format($totalCredito, 2); ?></td>
                <td class="text-right"><?php echo number_format($totalSaldoFinal, 2); ?></td>
            </tr>
        </tbody>
    </table>

    <!-- Separador inferior -->
    <hr class="separador-inferior">

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