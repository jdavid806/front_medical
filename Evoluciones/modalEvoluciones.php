<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        EvolutionsForm
    } from './react-dist/evolutions/EvolutionsForm.js';

    ReactDOMClient.createRoot(document.getElementById('evolution-form-content')).render(React.createElement(EvolutionsForm));
</script>

<div class="modal fade" id="nuevaEvolucionModal" tabindex="-1" aria-labelledby="nuevaEvolucionModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="nuevaEvolucionModalLabel">Nueva Evolución</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="evolution-form-content"></div>
            </div>
        </div>
    </div>
</div>