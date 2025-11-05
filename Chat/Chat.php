<?php
include "../menu.php";
include "../header.php";
?>

<style>
.chat-container {
    display: flex;
    width: 100%;       /* un poco más estrecho */
    max-width: 100%; 
    height: 80vh;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 150, 0.1);
    overflow: hidden;
    margin: 20px 0 20px 20px; /* margen superior, inferior, izquierdo */
}


/* Panel de usuarios */
.users-panel {
    width: 300px;
    background: linear-gradient(to bottom, #1e3c72, #2a5298);
    color: white;
    padding: 25px;
    display: flex;
    flex-direction: column;
}

.users-panel h2 {
    font-size: 22px;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 600;
}

.users-list {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 10px;
}

.user-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin-bottom: 10px;
    border-radius: 10px;
    transition: background-color 0.2s;
    cursor: pointer;
}

.user-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.user-item.active {
    background-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #4a7bff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-weight: bold;
    font-size: 18px;
}

.user-info {
    flex-grow: 1;
}

.user-name {
    font-weight: 500;
    margin-bottom: 3px;
}

.user-status {
    font-size: 12px;
    opacity: 0.8;
}

.status-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
}

.status-online {
    background-color: #4caf50;
}

.status-away {
    background-color: #ff9800;
}

/* Panel de chat */
.chat-panel {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #f8faff;
    min-width: 400px;
}

.chat-header {
    padding: 20px 25px;
    background-color: white;
    border-bottom: 1px solid #e6ecff;
    display: flex;
    align-items: center;
}

.chat-header-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #4a7bff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-weight: bold;
    font-size: 18px;
    color: white;
}

.chat-header-info h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 3px;
}

.chat-header-info p {
    font-size: 13px;
    color: #4a7bff;
}

.chat-messages {
    flex-grow: 1;
    padding: 25px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

/* Burbujas de chat */
.message {
    max-width: 70%;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.message.received {
    align-self: flex-start;
}

.message.sent {
    align-self: flex-end;
}

.message-bubble {
    padding: 14px 20px;
    border-radius: 18px;
    position: relative;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    font-size: 15px;
}

.message.received .message-bubble {
    background-color: white;
    border-bottom-left-radius: 5px;
    color: #333;
}

.message.sent .message-bubble {
    background: linear-gradient(to right, #4a7bff, #3a6bff);
    color: white;
    border-bottom-right-radius: 5px;
}

.message-time {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
    align-self: flex-end;
}

.message.sent .message-time {
    color: rgba(255, 255, 255, 0.8);
}

.chat-input {
    padding: 20px 25px;
    background-color: white;
    border-top: 1px solid #e6ecff;
    display: flex;
}

.chat-input input {
    flex-grow: 1;
    padding: 14px 20px;
    border: 1px solid #e6ecff;
    border-radius: 25px;
    outline: none;
    font-size: 15px;
    transition: border-color 0.3s;
}

.chat-input input:focus {
    border-color: #4a7bff;
}

.chat-input button {
    background: linear-gradient(to right, #4a7bff, #3a6bff);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.chat-input button:hover {
    transform: scale(1.05);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
    .chat-container {
        flex-direction: column;
        height: 90vh;
        width: 98%;
    }
    
    .users-panel {
        width: 100%;
        height: 220px;
    }
    
    .users-list {
        display: flex;
        overflow-x: auto;
        flex-wrap: nowrap;
    }
    
    .user-item {
        min-width: 150px;
        margin-right: 10px;
    }
}

</style>
<div class="content">
  <div class="">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>      
    </nav>

    <div id="ChatApp"></div>
  </div>
</div>

<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
<script type="module">
  import React from "react"
  import ReactDOMClient from "react-dom/client"
  import { ChatApp } from './react-dist/chat/ChatApp.js';

  const token = sessionStorage.getItem("auth_token") || "";

  ReactDOMClient.createRoot(document.getElementById('ChatApp'))
    .render(React.createElement(ChatApp, { token }));
</script>
