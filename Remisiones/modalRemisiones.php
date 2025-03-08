<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        remissionsForm
    } from './react-dist/remissions/RemissionsForm.js';

    ReactDOMClient.createRoot(document.getElementById('remission-form-content')).render(React.createElement(remissionsForm));
</script>

<div class="modal fade" id="nuevaRemisionModal" tabindex="-1" aria-labelledby="nuevaRemisionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="nuevaRemisionModalLabel">Nueva Remisión</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="remission-form-content"></div>
            </div>
        </div>
    </div>
</div>