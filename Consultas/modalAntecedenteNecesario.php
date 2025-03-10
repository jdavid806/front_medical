<div class="modal fade" id="modalAntecedenteNecesario" tabindex="-1" aria-labelledby="modalAntecedenteLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalAntecedenteLabel">Antecedentes Personales</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div id="form-content"></div>

            </div>
        </div>
    </div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PastMedicalHistoryForm
    } from './react-dist/past-medical-history/PastMedicalHistoryForm.js';

    ReactDOMClient.createRoot(document.getElementById('form-content')).render(React.createElement(PastMedicalHistoryForm));
</script>