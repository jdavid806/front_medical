<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        UserAvailabilityApp
    } from './react-dist/user-availabilities/UserAvailabilityApp.js';

    ReactDOMClient.createRoot(document.getElementById('userAvailabilityAppReact')).render(React.createElement(UserAvailabilityApp));
</script>

<div id="userAvailabilityAppReact"></div>