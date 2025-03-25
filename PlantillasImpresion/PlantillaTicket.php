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
    <div>
      Tel:
      <div>
        <?php echo $empresa_telefono; ?>
      </div>
    </div>
    <div>
      email:
      <div>
        <?php echo $empresa_correo; ?>
      </div>
    </div>

    <div class="receipt-divider"></div>

    <div class="fw-bold"><?php echo $tipo_factura; ?></div>
    <hr>
    <div><span class="fw-bold">Fecha impresión:</span>
      <div><?php echo $fecha_impresion; ?></div>
    </div>
    <div><span class="fw-bold">Fecha factura:</span>
      <div><?php echo $fecha_factura; ?></div>
    </div>
    <div><span class="fw-bold">Nro. Comprobante:</span>
      <div><?php echo $numero_comprobante; ?></div>
    </div>
    <?php if ($agregar_autorizacion): ?>
      <div><span class="fw-bold">Nro. Autorización:</span>
        <div><?php echo $numero_autorizacion; ?></div>
      </div>
      <div><span class="fw-bold">Fecha autorización:</span>
        <div><?php echo $fecha_autorizacion; ?></div>
      </div>
      <hr>
    <?php endif; ?>

    <div class="receipt-divider"></div>

    <div class="fw-bold">Datos del Paciente</div>
    <div>
      <span class="fw-bold">Nombre: </span>
      <div>
        <?php echo $paciente_nombre; ?>
      </div>
    </div>
    <div>
      <span class="fw-bold">Documento: </span>
      <div>
        <?php echo $paciente_documento; ?>
      </div>
    </div>
    <hr>
    <div class="receipt-divider"></div>

    <div class="fw-bold">Items Facturados</div>
    <div>
      <?php echo $detalles_ticket_html; ?>
    </div>

    <div class="receipt-divider"></div>

    <div class="d-flex">
      <span>Subtotal:</span>
      <span>$<?php echo number_format($subtotal, 2); ?></span>
    </div>
    <!-- <div class="d-flex">
      <span>IVA (10%):</span>
      <span>$<?php echo $iva; ?></span>
    </div> -->
    <div class="d-flex">
      <span>Descuento:</span>
      <span>-$<?php echo $descuento; ?></span>
    </div>
    <div class="d-flex fw-bold">
      <span>TOTAL:</span>
      <span>$<?php echo number_format($subtotal, 2); ?></span>
    </div>

    <hr>
    <div class="receipt-divider"></div>

    <div>
      <span class="fw-bold">Método de pago:: </span>
      <div>
        <?php echo $metodos_pago_html; ?>
      </div>
    </div>

    <div class="receipt-divider"></div>

    <div><?php echo $footer_mensaje; ?></div>
  </div>
</body>

</html>