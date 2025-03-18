async function obtenerNombreMetodoPago(id) {
  try {
    let url = obtenerRutaPrincipal() + `/api/v1/admin/payment-methods/${id}`;
    let metodoPago = await fetch(url);
    let data = await metodoPago.json();
    return data.method || "Desconocido";
  } catch (error) {
    console.error("Error obteniendo método de pago:", error);
    return "Desconocido";
  }
}

async function obtenerNombreProducto(id) {
  try {
    let url = obtenerRutaPrincipal() + `/api/v1/admin/products/${id}`;
    let producto = await fetch(url);
    let data = await producto.json();
    return data.name || "Producto desconocido";
  } catch (error) {
    console.error("Error obteniendo nombre del producto:", error);
    return "Producto desconocido";
  }
}

async function generateInvoice(idCita, generarDescarga = false) {
  try {
    let url =
      obtenerRutaPrincipal() + `/medical/admissions/by-appointment/${idCita}`;
    let datosEmpresa = await consultarDatosEmpresa();

    // Obtener los datos desde la API
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.admission) {
      console.error("Datos no encontrados");
      return;
    }

    let factura = data.related_invoice[0];

    let datosFactura = {
      numero_comprobante: factura.invoice_code,
      numero_autorizacion: data.admission.authorization_number,
      fecha_autorizacion: factura.created_at,
      fecha_factura: factura.created_at,
      subtotal: factura.subtotal,
      iva: factura.iva,
      total: factura.total_amount,
      descuento: factura.discount,
    };

    let paciente = data.admission.patient;

    let nombre = [
      paciente.first_name,
      paciente.middle_name,
      paciente.last_name,
      paciente.second_last_name,
    ];

    let datosPaciente = {
      paciente_nombre: nombre,
      paciente_documento:
        paciente.document_type + "-" + paciente.document_number,
      paciente_direccion: paciente.address,
      paciente_telefono: paciente.whatsapp,
    };

    let metodosPago = await Promise.all(
      factura.payments.map(async (pago) => {
        const metodoNombre = await obtenerNombreMetodoPago(
          pago.payment_method_id
        );
        return {
          metodo: metodoNombre,
          fecha: pago.payment_date,
          monto: parseFloat(pago.amount),
          notas: pago.notes,
          referencia: pago.credit_card_or_check_number || "N/A",
          banco: pago.credit_card_or_bank || "N/A",
        };
      })
    );

    let totalPagado = metodosPago.reduce(
      (total, pago) => total + pago.monto,
      0
    );

    let detallesFactura = await Promise.all(
      factura.details.map(async (detalle) => {
        const productoNombre = await obtenerNombreProducto(detalle.product_id);
        return {
          producto: productoNombre,
          cantidad: detalle.quantity,
          precio_unitario: parseFloat(detalle.unit_price),
          subtotal: parseFloat(detalle.subtotal),
          descuento: parseFloat(detalle.discount),
          total: parseFloat(detalle.amount),
        };
      })
    );

    const payload = {
      empresa: datosEmpresa,
      factura: datosFactura,
      paciente: datosPaciente,
      metodos_pago: metodosPago,
      total_pagado: totalPagado.toFixed(2),
      detalles: detallesFactura,
      descargar: generarDescarga,
    };
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "../funciones/CrearTicketFactura.php";
    form.target = "_blank";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "data";
    input.value = JSON.stringify(payload);
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error general:", error);
  }
}

async function generarFacturaTemporal(idCita) {
  try {
    let url =
      obtenerRutaPrincipal() + `/medical/admissions/by-appointment/${idCita}`;
    let datosEmpresa = await consultarDatosEmpresa();

    // Obtener los datos desde la API
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.admission) {
      console.error("Datos no encontrados");
      return;
    }

    let factura = data.related_invoice[0];

    let datosFactura = {
      numero_comprobante: factura.invoice_code,
      numero_autorizacion: data.admission.authorization_number,
      fecha_autorizacion: factura.created_at,
      fecha_factura: factura.created_at,
      subtotal: factura.subtotal,
      iva: factura.iva,
      total: factura.total_amount,
      descuento: factura.discount,
    };

    let paciente = data.admission.patient;

    let nombre = [
      paciente.first_name,
      paciente.middle_name,
      paciente.last_name,
      paciente.second_last_name,
    ];

    let datosPaciente = {
      paciente_nombre: nombre.join(" "),
      paciente_documento:
        paciente.document_type + "-" + paciente.document_number,
      paciente_direccion: paciente.address,
      paciente_telefono: paciente.whatsapp,
    };

    let metodosPago = await Promise.all(
      factura.payments.map(async (pago) => {
        const metodoNombre = await obtenerNombreMetodoPago(
          pago.payment_method_id
        );
        return {
          metodo: metodoNombre,
          fecha: pago.payment_date,
          monto: parseFloat(pago.amount),
          notas: pago.notes,
          referencia: pago.credit_card_or_check_number || "N/A",
          banco: pago.credit_card_or_bank || "N/A",
        };
      })
    );

    let totalPagado = metodosPago.reduce(
      (total, pago) => total + pago.monto,
      0
    );

    let detallesFactura = await Promise.all(
      factura.details.map(async (detalle) => {
        const productoNombre = await obtenerNombreProducto(detalle.product_id);
        return {
          producto: productoNombre,
          cantidad: detalle.quantity,
          precio_unitario: parseFloat(detalle.unit_price),
          subtotal: parseFloat(detalle.subtotal),
          descuento: parseFloat(detalle.discount),
          total: parseFloat(detalle.amount),
        };
      })
    );

    const payload = {
      empresa: datosEmpresa,
      factura: datosFactura,
      paciente: datosPaciente,
      metodos_pago: metodosPago,
      total_pagado: totalPagado.toFixed(2),
      detalles: detallesFactura,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    let responseDoc = await fetch("../funciones/CrearTicketTemporal.php", {
      method: "POST",
      body: formData,
    });
    let resultado = await responseDoc.json();

    if (resultado.ruta) {
      return resultado.ruta;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error general:", error);
  }
}

async function obtenerFacturaIdByCitaId(id) {
  try {
    let url =
      obtenerRutaPrincipal() + `/medical/admissions/by-appointment/${id}`;
    let datosEmpresa = await consultarDatosEmpresa();

    // Obtener los datos desde la API
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.admission) {
      console.error("Datos no encontrados");
      return;
    }

    return data.related_invoice[0].id;
  } catch (error) {
    console.error("Error general:", error);
  }
}
