<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        UserSpecialtyApp
    } from './react-dist/user-specialties/UserSpecialtyApp.js';

    ReactDOMClient.createRoot(document.getElementById('userSpecialtyAppReact')).render(React.createElement(UserSpecialtyApp));
</script>

<div id="userSpecialtyAppReact"></div>