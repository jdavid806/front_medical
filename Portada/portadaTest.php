<?php
include_once("../basicMenu.php");
?>
<div id="landingHome"></div>
<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    LandingApp
  } from '../react-dist/landingWeb/LandingApp.js';

  ReactDOMClient.createRoot(document.getElementById('landingHome')).render(React.createElement(LandingApp));
</script>

<?php include_once("../basicFooter.php"); ?>