<?php
include "../header.php";
?>
<!-- ===============================================-->
<!--    Content-->
<!-- ===============================================-->
<div class="container-xxl d-flex flex-column justify-content-center p-3 mx-auto position-relative" style="min-height: 80vh;">
    <div class="row align-items-center">
        <div class="col-md-6 order-md-2">
            <img src="<?= $BASE ?>assets/img/illustrations/401.svg" alt="" class="img-fluid mb-6 mb-md-0">
        </div>
        <div class="col-md-6 order-md-1">
            <h1 class="display-4 fw-semi-bold lh-sm mb-4">Acceso denegado</h1>
            <p class="mb-6 fs-lg">
                Lo sentimos, no tienes permiso para acceder a esta página. Si crees que esto es un error,
                por favor, contacta con el administrador del sistema.
            </p>
            <a href="javascript:history.back()" class="btn btn-primary">
                Volver a atrás
            </a>
        </div>
    </div>
</div>
<?php
include "../footer.php";
