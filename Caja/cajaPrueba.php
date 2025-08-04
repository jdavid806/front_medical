<?php
include "../menu.php";
include "../header.php";
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="/Caja/assets/css/styleCaja.css">
</head>

<body class="mt-5">
    <!-- Main Content -->
    <div class="container-fluid mt-5">
        <div class="row">
            <!-- Products Section -->
            <div class="col-md-8 col-lg-9 mt-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">Punto de Venta</h4>
                    <div class="position-relative" style="width: 250px;">
                        <input type="text" id="searchInput" class="form-control ps-4" placeholder="Buscar productos...">
                        <i class="fas fa-search position-absolute" style="top: 10px; left: 10px; color: #adb5bd;"></i>
                    </div>
                </div>

                <!-- Categories -->
                <div class="category-container mb-4">
                    <div class="d-flex gap-2" id="category-buttons">
                        <button class="btn btn-success category-btn" data-category="Todos">Todos</button>
                    </div>
                </div>


                <!-- Products Grid -->
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3" id="productsContainer">

                </div>
            </div>

            <!-- Cart Section -->
            <div class="col-md-4 col-lg-3">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">
                            <i class="fas fa-shopping-cart me-2"></i>
                            Carrito de Compra
                        </h5>
                    </div>
                    <div class="cart-container">
                        <!-- Mensaje de carrito vacío (fuera del contenedor que se limpia) -->
                        <div class="cart-empty" id="emptyCart">
                            <i class="fas fa-shopping-cart mb-2" style="font-size: 48px;"></i>
                            <p>El carrito está vacío</p>
                        </div>

                        <!-- Aquí se renderizan los productos del carrito -->
                        <div class="cart-items" id="cartItems"></div>
                    </div>

                    <div class="cart-summary">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Subtotal:</span>
                                <span id="subtotal">$0.00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted d-flex align-items-center">
                                    Descuento:
                                    <button class="btn btn-sm text-success p-0 ms-1" id="discountBtn">
                                        <i class="fas fa-percent"></i>
                                    </button>
                                </span>
                                <span class="text-danger" id="discount">-$0.00</span>
                            </div>
                            <div class="d-flex justify-content-between pt-2 border-top">
                                <span class="fw-bold">Total:</span>
                                <span class="fw-bold text-success" id="total">$0.00</span>
                            </div>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-between">
                            <button class="btn btn-outline-secondary" id="cancelBtn">Cancelar</button>
                            <button class="btn btn-success" id="payBtn" disabled>Pagar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>

</body>

</html>

<?php
include "../Caja/includes/modals/paymentModal.php";
?>
<?php
include "../footer.php";

?>
<script src="./Caja/js/main.js" type="module"></script>