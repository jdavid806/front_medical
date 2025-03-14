<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Factura #0001</title>
  <style>
    body {
      font-family: "Segoe UI", sans-serif;
      margin: 1.3cm;
      color: #444;
      position: relative;
    }

    .marca-agua {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.2;
      z-index: -1;
    }

    .marca-agua img {
      max-width: 400px;
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      max-height: 100px;
    }

    .header-table .info-medica {
      border-left: 4px solid #132030;
      padding-left: 12px;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .header-table td {
      padding: 10px 20px;
    }

    .table-datos-paciente {
      width: 100%;
      border-collapse: collapse;
      border-left: 4px solid #132030;
      margin-top: 15px;
    }

    .table-datos-paciente td {
      border-bottom: 1px solid #EAEAEA;
      padding: 10px;
    }

    .contenido {
      border-left: 4px solid #132030;
      padding-left: 15px;
      padding-right: 15px;
      margin-top: 15px;
    }

    .contenido h6 {
      margin-top: 0;
      margin-bottom: 10px;
    }

    .firma img {
      max-height: 90px;
    }

    .firma-linea {
      border-top: 1px solid #aaa;
      margin: 10px 0;
    }

    @page {
      size: A4;
      margin: 1.3cm;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">
      <img src="#" alt="Logo Empresa">
    </div>
    <div class="marca-agua">
      <img src="#" alt="Marca de Agua">
    </div>
    <table class="header-table" width="100%">
      <tr>
        <td class="info-medica">
          <h6>Datos de la Empresa</h6>
          <p><strong>Nombre:</strong> HOY Prueba</p>
          <p><strong>NIT:</strong> 10027319-8</p>
          <p><strong>Dirección:</strong> -</p>
        </td>
        <td>
          <h6>Datos del Cliente</h6>
          <p><strong>Nombre:</strong> <span data-field="fullName"></span></p>
          <p><strong>Cédula:</strong> <span data-field="document"></span></p>
          <p><strong>Ciudad:</strong> <span data-field="city"></span></p>
        </td>
      </tr>
    </table>
    <div class="contenido">
      <h6>Previsualización</h6>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Descripción</th>
            <th class="text-end">Cantidad</th>
            <th class="text-end">Precio</th>
            <th class="text-end">Descuento</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody id="summaryProductsTableBody"></tbody>
      </table>
      <div class="row">
        <div class="col-50">
          <h6>Métodos de Pago</h6>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Método</th>
                <th class="text-end">Monto</th>
              </tr>
            </thead>
            <tbody id="summaryPaymentsTableBody"></tbody>
          </table>
        </div>
        <div class="col-50">
          <h6>Resumen</h6>
          <table>
            <tbody>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td class="text-end" data-field="subtotal"></td>
              </tr>
              <tr>
                <td><strong>Total a Pagar:</strong></td>
                <td class="text-end fw-bold" data-field="total"></td>
              </tr>
              <tr>
                <td><strong>Pagado:</strong></td>
                <td class="text-end" data-field="paid"></td>
              </tr>
              <tr>
                <td><strong class="text-danger">Saldo:</strong></td>
                <td class="text-end text-danger" data-field="balance"></td>
              </tr>
              <tr>
                <td><strong>Total Factura:</strong></td>
                <td class="text-end fw-bold" data-field="total_invoice"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h6>Comentarios:</h6>
      <div class="comments">
        xxxxxxxxxxxxxxxxxxxxxxxxx
      </div>
    </div>
  </div>
</body>

</html>