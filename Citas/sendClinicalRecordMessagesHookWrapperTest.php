<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
        <button id="btnTest">Test</button>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        SendClinicalRecordMessagesHookWrapper
    } from './react-dist/wrappers/SendMessagesWrapper.js';

    const sendClinicalRecordMessagesHookWrapperRef = React.createRef();

    const rootElement = document.getElementById('appointmentModalRoot');
    ReactDOMClient.createRoot(rootElement).render(React.createElement(SendClinicalRecordMessagesHookWrapper, {
        clinicalRecordId: 58,
        ref: sendClinicalRecordMessagesHookWrapperRef
    }));

    console.log(sendClinicalRecordMessagesHookWrapperRef);

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('btnTest').addEventListener('click', () => {
            console.log(sendClinicalRecordMessagesHookWrapperRef.current);
            sendClinicalRecordMessagesHookWrapperRef.current.sendClinicalRecordMessages();
        });
    });
</script>

<?php include "../footer.php"; ?>