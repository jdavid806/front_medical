<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        AppointmentFormModal
    } from './react-dist/appointments/AppointmentFormModal.js';

    const appointmentFormModalRef = React.createRef();

    const rootElement = document.getElementById('appointmentModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(AppointmentFormModal, {
        isOpen: true,
        onClose: () => {}
    }));
</script>

<?php include "../footer.php"; ?>