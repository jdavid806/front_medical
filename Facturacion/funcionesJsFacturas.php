<?php
//  function obtenerProductos() {
//   include "../funciones/conn3.php";
//   $QueryProductos = mysqli_query($connMedical, "SELECT * FROM sinvetrios");
//   $datosSimuladosJson = array();

//   while ($producto = mysqli_fetch_assoc($QueryProductos)) {
//       $datosSimuladosJson[] = array(
//           'id' => $producto['ID'],
//           'nombre' => $producto['descripcion'],
//           'precio' => $producto['precio']
//       );
//   }

//   return json_encode($datosSimuladosJson);
// }

// $datosSimuladosJson = obtenerProductos();



?>
<script>
  // * /////////////// ======== ///////////////////////////
  // * //////// DETALLE DE FACTURA  ////////////////////////
  // * // (18 DE SEPTIEMBRE 07:18 PM DEIVYD => SI ESTO SE DESCOMENTA FUNCIONA PERFECTAMENTE, PERO SE DEBE QUITAR LO QUE YA SE HAYA CARGADO EN LA TABLA) //
  // * /////////////// ======== ///////////////////////////

  let indiceFila = 0;
  //let datosSimuladosJson = JSON.parse('<?= $dataJsonProcedimientos ?>');
  let datosSimuladosJson = JSON.parse('<?= $dataJsonFacturasAdmision ?>');
 



  let optionsProductos = `<option value=''>Seleccione producto</option>`;
  datosSimuladosJson.forEach(objeto => {
    options1Productos += `<option data-precio='${objeto.precio}' value='${objeto.id}'>${objeto.nombreProcedimiento}</option>`
  });



  function AnadirFila(modalId) {
    let btnDelete = indiceFila != 0 ? `<i class="fas fa-trash mt-2" onclick="EliminarFila(${indiceFila})"></i>` : ``;
    let nuevaFila = `<tr id="fila${indiceFila}">">
                          <td style="padding:10px !important">
                            <select class="underline-input optionProductos" onchange="insertarPrecio(${indiceFila})" name="Productos[${indiceFila}][idProducto]">
                          ${optionsProductos}
                            </select>
                          </td> 
                          <td style="padding:10px !important">
                            <input class="underline-input" type="number" onchange="calcularTotal(${indiceFila}, '${modalId}')" name="Productos[${indiceFila}][cantidad]">
                          </td> 
                          <td style="padding:10px !important">
                            <input class="underline-input" type="number" onchange="calcularTotal(${indiceFila}, '${modalId}')" name="Productos[${indiceFila}][valorUnitario]">
                          </td> 
                          <td style="padding:10px !important">
                            <input class="underline-input" type="text" onchange="calcularTotal(${indiceFila}, '${modalId}')" name="Productos[${indiceFila}][porcentajeDesc]" value="0">
                          </td> 
                          <td style="padding:10px !important">
                            <select onchange="calcularTotal(${indiceFila}, '${modalId}')" class="underline-input" name="Productos[${indiceFila}][impuestoCargo]">
                            ${obtenerOptionsImpuestoCargo()}
                            </select>
                          </td> 
                          <td style="padding:10px !important">
                            <select onchange="calcularTotal(${indiceFila}, '${modalId}')" class="underline-input" name="Productos[${indiceFila}][impuestoRetencion]">
                            ${obtenerOptionsImpuestoRetencion()}
                            </select>
                          </td> 
                          <td style="padding:10px !important">
                            <input readonly class="underline-input" type="number" name="Productos[${indiceFila}][total]">

                            <input readonly class="underline-input" type="hidden" value="0" name="Productos[${indiceFila}][totalDescuento]">
                            <input readonly class="underline-input" type="hidden" value="0" name="Productos[${indiceFila}][totalImpuestoCargo]">
                            <input readonly class="underline-input" type="hidden" value="0" name="Productos[${indiceFila}][totalImpuestoRetencion]">
                            <input readonly class="underline-input" type="hidden" value="0" name="Productos[${indiceFila}][totalBruto]">
                          </td> 
                          <td style="padding:10px !important">
                            ${btnDelete}
                          </td> 
                        </tr>`;
    
    // <option value='iva'>IVA %</option>
    // <option value='retefuente'>Retefuente %</option>
    console.log();
    $(`#${modalId} #tbody-modal-facturacion`).append(nuevaFila);
    indiceFila += 1;
  }

  function calcularTotal(indice, modalId) {
    // Obtener valores de los campos
    let cantidad = Number($(`#${modalId} input[name="Productos[${indice}][cantidad]"]`).val());
    let valorUnitario = Number($(`#${modalId} input[name="Productos[${indice}][valorUnitario]"]`).val());
    let descuento = $(`#${modalId} input[name="Productos[${indice}][porcentajeDesc]"]`).val().trim(); // Puede incluir %, número, o texto no válido
    let impuestoCargo = $(`#${modalId} select[name="Productos[${indice}][impuestoCargo]"]`).find('option:selected').data('tasaimpuesto'); 
    let impuestoRetencion = $(`#${modalId} select[name="Productos[${indice}][impuestoRetencion]"]`).find('option:selected').data('tasaretencion');

    console.log("impuestoCargo => " + impuestoCargo);
    console.log("impuestoRetencion => " + impuestoRetencion);
    

    let totalBruto = cantidad * valorUnitario; // Cálculo sin descuento
    let descuentoAplicado = 0; // Inicializar variable de descuento

    // Verificar si el valor del descuento incluye el símbolo '%'
    if (descuento.includes('%')) {
      // Extraer el número antes del '%' y calcular el descuento porcentual
      let porcentajeDesc = Number(descuento.replace('%', '').trim());
      if (!isNaN(porcentajeDesc)) {
        descuentoAplicado = (porcentajeDesc / 100) * totalBruto;
      } else {
        descuentoAplicado = 0; // Si no es un número válido, no se aplica descuento
      }
    } else if (!isNaN(Number(descuento)) && Number(descuento) >= 0) {
      // Si el descuento es un número, se trata como un descuento directo
      descuentoAplicado = Number(descuento);
      if (descuentoAplicado > totalBruto) {
        descuentoAplicado = totalBruto; // No puede ser mayor que el total bruto
      }
    } else {
      // Si no es ni porcentaje ni número válido, no se aplica descuento
      descuentoAplicado = 0;
    }


    // Calcular el total aplicando el descuento
    let total = totalBruto - descuentoAplicado;
    
    // impuestoCargo = Number(impuestoCargo.trim());
    // impuestoRetencion = Number(impuestoRetencion.trim());

    /// Añadir calculo con retenciones
    let totalImpuestoCargo = 0;
    if (impuestoCargo != 0 && impuestoCargo != '' && impuestoCargo !== undefined) {
      totalImpuestoCargo = total * (impuestoCargo / 100);
      total += totalImpuestoCargo;
    }

    let totalImpuestoRetencion = 0;
    if (impuestoRetencion != 0 && impuestoRetencion != '' && impuestoRetencion !== undefined) {
      totalImpuestoRetencion = total * (impuestoRetencion / 100);
      total += totalImpuestoRetencion;
    }
    // impuestoRetencion
    
    
    total = total.toFixed(2); // Limitar a 2 decimales

    // Asignar el valor total en el campo correspondiente
    $(`#${modalId} input[name="Productos[${indice}][total]"]`).val(total);
    
    //  OCULTOS
    $(`#${modalId} input[name="Productos[${indice}][totalBruto]"]`).val(totalBruto);
    $(`#${modalId} input[name="Productos[${indice}][totalImpuestoCargo]"]`).val(totalImpuestoCargo);
    $(`#${modalId} input[name="Productos[${indice}][totalImpuestoRetencion]"]`).val(totalImpuestoRetencion);
    $(`#${modalId} input[name="Productos[${indice}][totalDescuento]"]`).val(descuentoAplicado);

    // Llamar a la función totalNeto para recalcular el total general
    totalNeto(modalId);

    // Verificar si la siguiente fila de productos existe, y si no, añadir una nueva
    let siguienteCantidad = $(`#${modalId} input[name="Productos[${indice + 1}][cantidad]"]`).val();
    if ((siguienteCantidad == null || siguienteCantidad == undefined) && Number(total) > 0) {
      AnadirFila(modalId);
    }
  }


  // function calcularTotal(indice, modalId) {
  //   let cantidad = Number($(`#${modalId} input[name="Productos[${indice}][cantidad]"]`).val());
  //   let valorUnitario = Number($(`#${modalId} input[name="Productos[${indice}][valorUnitario]"]`).val());
  //   let porcentajeDesc = Number($(`#${modalId} input[name="Productos[${indice}][porcentajeDesc]"]`).val());

  //   let total = (cantidad * valorUnitario) - ((porcentajeDesc / 100) * (cantidad * valorUnitario));
  //   total = total.toFixed(2);
  //   $(`#${modalId} input[name="Productos[${indice}][total]"]`).val(total);
  //   totalNeto(modalId);

  //   let siguienteCantidad = $(`#${modalId} input[name="Productos[${indice + 1}][cantidad]"]`).val();
  //   if (siguienteCantidad == null || siguienteCantidad == undefined && Number(total) > 0) {
  //     AnadirFila(modalId);
  //   }
  // }

  function totalNeto(modalId) {
    let totalBruto = 0;
    let totalNeto = 0;
    let totalImpuestos = 0;
    let totalDescuento = 0;
    $(`#${modalId} #tbody-modal-facturacion tr`).each(function() {
      const fila = $(this);
      const id = fila.attr('id');
      let indiceFila = id.replace('fila', '');

      // * SUMANDO ...
      let totalFila = fila.find(`input[name*="Productos[${indiceFila}][total]"]`).val()
      totalNeto += Number(totalFila);

      let totalBrutoFila = fila.find(`input[name*="Productos[${indiceFila}][totalBruto]"]`).val()
      totalBruto += Number(totalBrutoFila);
      
      let totalImpuestoCFila = fila.find(`input[name*="Productos[${indiceFila}][totalImpuestoCargo]"]`).val()
      let totalImpuestoRFila = fila.find(`input[name*="Productos[${indiceFila}][totalImpuestoRetencion]"]`).val()
      totalImpuestos += Number(totalImpuestoCFila) + Number(totalImpuestoRFila);
      
      let totalDescuentoFila = fila.find(`input[name*="Productos[${indiceFila}][totalDescuento]"]`).val()
      totalDescuento += Number(totalDescuentoFila);


    });


    $("#" + modalId + " #total-neto-inner").html(totalNeto.toFixed(2));
    $("#" + modalId + " #total-neto").val(totalNeto);
    
    /// RESUMEN FINAL
    $("#" + modalId + " #modal-resumen-subtotal-facturado").html(totalBruto.toFixed(2));
    $("#" + modalId + " #modal-resumen-descuentos-facturado").html(totalDescuento.toFixed(2));
    $("#" + modalId + " #modal-resumen-impuestos-facturado").html(totalImpuestos.toFixed(2));
    $("#" + modalId + " #modal-resumen-total-neto").html(totalNeto.toFixed(2));
    
    $("#" + modalId + " #subTotal").val(totalBruto);
    $("#" + modalId + " #totalDescuentos").val(totalDescuento);
    $("#" + modalId + " #totalImpuestos").val(totalImpuestos);
    $("#" + modalId + " #totalNeto").val(totalNeto);
  }

  function EliminarFila(indice) {
    let fila = document.getElementById(`fila${indice}`);
    fila.remove();
  }

  function insertarPrecio(indice) {
    let precio = Number($(`select[name="Productos[${indice}][idProducto]"]`).find(":selected").data("precio"));
    $(`input[name="Productos[${indice}][valorUnitario]"]`).val(precio);
  }

  function guardarFacturaCliente(modalId) {
    let idS = ['tipoComprobante', 'clienteId', 'vendedorId', 'fechaElaboracion', 'fechaVencimiento', 'centroCosto'];
    let data = {};
    let next = true;
    idS.forEach(id => {
      if (!next) return;
      let value = $(`#${modalId} #${id}`).val();
      if (value == '') {
        next = false;
        return;
      }
      data[id] = value;
    });

    if (!next) {
      Swal.fire('Error', 'Por favor llene todos los campos', 'error');
      return
    }

    let continueCliente = true;
    let dataCliente = {};
    if (data.clienteId == '0') {
      let idsNuevoCliente = ["primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "tipoIdentificacion", "identificacion", "tipoPersona", "direccion", "numero_telefono", "email"];
      idsNuevoCliente.forEach(key => {
        if (!continueCliente) return;

        let value = $(`#datosAdicionalesCliente_${key}`).val();
        if (value == '') {
          continueCliente = false;
          return;
        }
        dataCliente[key] = value;
      });

    }

    if (!continueCliente) {
      Swal.fire('Error', 'Por favor llene todos los campos de cliente', 'error');
      return
    }

    let productos = [];
    next = true;
    $('#tbody-modal-facturacion tr').each(function() {
      if (!next) return;
      const fila = $(this);
      const id = fila.attr('id');
      let indiceFila = id.replace('fila', '');

      const producto = {
        idProducto: fila.find(`select[name*="Productos[${indiceFila}][idProducto]"]`).val(),
        cantidad: fila.find(`input[name*="Productos[${indiceFila}][cantidad]"]`).val(),
        valorUnitario: fila.find(`input[name*="Productos[${indiceFila}][valorUnitario]"]`).val(),
        porcentajeDesc: fila.find(`input[name*="Productos[${indiceFila}][porcentajeDesc]"]`).val(),
        impuestoCargo: fila.find(`select[name*="Productos[${indiceFila}][impuestoCargo]"]`).val(),
        impuestoRetencion: fila.find(`select[name*="Productos[${indiceFila}][impuestoRetencion]"]`).val(),
        total: fila.find(`input[name*="Productos[${indiceFila}][total]"]`).val()
      };

      // Agregar el producto al array si el idProducto no está vacío
      if (producto.idProducto) {
        let tieneCamposVacios = Object.values(producto).some(value => value === '' || value === null || value === undefined);
        // console.log("tieneCamposVacios => " + tieneCamposVacios);

        if (!tieneCamposVacios) {
          productos.push(producto);
        } else {
          Swal.fire('Error', 'Complete todos los campos en la seccion de productos', 'error');
          next = false;
          return;
        }
      }
    });

    let metodosPago = [];
    next = true;
    $('#tbody-modal-medios-pago tr').each(function() {
      if (!next) return;
      const fila = $(this);
      const id = fila.attr('id');
      let indiceFila = id.replace('fila', '');

      const metodoPago = {
        idMetodoPago: fila.find(`select[name*="MetodosPago[${indiceFila}][idMetodoPago]"]`).val(),
        valorPago: fila.find(`input[name*="MetodosPago[${indiceFila}][valorPago]"]`).val()
      };

      // Agregar el producto al array si el idProducto no está vacío
      if (metodoPago.idMetodoPago) {
        let tieneCamposVacios = Object.values(metodoPago).some(value => value === '' || value === null || value === undefined);

        if (!tieneCamposVacios) {
          metodosPago.push(producto);
        } else {
          Swal.fire('Error', 'Complete todos los campos en la seccion de metodos de pago', 'error');
          next = false;
          return;
        }
      }
    });


    data.detalle = productos;
    data.datosCliente = dataCliente;
  }

  // * /////////////// ======== ///////////////////////////
  // * //////// DETALLE DE FACTURA ////////////////////////
  // * /////////////// ======== ///////////////////////////
</script>