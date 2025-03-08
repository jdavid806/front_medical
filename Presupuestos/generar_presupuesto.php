<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        EstimateForm
    } from './react-dist/estimates/EstimateForm.js';

    ReactDOMClient.createRoot(document.getElementById('estimate-form-content')).render(React.createElement(EstimateForm));
</script>

<div class="modal fade" id="modalCrearPresupuesto" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo presupuesto</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="estimate-form-content">
                </div>

            </div>
        </div>
    </div>
</div>
<div class="modal-footer">
    <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Guardar</button>
</div>
</div>
</div>
</div>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('descuento').addEventListener('input', function() {
            const precio = parseFloat(document.getElementById('precio').value);
            const cantidad = parseFloat(document.getElementById('cantidad').value);
            const descuentoInput = this.value.trim();
            const subtotalField = document.getElementById('subtotal');

            let descuento = 0;

            if (descuentoInput.endsWith('%')) {
                const porcentaje = parseFloat(descuentoInput.slice(0, -1));
                if (!isNaN(porcentaje)) {
                    descuento = (precio * cantidad * porcentaje) / 100;
                }
            } else {
                descuento = parseFloat(descuentoInput);
                if (isNaN(descuento)) {
                    descuento = 0;
                }
            }

            const subtotal = (precio * cantidad) - descuento;
            subtotalField.value = subtotal.toFixed(2);
        });

        document.getElementById('productForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const descripcion = document.getElementById('producto').value;
            const precio = parseFloat(document.getElementById('precio').value);
            const cantidad = parseFloat(document.getElementById('cantidad').value);
            const descuentoInput = document.getElementById('descuento').value.trim();

            let descuento = 0;
            if (descuentoInput.endsWith('%')) {
                const porcentaje = parseFloat(descuentoInput.slice(0, -1));
                if (!isNaN(porcentaje)) {
                    descuento = (precio * cantidad * porcentaje) / 100;
                }
            } else {
                descuento = parseFloat(descuentoInput);
                if (isNaN(descuento)) {
                    descuento = 0;
                }
            }

            const total = (precio * cantidad) - descuento;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
        <td>${descripcion}</td>
        <td>${precio.toFixed(3)} COP</td>
        <td>${cantidad}</td>
        <td>${descuento.toFixed(3)} COP</td>
        <td>${total.toFixed(3)} COP</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
    `;

            document.querySelector('#productTable tbody').appendChild(newRow);

            updateTotals(precio, cantidad, descuento, total);

            document.getElementById('productForm').reset();
        });
    });

    function removeRow(button) {
        const row = button.closest('tr');
        const precio = parseFloat(row.querySelector('td:nth-child(2)').textContent.replace(' COP', ''));
        const cantidad = parseFloat(row.querySelector('td:nth-child(3)').textContent);
        const descuento = parseFloat(row.querySelector('td:nth-child(4)').textContent.replace(' COP', ''));
        const total = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace(' COP', ''));

        row.remove();

        updateTotals(-precio, -cantidad, -descuento, -total);
    }

    function updateTotals(precio = 0, cantidad = 0, descuento = 0, total = 0) {
        const totalPrecioElement = document.getElementById('totalPrecio');
        const totalCantidadElement = document.getElementById('totalCantidad');
        const totalDescuentoElement = document.getElementById('totalDescuento');
        const totalSumElement = document.getElementById('totalSum');

        const currentPrecio = parseFloat(totalPrecioElement.textContent.replace(' COP', '')) || 0;
        const currentCantidad = parseFloat(totalCantidadElement.textContent) || 0;
        const currentDescuento = parseFloat(totalDescuentoElement.textContent.replace(' COP', '')) || 0;
        const currentTotal = parseFloat(totalSumElement.textContent.replace(' $ COP', '')) || 0;

        totalPrecioElement.textContent = (currentPrecio + precio).toFixed(3) + ' COP';
        totalCantidadElement.textContent = (currentCantidad + cantidad).toFixed(0);
        totalDescuentoElement.textContent = (currentDescuento + descuento).toFixed(3) + ' COP';
        totalSumElement.textContent = (currentTotal + total).toFixed(3) + ' $ COP';
    }
</script>