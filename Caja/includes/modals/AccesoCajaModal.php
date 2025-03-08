<div class="modal fade" id="myModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Balance inicial de caja</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Input de contraseña -->
                <div id="passwordInputContainer">
                    <div class="mb-3">
                        <label class="form-label" for="password">Ingresa tu clave</label>
                        <input class="form-control" id="password" type="password" placeholder="Ingresa tu clave" />
                    </div>
                </div>

                <!-- Contenido del saldo (oculto inicialmente) -->
                <p id="saldoContent" class="text-body-tertiary lh-lg mb-0" style="display: none;">
                    Saldo: <span class="fw-bold">$<?php echo number_format($cashBalance, 2); ?></span>
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button">Aceptar</button>
            </div>
        </div>
    </div>
</div>