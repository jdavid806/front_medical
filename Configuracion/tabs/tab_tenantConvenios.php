<!-- <div class="content">    
<div class="container-small">        
<nav class="mb-3" aria-label="breadcrumb">            
<ol class="breadcrumb mb-0">                
<li class="breadcrumb-item"><a href="homeContabilidad">Configuracion</a></li>                
<li class="breadcrumb-item active" onclick="location.reload()">Entidades</li>            
</ol>        
</nav>        
<div class="main-content">            
<div class="component-container">                 -->
<div id="TenantConvenios"></div>            
<!-- </div>        
</div>    
</div>
</div> -->

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        TenantConvenios
    } from './react-dist/tenant-convenios/TenantConvenios.js';

    ReactDOMClient.createRoot(document.getElementById('TenantConvenios')).render(React.createElement(TenantConvenios));
</script>