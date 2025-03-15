<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo de Caja</title>
  <style>
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 0;
      background-color: #fff;
    }

    .receipt-container {
      width: 58mm;
      padding: 5px;
      border: 1px dashed #ccc;
      text-align: center;
      box-sizing: border-box;
    }

    .fw-bold {
      font-weight: bold;
    }

    .receipt-divider {
      border-top: 1px dashed #ccc;
      margin: 5px 0;
    }

    .d-flex {
      display: flex;
      justify-content: space-between;
    }

    .small {
      font-size: 0.8em;
      color: #555;
    }

    .barcode img {
      width: 100%;
    }

    .logo img {
      width: 50px;
      margin-bottom: 5px;
    }
  </style>
</head>

<body>
  <div class="receipt-container">
    <!-- Logo y datos de la empresa -->
    <div class="logo"><img src="logo.png" alt="Logo Empresa"></div>
    <div class="fw-bold">FARMACIA DELIVERY</div>
    <div>Av. Principal 123, Ciudad</div>
    <div>Tel: +1 234 567 890</div>

    <div class="receipt-divider"></div>

    <!-- Datos del paciente -->
    <div>Cliente: Sophia Anderson</div>
    <div>Tel: +1 888 8888 8888</div>

    <div class="receipt-divider"></div>

    <!-- Título de recibo -->
    <div class="fw-bold">RECIBO DE CAJA</div>
    <div>Fecha impresión: 27/02/2025 14:45</div>
    <div>Fecha factura: 27/02/2025 14:40</div>
    <div>Comprobante: #12346</div>
    <div>Autorización: 987654321</div>
    <div>Fecha autorización: 27/02/2025 14:35</div>

    <div class="receipt-divider"></div>

    <!-- Ítems a facturar -->
    <div class="d-flex">
      <span>Amoxicilina 500mg</span>
      <span>$12.99</span>
    </div>
    <div class="small">1 caja x $12.99</div>

    <div class="d-flex">
      <span>Loratadina 10mg</span>
      <span>$17.50</span>
    </div>
    <div class="small">2 cajas x $8.75</div>

    <div class="d-flex">
      <span>Omeprazol 20mg</span>
      <span>$9.25</span>
    </div>
    <div class="small">1 caja x $9.25</div>

    <div class="receipt-divider"></div>

    <!-- Totales -->
    <div class="d-flex">
      <span>Subtotal:</span>
      <span>$39.74</span>
    </div>
    <div class="d-flex">
      <span>Impuestos (10%):</span>
      <span>$3.97</span>
    </div>
    <div class="d-flex">
      <span>Descuento:</span>
      <span>-$5.00</span>
    </div>
    <div class="d-flex fw-bold">
      <span>TOTAL:</span>
      <span>$38.71</span>
    </div>

    <div class="receipt-divider"></div>

    <!-- Métodos de pago -->
    <div>Método de pago: Tarjeta de crédito</div>
    <div>Pago recibido: $38.71</div>
    <div>Vuelto: $0.00</div>

    <div class="receipt-divider"></div>

    <!-- Mensaje de agradecimiento -->
    <div>¡Gracias por su compra!</div>
    <div>Para dudas o reclamos: soporte@farmacia.com</div>

    <div class="barcode">
      <img src="barcode.png" alt="Código de barras">
    </div>
  </div>
</body>

</html>