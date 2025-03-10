<?php
include '../data/mocks.php';
include '../data/consts.php';

?>

<div class="modal fade modal-xl" id="modalPrice" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo Precio</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Tipo de producto</h5>
                        <label for="product_type_id" class="form-label">Tipo</label>
                        <select class="form-select" id="product_type_id" name="product_type_id">
                            <option value="" selected disabled>Seleccionar...</option>
                        </select>

                    </div>
                </div> -->

                <div class="card mt-4">
                    <div class="card-body">
                        <h5 class="card-title">Datos de producto</h5>
                        <form class="row g-3" id="createProductForm">
                            <div class="col-12 col-md-12" id="nameField">
                                <label class="form-label" for="name">Nombre del item</label>
                                <input class="form-control" id="name" type="text" placeholder="Nombre del item"
                                    name="name">
                            </div>
                            <div class="col-12 col-md-6" id="cupsField">
                                <label for="curp" class="form-label">Cups</label>
                                <input class="form-control" id="curp" type="text" placeholder="Codigo Cups" name="curp">
                            </div>
                            <div class="col-12 col-md-6" id="typeField">
                                <label for="attention_type" class="form-label">Tipo de atención</label>
                                <select class="form-select" id="attention_type" name="attention_type">
                                    <option value="" selected disabled>Seleccionar...</option>
                                    <option value="PROCEDURE">Procedimiento</option>
                                    <option value="CONSULTATION">Consulta</option>
                                </select>
                            </div>
                            <input type="hidden" id="product_type" name="product_type" value="">
                            <!-- <div class="col-12 col-md-6" id="barcodeField">
                                <label class="form-label" for="barcode">Código Cups</label>
                                <input class="form-control" id="barcode" type="text" placeholder="Código Cups" name="barcode">
                            </div> -->
                            <div class="col-12 col-md-6" id="salePriceField">
                                <label class="form-label" for="sale_price">Precio público</label>
                                <input class="form-control" id="sale_price" type="number" placeholder="Precio público"
                                    name="sale_price">
                            </div>
                            <div class="col-12 col-md-6" id="priceEntityField">
                                <label class="form-label" for="price_entity">Precio entidad</label>
                                <input class="form-control" id="price_entity" type="number" placeholder="Precio entidad"
                                    name="price_entity">
                            </div>

                            <!-- Botones dentro del formulario -->
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

<script type="module">
    import {
        productService,
        cupsService,
    } from './services/api/index.js';

    // Función para manejar la creación de productos
    async function createProduct(productData) {
        try {
            // console.log('Creando producto:', productData);
            const response = await productService.storeProduct(productData);
            // console.log('Producto creado:', response);
            return response;
        } catch (error) {
            console.error('Error creando producto:', error);
            throw error; // Propaga el error para manejo superior
        }
    }

    // Función para manejar el envío del formulario
    function handleProductForm() {

        const form = document.getElementById('createProductForm');

        if (!form) {
            console.warn('El formulario de creación no existe en el DOM');
            return;
        }

        form.addEventListener('submit', async (e) => {

            e.preventDefault();


            const productId = document.getElementById('product_id')?.value;
            const productData = {
                name: document.getElementById('name').value,
                // product_type_id: document.getElementById('product_type_id').value,
                // barcode: document.getElementById('barcode').value,
                barcode: document.getElementById('curp').value,
                attention_type: document.getElementById('attention_type').value,
                sale_price: parseFloat(document.getElementById('sale_price').value),
                price_entity: parseFloat(document.getElementById('price_entity').value)
            };

            // Validación básica
            /* if (!productData.name || !productData.product_type_id) {
                alert('Nombre y tipo son campos obligatorios');
                return;
            } */

            try {
                // console.log('Creando producto:', productData);
                if (productId) {
                    await updateProduct(productId, productData);
                } else {
                    await createProduct(productData);
                }

                // Limpiar formulario y cerrar modal
                form.reset();
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
    }



    // Función para inicializar el select con Choices.js
    // function initializeChoices() {
    //     const element = document.getElementById('organizerMultiple');

    //     // Verifica si Choices ya está inicializado
    //     if (!element.classList.contains('choices__input')) {
    //         const choices = new Choices(element, {
    //             removeItemButton: true,
    //             placeholder: true,
    //         });
    //     }
    // }

    // async function productTypes() {
    //     try {
    //         const response = await productService.getProductTypes(); // ya retorna JSON
    //         const products = response.data; // Debes acceder al array dentro de 'data'
    //         populateProductSelect(products);
    //     } catch (error) {
    //         console.error('Error al obtener los productos:', error);
    //     }
    // }


    // function populateProductSelect(products) {
    //     const productSelect = document.getElementById('product_type_id');
    //     if (Array.isArray(products)) { // Verifica si products es un array
    //         products.forEach(product => {
    //             console.log('product =>', product);
    //             const attributes = product.attributes; // Accede a los atributos del producto
    //             if (attributes && attributes.name) {
    //                 const option = document.createElement('option');
    //                 option.value = product.id;
    //                 option.textContent = attributes.name; // Accede al nombre del producto
    //                 // Si sale_price es necesario, asegúrate de que se incluya en la respuesta de la API
    //                 if (attributes.sale_price) {
    //                     option.setAttribute('data-price', attributes.sale_price); // Accede al precio de venta del producto
    //                 }
    //                 productSelect.appendChild(option);
    //             } else {
    //                 console.error('El producto o sus atributos son undefined:', product);
    //             }
    //         });
    //     } else {
    //         console.error('No se encontró un array de productos');
    //     }
    // }


    // async function cups() {
    //     try {
    //         const response = await cupsService.getCupsAll(); // ya retorna JSON
    //         const cups = response.data; // Debes acceder al array dentro de 'data'
    //         populateCupsSelect(cups);
    //     } catch (error) {
    //         console.error('Error al obtener los cups:', error);
    //     }
    // }

    // function populateCupsSelect(cups) {

    //     const cupsSelect = document.getElementById('curp');

    //     if (Array.isArray(cups)) { // Verifica si cups es un array
    //         cups.forEach(cup => {

    //             if (cup && cup.codigo && cup.descripcion) {
    //                 const option = document.createElement('option');
    //                 option.value = cup.codigo; // Asigna el valor del código
    //                 option.textContent = `${cup.nombre} - ${cup.descripcion}`; // Asigna el nombre y la descripción
    //                 cupsSelect.appendChild(option);
    //             } else {
    //                 console.error('El CUPS o sus atributos son undefined:', cup);
    //             }
    //         });
    //     } else {
    //         console.error('No se encontró un array de CUPS');
    //     }
    // }

    // Función para mostrar/ocultar campos según la opción seleccionada
    // function toggleFormFields() {
    //     const selectOptions = document.getElementById("product_type_id");
    //     const cupsField = document.getElementById("cupsField");
    //     const nameField = document.getElementById("nameField");
    //     const typeField = document.getElementById("typeField");
    //     const barcodeField = document.getElementById("barcodeField");
    //     const salePriceField = document.getElementById("salePriceField");
    //     const priceEntityField = document.getElementById("priceEntityField");

    //     function updateFields() {
    //         const selectedValue = selectOptions.value;

    //         // Ocultar todos los campos
    //         cupsField.style.display = "none";
    //         nameField.style.display = "none";
    //         typeField.style.display = "none";
    //         barcodeField.style.display = "none";
    //         salePriceField.style.display = "none";
    //         priceEntityField.style.display = "none";

    //         // Mostrar los campos según la opción seleccionada
    //         if (selectedValue === "1") {
    //             cupsField.style.display = "block";
    //             typeField.style.display = "block";
    //             barcodeField.style.display = "block";
    //             salePriceField.style.display = "block";
    //             priceEntityField.style.display = "block";
    //         } else if (selectedValue === "2") {
    //             nameField.style.display = "block";
    //             salePriceField.style.display = "block";
    //             priceEntityField.style.display = "block";
    //         }
    //     }

    //     // Ejecutar al cambiar la selección
    //     selectOptions.addEventListener("change", updateFields);

    //     // Ejecutar al cargar para ocultar/mostrar correctamente
    //     updateFields();
    // }


    // Inicialización en DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function () {
        // toggleFormFields(); // Llamar a la función para mostrar/ocultar los campos
        handleProductForm();
        // productTypes();
        //cups();
        // initializeChoices(); // Luego inicializar Choices.js
    });
</script>