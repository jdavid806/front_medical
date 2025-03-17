<div class="modal fade modal-xl" id="modalNotaDebito" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Realizar nota débito</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="card">
                    <div class=" card-body">
                        <h5 class="card-title">Información de factura</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="numeroFactura"># Factura</label>
                                <input class="form-control" type="text" name="numeroFactura" id="numeroFactura" value="100929919" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="fechaFactura">Fecha</label>
                                <input class="form-control" type="date" name="fechaFactura" id="fechaFactura" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="tipoFactura">Cliente/Entidad</label>
                                <input class="form-control" type="text" name="tipoFactura" id="tipoFactura" value="Cliente 1" disabled>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="valorFactura">Valor</label>
                                <input class="form-control" type="text" name="valorFactura" id="valorFactura" value="2109172" disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class=" card-body">
                        <h5 class="card-title">Información nota débito</h5>
                        <div class="row g-3 mb-3">
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="montoNotaDebito">Monto nota débito</label>
                                <input class="form-control" type="number" name="montoNotaDebito" id="montoNotaDebito" required>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="motivoNota">Motivo</label>
                                <input class="form-control" type="text" name="motivoNota" id="motivoNota" required>
                            </div>
                            <div class="col-6 mb-2">
                                <label class="form-label text-body" for="totalFactura">Total</label>
                                <input class="form-control" type="text" name="totalFactura" id="totalFactura" disabled>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="enviar" type="button">Enviar</button>
            </div>
        </div>
    </div>
</div>

<script>
   function calcularTotalND(valorFacturaND, montoNotaDebito){
    const valorFacturaNumND = parseFloat(valorFacturaND) || 0;
    const montoNotaDebitoNum = parseFloat(montoNotaDebito) || 0;

    const totalFacturaND = valorFacturaNumND + montoNotaDebitoNum;

    return totalFacturaND;
   }

   document.addEventListener('DOMContentLoaded',function(){
    const inputValorFacturaND = document.getElementById('valorFactura');
    const inputMontoNotaDebitoND = document.getElementById('montoNotaDebito');
    const inputTotalFacturaND = document.getElementById('totalFactura');

    function actualizarTotalND() {
        const valorFacturaND = inputValorFacturaND.value;
        const montoNotaDebito = inputMontoNotaDebitoND.value;
         
        const total = calcularTotalND(valorFacturaND, montoNotaDebito);
        inputTotalFacturaND.value = total.toFixed(2);
    }

    inputValorFacturaND.addEventListener('input', actualizarTotalND);
    inputMontoNotaDebitoND.addEventListener('input', actualizarTotalND);
    inputMontoNotaDebitoND.addEventListener('change', actualizarTotalND);

   })
</script>