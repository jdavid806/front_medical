<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="homeInventario">Inventario</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Categorias</li>
                </ol>
            </nav>
            <div class="pb-9">

                <div id="categoriesProductsAppReact"></div>

            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        CategoriesApp
    } from './react-dist/inventory/categories/CategoriesApp.js';

    ReactDOMClient.createRoot(document.getElementById('categoriesProductsAppReact')).render(React.createElement(CategoriesApp));
</script>

<?php include "../footer.php";
?>