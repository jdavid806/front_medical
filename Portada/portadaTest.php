
<?php
  include_once("../menu.php");
  include_once("../header.php");
 ?> 
 <style>
    /* NotAvailable.css */
.not-available-body {
  background-color: #f8f9fa;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.not-available-container {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.clock-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #6c757d;
}

h1 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #495057;
  font-weight: 500;
}

p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 25px;
  color: #6c757d;
}

.horario {
  background-color: #f1f3f5;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 16px;
}

.horario h2 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #495057;
}

.horario p {
  margin-bottom: 8px;
  font-size: 16px;
}

.contacto {
  margin-top: 25px;
  font-size: 16px;
  color: #6c757d;
}

  #loading-screen, #navbarCombo{
    display: none;
  }
  :root {
            --primary: #2c7fb8;
            --secondary: #7fcdbb;
            --accent: #edf8b1;
            --light: #f7f7f7;
            --dark: #253237;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 100%;
            margin: 50px auto;
            padding: 20px;
        }
        
        .search-section {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        h1 {
            color: var(--primary);
            margin-bottom: 20px;
            text-align: center;
        }
        
        .filter-group {
            margin-bottom: 20px;
        }
        
        .filter-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--dark);
        }
        
        select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .patient-info {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-top: 20px;
            display: none;
        }
        
        .patient-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }
        
        .patient-detail {
            padding: 12px;
            background: #f9f9f9;
            border-radius: 5px;
        }
        
        .patient-detail label {
            font-weight: 600;
            color: var(--primary);
            display: block;
            margin-bottom: 5px;
        }
        
        .no-patient {
            text-align: center;
            padding: 20px;
            color: #666;
        }
 </style>
<div id="landingHome"></div>
<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import {
    LandingApp
  } from '../react-dist/landingWeb/LandingApp.js';  

  ReactDOMClient.createRoot(document.getElementById('landingHome')).render(React.createElement(LandingApp));

</script>