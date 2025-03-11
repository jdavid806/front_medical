<div class="container">
    <div id="gestionarModulosReact"></div>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ModuleApp
    } from './react-dist/modules/ModuleApp.js';

    ReactDOMClient.createRoot(document.getElementById('gestionarModulosReact')).render(React.createElement(ModuleApp));
</script>