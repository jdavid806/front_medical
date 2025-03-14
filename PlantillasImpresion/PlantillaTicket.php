<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo tipo ticket</title>
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
  </style>
</head>

<body>
  <div class="">
    <div class="fw-bold">FARMACIA DELIVERY</div>
    <div>Av. Principal 123, Ciudad</div>
    <div>Tel: +1 234 567 890</div>

    <div class="receipt-divider"></div>

    <div class="fw-bold">RECIBO DE ENTREGA</div>
    <div>Pedido: #12346</div>
    <div>Fecha: 27/02/2025 14:45</div>

    <div class="receipt-divider"></div>

    <div>Cliente: Sophia Anderson</div>
    <div>Tel: +1 888 8888 8888</div>

    <div class="receipt-divider"></div>

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

    <div>Método de pago: Tarjeta de crédito</div>
    <div>Atendido por: Carlos Méndez</div>

    <div class="barcode">
    </div>
  </div>
</body>

</html>