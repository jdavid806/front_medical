<?php
include "../../menu.php";
include "../../header.php";
?>
<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .content{
        padding: calc(var(--phoenix-navbar-top-height) + 0.4rem) 1.5rem 6.375rem 1.5rem;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="configUsuarios">Usuarios</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Horarios</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <?php include "../includes/userAvailabilities.php";?>
            </div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>