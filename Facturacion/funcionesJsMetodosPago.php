<script> 
      // * /////////////// ======== ///////////////////////////
  // * /////////// METODOS DE PAGO [INICIO] ////////////////////////
  // * /////////////// ======== ///////////////////////////

  function AnadirFilaMetodos(modalId) {
    let botonDelete = Number(indiceFilaMP) > 0 ? `<i class="fas fa-trash mt-2"  onclick="EliminarFilaMetodos(${indiceFilaMP}, '${modalId}')"></i>` : '';
    let nuevaFila = `<tr id="filaMP${indiceFilaMP}">
                      <td style="padding:10px !important;">
                        <select class="underline-input" name="MetodosPago[${indiceFilaMP}][idMetodoPago]" onchange="calcularTotalMetodos('${modalId}');validarMetodoPagoEfectivo('${modalId}', ${indiceFilaMP}, this.value);">
                          ${optionsMetodosPago}
                        </select>
                      </td> 
                      <td style="padding:10px !important;">
                        <input class="underline-input" onchange="validarNuevaFila(${indiceFilaMP}, this.value, '${modalId}'); calcularTotalMetodos('${modalId}');" type="number" name="MetodosPago[${indiceFilaMP}][valorPago]">
                      </td> 
                      <td style="padding:10px !important;">
                        <input class="underline-input" type="text" value="0" name="MetodosPago[${indiceFilaMP}][numeroComprobante]">
                      </td> 
                      <td style="padding:10px !important;">
                        ${botonDelete}
                      </td> 
                    </tr>`;

    $(`#${modalId} #tbody-modal-medios-pago`).append(nuevaFila);
    indiceFilaMP += 1;
  }

  function validarMetodoPagoEfectivo(modalId, indice, metodoPago) {
    if (metodoPago == '1') { /// SOLO SUCEDE EN EL CASO DE QUE SEA EFECTIVO
      $(`#${modalId} input[name="MetodosPago[${indice}][numeroComprobante]"]`).val("0").attr("disabled", true);
    }else{
      $(`#${modalId} input[name="MetodosPago[${indice}][numeroComprobante]"]`).attr("disabled", false);
    }
  }


  function calcularTotalMetodos(modalId) {
    let totalMetodosPago = 0;
    $(`#${modalId} #tbody-modal-medios-pago tr`).each(function() {
      let indice = $(this).attr("id").replace("filaMP", "");
      let valor = $(`#${modalId} input[name="MetodosPago[${indice}][valorPago]"]`).val();
      totalMetodosPago += Number(valor);
    });

    // totalMetodosPago = totalMetodosPago.toFixed(2); // Limitar a 2 decimales

    $(`#${modalId} #modal-resumen-total-pagado`).html(totalMetodosPago.toFixed(2));
    $(`#${modalId} #total-pagado`).val(totalMetodosPago);

  }

  function validarNuevaFila(indice, valor, modalId) {
    if (Number(valor) <= 0) return;
    let siguienteFila = $(`#${modalId} input[name="MetodosPago[${indice + 1}][valorPago]"]`).val(); // Cambié el nombre aquí
    console.log("Elemento de siguiente fila");
    console.log($(`#${modalId} input[name="MetodosPago[${indice + 1}][valorPago]"]`));
    console.log("Valor");
    console.log($(`#${modalId} input[name="MetodosPago[${indice + 1}][valorPago]"]`).val());
    console.log("Literal");
    console.log(`#${modalId} input[name="MetodosPago[${indice + 1}][valorPago]"]`);
    

    // Corrección de la lógica
    if (siguienteFila == null || siguienteFila === undefined && Number(siguienteFila) <= 0) {
      AnadirFilaMetodos(modalId);
    }

  }

  function EliminarFilaMetodos(indice, modalId) {
    let fila = document.getElementById(`filaMP${indice}`);
    fila.remove();
    calcularTotalMetodos(modalId);
  }

  // * /////////////// ======== ///////////////////////////
  // * /////////// METODOS DE PAGO [FIN] ////////////////////////
  // * /////////////// ======== ///////////////////////////
</script>