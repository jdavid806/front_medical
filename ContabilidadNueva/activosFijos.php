<?php
include "../menu.php";
include "../header.php";
?>

<style>
.container-small {
    max-width: 100% !important;
    width: 100%;
    padding: 0;
    margin: 0;
}
</style>
<div class="content">
    <div class="container-small">
        <div class="main-content">
            <div class="component-container">
                <div id="activosFijos"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
import React from "react"
import ReactDOMClient from "react-dom/client"
import {
    FixedAssetsTabs
} from './react-dist/accounting/fixedAssets/FixedAssetsTabs.js';

ReactDOMClient.createRoot(document.getElementById('activosFijos')).render(
    React.createElement(FixedAssetsTabs)
);
</script>
<?php
include "../footer.php";
?>