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
  </style>
</head>

<body>
  <div class="receipt-container">
    <div class="fw-bold"> <?php echo $empresa_nombre; ?> </div>
    <div> <?php echo $empresa_direccion; ?> </div>
    <div>Tel: <?php echo $empresa_telefono; ?> </div>

    <div class="receipt-divider"></div>

    <div class="fw-bold">RECIBO DE CAJA</div>
    <div>Fecha impresión: <?php echo $fecha_impresion; ?> </div>
    <div>Fecha factura: <?php echo $fecha_factura; ?> </div>
    <div>Nro. Comprobante: <?php echo $numero_comprobante; ?> </div>
    <div>Autorización: <?php echo $numero_autorizacion; ?> </div>
    <div>Fecha autorización: <?php echo $fecha_autorizacion; ?> </div>

    <div class="receipt-divider"></div>

    <div class="fw-bold">Datos del Paciente</div>
    <div>Nombre: <?php echo $paciente_nombre; ?> </div>
    <div>Documento: <?php echo $paciente_documento; ?> </div>

    <div class="receipt-divider"></div>

    <div class="fw-bold">Items Facturados</div>
    <?php foreach ($related_invoice['details'] as $item): ?>
      <div class="d-flex">
        <span><?php echo $item['quantity'] . 'x ' . $item['amount']; ?></span>
        <span>$<?php echo $item['unit_price']; ?></span>
      </div>
    <?php endforeach; ?>

    <div class="receipt-divider"></div>

    <div class="d-flex">
      <span>Subtotal:</span>
      <span>$<?php echo $subtotal; ?></span>
    </div>
    <div class="d-flex">
      <span>IVA (10%):</span>
      <span>$<?php echo $iva; ?></span>
    </div>
    <div class="d-flex">
      <span>Descuento:</span>
      <span>-$<?php echo $descuento; ?></span>
    </div>
    <div class="d-flex fw-bold">
      <span>TOTAL:</span>
      <span>$<?php echo $total; ?></span>
    </div>

    <div class="receipt-divider"></div>

    <div>Método de pago: <?php echo $pago_metodo; ?></div>
    <div>Pago: $<?php echo $pago_monto; ?></div>

    <div class="receipt-divider"></div>

    <div><?php echo $footer_mensaje; ?></div>
  </div>
</body>

</html>