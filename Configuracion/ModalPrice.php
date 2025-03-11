<?php
include '../data/mocks.php';
include '../data/consts.php';
?>

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
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="sale_price">Precio público</label>
                                <input class="form-control" id="sale_price" type="number" placeholder="Precio público"
                                    name="sale_price" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label" for="copago">Precio Copago</label>
                                <input class="form-control" id="copago" type="number" placeholder="Precio Copago"
                                    name="copago" required>
                            </div>
                            <div class="col-6 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="toggleEntities">
                                <label class="form-check-label" for="toggleEntities">Agregar entidades</label>
                            </div>
                            <div class="col-6 form-check form-switch">
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
                                                onclick="agregarFilaPrecio()">Agregar</button>
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

    document.addEventListener("DOMContentLoaded", function () {
        cargarSelectsPrecios();
    });

    document.getElementById("toggleEntities").addEventListener("change", function () {
        document.getElementById("entity-productSection").style.display = this.checked ? "block" : "none";
    });

    document.getElementById("toggleImpuesto").addEventListener("change", function () {
        document.getElementById("taxSection").style.display = this.checked ? "block" : "none";
    });

    let preciosEntidades = [];

    function agregarFilaPrecio() {
        let entidadId = document.getElementById("entity-product").value;
        let entidadNombre = document.getElementById("entity-product").selectedOptions[0].text;

        let precio = document.getElementById("entity-product_price").value;

        let impuestoId = document.getElementById("tax_type").value;
        let impuestoNombre = document.getElementById("tax_type").selectedOptions[0]?.text || "N/A";

        let retencionId = document.getElementById("retention_type").value;
        let retencionNombre = document.getElementById("retention_type").selectedOptions[0]?.text || "N/A";

        // Guardar en el array para futuras referencias
        preciosEntidades.push({ entidadId, entidadNombre, precio, impuestoId, impuestoNombre, retencionId, retencionNombre });

        // Agregar fila a la tabla mostrando los nombres en lugar de los IDs
        let tabla = document.getElementById("tablaPreciosEntidades");
        let fila = `<tr>
                    <td>${entidadNombre}</td>
                    <td>${precio}</td>
                    <td>${impuestoNombre}</td>
                    <td>${retencionNombre}</td>
                    <td>
                        <button class='btn btn-danger btn-sm' onclick='eliminarFila(${preciosEntidades.length - 1})'>
                            Eliminar
                        </button>
                    </td>
                </tr>`;

        tabla.innerHTML += fila;

        // Limpiar los campos después de agregar la fila
        document.getElementById("entity-product_price").value = "";
        document.getElementById("tax_type").value = "";
        document.getElementById("retention_type").value = "";
    }


    function eliminarFila(index) {
        preciosEntidades.splice(index, 1);
        document.getElementById("tablaPreciosEntidades").deleteRow(index);
    }

    document.getElementById("createProductForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const productId = document.getElementById('product_id')?.value;
        let productData = {
            name: document.getElementById("name").value,
            barcode: document.getElementById("curp").value,
            attention_type: document.getElementById("attention_type").value,
            sale_price: document.getElementById("sale_price").value,
            copayment: document.getElementById("copago").value,
            tax_charge_id: document.getElementById("taxProduct_type").value,
        };

        // entities: preciosEntidades
        // Validación básica
        /* if (!productData.name || !productData.product_type_id) {
            alert('Nombre y tipo son campos obligatorios');
            return;
        } */

        try {
            console.log('Creando producto:', productData);
            if (productId) {
                updateProduct(productId, productData);
            } else {
                createProduct(productData);
            }

            // Limpiar formulario y cerrar modal
            document.getElementById("createProductForm").reset();
            $('#modalPrice').modal('hide');
            Swal.fire({
                icon: "success",
                title: "¡Guardado exitosamente!",
                text: "Los datos se han guardado correctamente.",
                timer: 2000,
                showConfirmButton: false,
            });
            cargarContenido();
        } catch (error) {
            alert('Error al crear el producto: ' + error.message);
        }
    });
</script>