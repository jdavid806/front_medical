<div id="admissionAppReact"></div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        AdmissionAppReact
    } from './react-dist/admissions/AdmissionAppReact.js';

    ReactDOMClient.createRoot(document.getElementById('LobbyAppointments')).render(React.createElement(LobbyAppointments));
</script>