<div class="modal fade modal-xl" id="modalEntity" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content p-4">
      <div id="modal-invoice-by-entity"></div>
    </div>
  </div>
</div>

<script type="module">
    import React from "react" 
    import ReactDOMClient from "react-dom/client"
    import {
        BillingByEntity
    } from './react-dist/billing/by-entity/modal.js';

    ReactDOMClient.createRoot(document.getElementById('modal-invoice-by-entity')).render(React.createElement(BillingByEntity));
</script>