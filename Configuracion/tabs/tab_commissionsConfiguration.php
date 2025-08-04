<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    ComissionApp
  } from './react-dist/users/ComissionsApp.js';

  ReactDOMClient.createRoot(document.getElementById('ComissionApp')).render(React.createElement(ComissionApp));
</script>

<div id="ComissionApp"></div>
