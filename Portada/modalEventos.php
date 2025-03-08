<div class="modal fade" id="modalEvento" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title text-primary" id="tituloEvento"></h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row g-2">
          <div class="col-12 col-md-auto">
            <p class="text-body-tertiary lh-lg mb-0" id="descripcionEvento"></p>
          </div>
          <div class="col-12 col-md-auto">
            <p class="text-body-tertiary lh-lg mb-0">
              <span data-feather="clock"></span> Inicio: <span id="startEvento"></span>
            </p>
            <p class="text-body-tertiary lh-lg mb-0">
              <span data-feather="clock"></span> Fin: <span id="endEvento"></span>
            </p>
            <p class="text-body-tertiary lh-lg mb-0">
              <span data-feather="user"></span> Médico: <span id="medicoEvento"></span>
            </p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>