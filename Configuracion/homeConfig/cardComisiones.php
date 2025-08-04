<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="configUsuarios">Usuarios</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Comisiones</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <?php include "../tabs/tab_commissionsConfiguration.php";?>
            </div>
        </div>
    </div>
</div>

<?php
include "../../footer.php";
?>