<div id="userRoleAppReact"></div>

<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    UserRoleApp
  } from './react-dist/user-roles/UserRoleApp.js';

  ReactDOMClient.createRoot(document.getElementById('userRoleAppReact')).render(React.createElement(UserRoleApp));
</script>