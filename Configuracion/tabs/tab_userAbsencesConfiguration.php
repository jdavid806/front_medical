<div id="userAbsencesAppReact"></div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        UserAbsenceApp
    } from './react-dist/user-absences/UserAbsenceApp.js';

    ReactDOMClient.createRoot(document.getElementById('userAbsencesAppReact')).render(React.createElement(UserAbsenceApp));
</script>