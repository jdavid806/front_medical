<div class="modal fade modal-xl" id="modalPrice" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Precio</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Datos de producto</h5>
                        <form class="row g-3" id="createProductForm">
                            <input type="hidden" id="product_id" name="product_id">
                            <div class="col-12">
                                <label class="form-label" for="name">Nombre del item</label>
                                <input class="form-control" id="name" type="text" placeholder="Nombre del item"
                                    name="name" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="curp">Cups</label>
                                <input class="form-control" id="curp" type="text" placeholder="Código Cups" name="curp"
                                    required>
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="attention_type">Tipo de atención</label>
                                <select class="form-select" id="attention_type" name="attention_type" required>
                                    <option value="" disabled selected>Seleccionar...</option>
                                    <option value="PROCEDURE">Procedimiento</option>
                                    <option value="CONSULTATION">Consulta</option>
                                    <option value="LABORATORY">Laboratorio</option>
                                    <option value="REHABILITATION">Rehabilitación</option>
                                    <option value="OPTOMETRY">Optometría</option>
                                </select>
                            </div>
                            <div class="col-12" style="display: none;" id="examTypeSection">
                                <label class="form-label" for="exam_type_id">Examen</label>
                                <select class="form-select" id="exam_type_id" name="exam_type_id">
                                    <option value="" disabled selected>Seleccionar...</option>
                                </select>
                            </div>
                            <div class="col-6" id="priceSection">
                                <label class="form-label" for="sale_price">Precio público</label>
                                <input class="form-control" id="sale_price" type="number" placeholder="Precio público"
                                    name="sale_price">
                            </div>
                            <div class="col-6" id="copagoSection">
                                <label class="form-label" for="copago">Precio Copago</label>
                                <input class="form-control" id="copago" type="number" placeholder="Precio Copago"
                                    name="copago">
                            </div>
                            <div class="col-12" id="purchasePriceSection">
                                <label class="form-label" for="purchase_price">Costo</label>
                                <input class="form-control" id="purchase_price" type="number" placeholder="Costo"
                                    name="purchase_price">
                            </div>
                            <div class="col-6 form-check form-switch" id="toggleEntitiesSection">
                                <input class="form-check-input" type="checkbox" id="toggleEntities">
                                <label class="form-check-label" for="toggleEntities">Agregar entidades</label>
                            </div>
                            <div class="col-6 form-check form-switch" id="toggleImpuestoSection">
                                <input class="form-check-input" type="checkbox" id="toggleImpuesto">
                                <label class="form-check-label" for="toggleImpuesto">Agregar Impuesto</label>
                            </div>
                            <div id="taxSection" class="col-12" style="display: none;">
                                <div class="col-md-12">
                                    <label class="form-label" for="taxProduct_type">Tipo de impuesto</label>
                                    <select class="form-select" id="taxProduct_type" name="tax_type">
                                        <option value="" disabled selected>Seleccionar...</option>
                                    </select>
                                </div>
                            </div>
                            <div id="entity-productSection" class="col-12" style="display: none;">
                                <div class="card p-3 mt-3">
                                    <div class="row g-3">
                                        <div class="col-md-4">
                                            <label class="form-label" for="entity-product">Entidad</label>
                                            <select class="form-select" id="entity-product" name="entity-product">
                                                <option value="" disabled selected>Seleccionar...</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label" for="entity-product_price">Precio</label>
                                            <input class="form-control" id="entity-product_price" type="number"
                                                placeholder="Precio" name="entity-product_price">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label" for="tax_type">Tipo de impuesto</label>
                                            <select class="form-select" id="tax_type" name="tax_type">
                                                <option value="" disabled selected>Seleccionar...</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label" for="retention_type">Tipo de retención</label>
                                            <select class="form-select" id="retention_type" name="retention_type">
                                                <option value="" disabled selected>Seleccionar...</option>
                                            </select>
                                        </div>
                                        <div class="col-12 text-end">
                                            <button class="btn btn-primary" type="button"
                                                onclick="agregarFilaEntidad()">Agregar</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card p-3 mt-3">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Entidad</th>
                                                <th>Precio</th>
                                                <th>Tipo Impuesto</th>
                                                <th>Tipo Retención</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody id="tablaPreciosEntidades"></tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-primary" type="submit">Guardar</button>
                                <button class="btn btn-outline-primary" type="button"
                                    data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        cargarSelectsPrecios();
        const examTypeSection = document.getElementById("examTypeSection");
        document.getElementById("attention_type").addEventListener("change", function() {
            if (this.value === "PROCEDURE") {
                examTypeSection.style.display = "block";
            } else {
                examTypeSection.style.display = "none";
            }

            if (this.value === "LABORATORY") {
                document.getElementById("priceSection").style.display = "none";
                document.getElementById("copagoSection").style.display = "none";
                document.getElementById("purchasePriceSection").style.display = "none";
                document.getElementById("toggleEntitiesSection").style.display = "none";
                document.getElementById("toggleImpuestoSection").style.display = "none";
            } else {
                document.getElementById("priceSection").style.display = "block";
                document.getElementById("copagoSection").style.display = "block";
                document.getElementById("purchasePriceSection").style.display = "block";
                document.getElementById("toggleEntitiesSection").style.display = "block";
                document.getElementById("toggleImpuestoSection").style.display = "block";
            }
        });
    });

    document.getElementById("toggleEntities").addEventListener("change", function() {
        document.getElementById("entity-productSection").style.display = this.checked ? "block" : "none";
    });

    document.getElementById("toggleImpuesto").addEventListener("change", function() {
        document.getElementById("taxSection").style.display = this.checked ? "block" : "none";
    });

    document.getElementById("createProductForm").addEventListener("submit", async function(e) {
        e.preventDefault();

        const productId = document.getElementById('product_id')?.value;
        const attentionType = document.getElementById('attention_type').value;
        const salePrice = attentionType === 'LABORATORY' ? 0 : document.getElementById('sale_price').value || 0;
        const copayment = attentionType === 'LABORATORY' ? 0 : document.getElementById('copago').value || 0;

        let productData = {
            product: {
                name: document.getElementById("name").value,
                barcode: document.getElementById("curp").value,
                attention_type: attentionType,
                sale_price: salePrice,
                copayment: copayment,
                tax_charge_id: document.getElementById("taxProduct_type").value,
                exam_type_id: document.getElementById("exam_type_id").value,
                purchase_price: document.getElementById("purchase_price").value || 0,
            },
            entities: preciosEntidades
        };


        // Validación básica
        /* if (!productData.name || !productData.product_type_id) {
            alert('Nombre y tipo son campos obligatorios');
            return;
        } */

        try {
            if (productId) {
                updateProduct(productId, productData);
            } else {
                await createProduct(productData);
            }

            // Limpiar formulario y cerrar modal
            document.getElementById("createProductForm").reset();
            $('#modalPrice').modal('hide');
            cargarContenido();
        } catch (error) {
            console.log(error);
        }
    });
</script>