<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    UserApp
  } from './react-dist/users/UserApp.js';

  ReactDOMClient.createRoot(document.getElementById('userAppReact')).render(React.createElement(UserApp));
</script>

<div id="userAppReact"></div>