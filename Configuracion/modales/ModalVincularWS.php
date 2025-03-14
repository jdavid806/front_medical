<div class="modal fade" id="modalVerQr" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Vincular WhatsApp</h5>
        <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-center">
        <p>Escanea este código QR para vincular tu cuenta de WhatsApp.</p>
        <img src="" alt="Código QR" id="qrWhatsApp" class="mt-3 img-fluid" style="max-width: 200px;">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<script>
  let modalCheckInterval;
  const modalVerQr = document.getElementById('modalVerQr');

  modalVerQr.addEventListener('shown.bs.modal', () => {
    startValidationLoop();
  });

  modalVerQr.addEventListener('hidden.bs.modal', () => {
    clearInterval(modalCheckInterval);
  });

  function startValidationLoop() {
    validarModal();

    modalCheckInterval = setInterval(() => {
      consultarQR();
    }, 2000);
  }

  function validarModal() {
    if (modalVerQr.classList.contains('show')) {
      consultarQR();
    } else {
      clearInterval(modalCheckInterval);
    }
  }
</script>