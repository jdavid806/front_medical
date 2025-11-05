<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<!-- DataTables JS -->
<script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>


<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

<!-- DATE PICKER - PHOENIX -->
<link href="<?= $BASE ?>vendors/flatpickr/flatpickr.min.css" rel="stylesheet" />
<link href="<?= $BASE ?>vendors/dropzone/dropzone.css" rel="stylesheet" />
<script src="<?= $BASE ?>vendors/flatpickr/flatpickr.min.js"></script>
<!-- DATE PICKER - PHOENIX -->

<!-- SELECT CON BUSCADOR - PHOENIX -->
<link href="<?= $BASE ?>vendors/choices/choices.min.css" rel="stylesheet" />
<script src="<?= $BASE ?>vendors/choices/choices.min.js"></script>
<!-- SELECT CON BUSCADOR - PHOENIX -->

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<style>
    .select2-container--default .select2-selection--single {
        z-index: 9999 !important;
    }

    .select2-container--default .select2-selection--multiple {
        z-index: 9999 !important;
    }

    .select2-container {
        z-index: 9999 !important;
    }

    .select2-container--default .select2-selection--single {
        height: calc(2.25rem + 2px);
        /* Ajusta esta altura según la de tu form-control */
        border: 1px solid #ced4da;
        /* Estilo de borde similar */
        border-radius: 0.25rem;
        /* Radio de borde similar */
    }

    .select2-container--default .select2-selection--multiple {
        min-height: calc(2.25rem + 2px);
        /* Ajusta la altura mínima */
        border: 1px solid #ced4da;
        /* Estilo de borde similar */
        border-radius: 0.25rem;
        /* Radio de borde */
        padding: 0.375rem 0.75rem;
        /* Ajuste del padding para alineación */
    }

    .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 2.25rem;
        /* Para centrar el texto verticalmente */
    }

    .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: calc(2.25rem + 2px);
        /* Asegúrate de que la flecha tenga la misma altura */
    }



    .tableDataTableSearch {
        margin-bottom: 50px;
    }
</style>


<script>
    //* POR FAVOR NO MODIFICAR NI ELIMINAR ESTAS FUNCIONES SON REQUERIDAS PARA HACER LAS PAGINACIONES DEL MODAL *// 
    function irASeccion(indice, idModal, idComun, numSections) {
        let seccionActual = parseInt($(`#${idModal}`).data('seccionActual')) || 1;

        if (indice == '+') {
            seccionActual += 1;
        } else if (indice == '-') {
            seccionActual -= 1;
        } else if (typeof indice == 'number') {
            seccionActual = indice;
        } else {
            alert("No cumple");
        }

        // Ensure the section number is within bounds
        if (seccionActual < 1) {
            seccionActual = 1;
        } else if (seccionActual > numSections) {
            seccionActual = numSections;
        }

        $(`#${idModal}`).data('seccionActual', seccionActual); // Store the current section in data

        for (let i = 1; i <= numSections; i++) {
            if (i == seccionActual) {
                $(`#${idModal} #${idComun}${i}`).css("display", "block");
                $(`#${idModal} #btn-paginacion-${i}`).addClass("btn-info").removeClass("btn-primary");
            } else {
                $(`#${idModal} #${idComun}${i}`).css("display", "none");
                $(`#${idModal} #btn-paginacion-${i}`).addClass("btn-primary").removeClass("btn-info");
            }
        }
    }

    function paginacionModal(idModal, idComun, numSections) {
        let seccionActual = 1;
        $(`#${idModal}`).data('seccionActual', seccionActual); // Store the current section

        let contenidoPaginacion = `<div style='display:flex; flex-direction:row; justify-content: center;'>
                                <button style="margin-right:5px" onclick="irASeccion('-', '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'> <i class='fas fa-angle-left'></i> Anterior </button>`;
        for (let i = 1; i <= numSections; i++) {
            contenidoPaginacion += `<button id="btn-paginacion-${i}" style="margin-right:5px" onclick="irASeccion(${i}, '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'>${i}</button>`;
        }
        contenidoPaginacion += `<button style="margin-right:5px" onclick="irASeccion('+', '${idModal}', '${idComun}', ${numSections})" class='btn btn-primary btn-sm'>Siguiente <i class='fas fa-angle-right'></i> </button>
                            </div>`;

        $(`#${idModal} #paginacionModal`).html(contenidoPaginacion);
        irASeccion(seccionActual, idModal, idComun, numSections);
    }
    //* POR FAVOR NO MODIFICAR NI ELIMINAR ESTAS FUNCIONES SON REQUERIDAS PARA HACER LAS PAGINACIONES DEL MODAL *//
</script>


<script>
    $(document).ready(function() {
        $('.tableDataTableSearch').DataTable({
            paging: true, // Habilita la paginación
            pageLength: 5, // Número de filas por página
            searching: true, // Habilita la búsqueda
            order: [
                [0, 'asc']
            ], // Ordena por la primera columna por defecto
            language: {
                "sEmptyTable": "No hay datos disponibles en la tabla",
                "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                "sInfoEmpty": "Mostrando 0 a 0 de 0 entradas",
                "sInfoFiltered": "(filtrado de _MAX_ entradas totales)",
                "sInfoPostFix": "",
                "sInfoThousands": ",",
                "sLengthMenu": "Mostrar _MENU_ entradas",
                "sLoadingRecords": "Cargando...",
                "sProcessing": "Procesando...",
                "sSearch": "Buscar:",
                "sZeroRecords": "No se encontraron resultados",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": activar para ordenar la columna de manera descendente"
                }
            },
            "drawCallback": function(settings) {
                // Personaliza los botones de paginación después de que DataTables se haya inicializado
                $('.dataTables_paginate .paginate_button').addClass('btn btn-primary');
                $('.dataTables_paginate .paginate_button.disabled').addClass('btn btn-primary');
            }
        });

        $('.select2').select2();
    });


    function selectToModal(idModal, classSelect2) {
        $('.' + classSelect2).select2({
            dropdownParent: $('#' + idModal) // Asegúrate de que el dropdown esté anclado al modal
        });
    }
</script>


<!-- <script> const baseSitema = "<?= $BASE ?>";</script>
<script src="<?= $BASE ?>js/utilidades.js"></script> -->
<script>
    function changeAjaxFast(table, columnChange, value, columnWhere, idWhere, toast = false) {

        $.ajax({
            type: "POST",
            url: "<?= $BASE ?>js/Ajax_Change_Fast.php",
            data: {
                'action': 'changeAjaxFast',
                'table': table,
                'columnChange': columnChange,
                'value': value,
                'columnWhere': columnWhere,
                'idWhere': idWhere
            },
            success: function(response) {
                response = response.trim();
                if (response == "ok") {
                    if (toast) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Actualizado',
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true,
                            timerProgressBar: true,
                            position: 'top-end'
                        })
                    }
                } else {
                    if (toast) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            showConfirmButton: false,
                            timer: 1500,
                            toast: true,
                            timerProgressBar: true,
                            position: 'top-end'
                        })
                    }
                }
            },
            error: function(xhr, status, error) {}
        })
    }
</script>
<script>
    // Definir la función selectMaster
    $.fn.selectMaster = function(config = null) {
        this.select2();
        this.empty();
        this.append('<option value="0" >-- Seleccione --</option>');
        var $select = $(this);
        let camposValue = config['campoValue'].split(',');
        let camposTexto = config['campoTexto'].split(',');

        function buscarDatos(open = false) {
            $.ajax({
                url: '<?= $BASE ?>FE_Ajax_SelectMaster.php',
                type: 'POST',
                data: {
                    where: btoa(config['where']),
                    campoValue: btoa(config['campoValue']),
                    campoTexto: btoa(config['campoTexto']),
                    tabla: btoa(config['tabla']),
                    valorInput: btoa(config['valorInput']),
                    selected: (config['selected'] != '0' ? btoa(config['selected']) : '0'),
                },
                success: function(response) {
                    let data = JSON.parse(response);


                    for (let i = 0; i < data.length; i++) {
                        let camposValuePrint = '';
                        let camposTextoPrint = '';

                        camposValue.forEach((element, index) => {
                            camposValuePrint += atob(data[i][btoa(camposValue[index])]) + ' | ';
                        });
                        camposValuePrint = camposValuePrint.substring(0, camposValuePrint.length - 3);

                        camposTexto.forEach((element, index) => {
                            camposTextoPrint += atob(data[i][btoa(camposTexto[index])]) + ' | ';
                        });
                        camposTextoPrint = camposTextoPrint.substring(0, camposTextoPrint.length - 3);



                        if (config['selected'] == atob(data[i][btoa(camposValue[0])])) {
                            $select.append('<option value="' + camposValuePrint + '" selected>' + camposTextoPrint + '</option>');
                        } else {
                            $select.append('<option value="' + camposValuePrint + '">' + camposTextoPrint + '</option>');
                        }
                    }
                    // Destruir instancia select2 y volver a aplicar
                    $select.select2('destroy').select2();
                    // abrirlo de nuevo y cargar el input de busqueda con el valor
                    if (open) {
                        $select.select2('open');
                    }
                    $select.data('select2').dropdown.$search.val(config['valorInput']);
                }
            });
        }

        // Definir una función de debouncing
        function debounce(func, delay) {
            let timer;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(context, args);
                }, delay);
            };
        }

        this.on('select2:open', function(e) {
            // Verificar que todos los datos de config existan
            if (config && config['campoValue'] && config['campoTexto'] && config['tabla']) {
                // buscarDatos(true);
                var $searchField = $select.data('select2').dropdown.$search || $select.data('select2').dropdown.$searchbox;
                // Evento input para el campo de búsqueda con debouncing
                $searchField.off('input').on('input', debounce(function() {
                    var searchText = $(this).val();
                    config['valorInput'] = searchText;
                    $select.empty();
                    $select.append('<option value="0" >-- Seleccione --</option>');

                    if (searchText != undefined && searchText != null) {
                        buscarDatos(true); // Realizar búsqueda incluso si el texto no está vacío
                    }
                }, 500));

                if (config['valorInput'] == undefined) {
                    config['valorInput'] = '';
                    buscarDatos(true);
                }
            }
        });

        if (config['selected'] && config['selected'] != '0') {
            buscarDatos();
        }
    }
</script>


<!-- PARA HACER UN GUARDADO RAPIDO -->
<div class="offcanvas offcanvas-end" style="z-index: 999999999 !important" tabindex="-1" id="offcanvasMaster"
    aria-labelledby="offcanvasMasterLabel">
    <div class="offcanvas-header">
        <h5 id="offcanvasMasterHeader"></h5>
        <button type="button" class="btn-close text-reset" id="btn-close-offcanvas-master" data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <div id="contentOffCanvasMaster"></div>
    </div>
</div>

<script>
    window.createDoughnutChart = function(
        elementId,
        titleText,
        titleSubtext,
        seriesName,
        seriesData
    ) {
        // Obtener el elemento por ID
        var chartElement = document.getElementById(elementId);
        if (!chartElement) {
            console.error(`El elemento con id '${elementId}' no existe.`);
            return;
        }

        // Inicializar el gráfico
        var chart = echarts.init(chartElement);

        // Configuración del gráfico
        var options = {
            title: {
                text: titleText,
                subtext: titleSubtext,
                left: "center",
                textStyle: {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#333",
                },
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)",
            },
            series: [{
                name: seriesName,
                type: "pie",
                radius: ["40%", "70%"],
                data: seriesData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                label: {
                    position: "outside",
                    formatter: "{b}: {d}%",
                },
            }, ],
        };

        // Usar la configuración para inicializar el gráfico
        chart.setOption(options);

        // Ajustar el gráfico al redimensionar la ventana
        window.addEventListener("resize", () => {
            chart.resize();
        });
    };
</script>

<script>
    function drawContentOffCanvas({
        html = '',
        title = '',
        icon = 'fas fa-plus',
        reload = false,
        inner = {},
        callback
    }) {
        $("#contentOffCanvasMaster").html(html);
        $("#offcanvasMasterHeader").html(`<i class='${icon}'></i> ${title}`);
    }


    function saveOffCanvas(ajaxB64 = '', jsonB64 = btoa('{}')) {
        let data = {
            action: "crear",
        }



        let {
            id,
            modal,
            element,
            visible,
            callback = false
        } = JSON.parse(atob(jsonB64));
        $("#contentOffCanvasMaster").find("textarea, input, select").each(function() {
            let idElemento = $(this).attr("id");
            if (idElemento) {
                data[idElemento] = $(this).val();
            }
        });


        $.ajax({
            type: "POST",
            url: atob(ajaxB64),
            data,
            success: function(response) {
                const dataJson = JSON.parse(response);
                const {
                    icon,
                    title,
                    text
                } = dataJson;
                Swal.fire({
                    icon,
                    title,
                    text
                });
                if (icon == 'success') {
                    if (callback) {
                        let callbackFunction = window[callback];
                        if (typeof callbackFunction === 'function') {
                            callbackFunction();
                        } else {
                            console.error('La función especificada no existe o no es una función.');
                        }
                    } else {
                        $(`#${modal} #${id}`).append(element.replace("[[VALUE]]", dataJson.data.id).replace("[[NAME]]", dataJson.data[visible]));

                    }

                    $("#btn-close-offcanvas-master").click();

                }
            },
            error: function(xhr, status, error) {

            }
        })
    }
</script>

<script>
    function setupToggleSwitch(checkboxId, targetIds) {

        const checkbox = document.getElementById(checkboxId);

        targetIds.forEach(targetId => {

            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Alterna la clase 'd-none' dependiendo del estado del checkbox
                if (checkbox.checked) {
                    targetElement.classList.remove('d-none');
                } else {
                    targetElement.classList.add('d-none');
                }
            } else {
                console.warn(`Elemento con ID '${targetId}' no encontrado.`);
            }
        });

    }
</script>

<!-- <script type="module">
  import {
    userService
  } from "./services/api/index.js";
  import {
    getJWTPayload
  } from "./services/utilidades.js";
  // Script para integrar el chat con webhook de Medical
  document.addEventListener('DOMContentLoaded', async function () {
    // console.log('Script de chat cargado correctamente');
    const user = await userService.getByExternalId(getJWTPayload().sub);
    var hostname = window.location.hostname.split('.')[0];

    // 1. Identificar elementos del chat
    const chatContainer = document.querySelector('.support-chat .d-flex.flex-column-reverse.scrollbar');
    const inputField = document.querySelector('.support-chat .form-control.outline-none');
    const sendButton = document.querySelector('.support-chat .send-btn');
    const predefinedQuestions = document.querySelectorAll('.support-chat .d-inline-flex.align-items-center.text-decoration-none');

    // Comprobar si los elementos se encontraron correctamente
    if (!chatContainer || !inputField || !sendButton) {
      console.error('No se pudieron encontrar todos los elementos del chat');
      return;
    } else {
      // console.log('Elementos del chat encontrados correctamente');
    }

    // 2. URL del webhook
    const webhookUrl = 'https://hooks.medicalsoft.ai/webhook/chat_medical';

    // 3. Función para enviar mensaje al webhook
    async function sendMessageToWebhook(message) {
      try {
        // console.log('Enviando mensaje:', message);

        // Mostrar mensaje del usuario en el chat
        addUserMessageToChat(message);

        // Mostrar indicador de carga
        const loadingId = addLoadingIndicator();

        // Enviar mensaje al webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            username: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`,
            tenant: hostname,
            user_id: user.id,
            speciality: user.specialty.name,
            phone: user.phone,
            email: user.email,
            profile: user.role.name,
          })
        });

        // console.log("Respuesta recibida:", response);

        // Procesar la respuesta como texto
        const responseText = await response.text();

        removeLoadingIndicator(loadingId);

        if (response.ok) {
          // Mostrar la respuesta en el chat
          addBotMessageToChat(responseText || 'No se recibió respuesta del servidor.');
        } else {
          console.error('Error en la respuesta del servidor:', response.status, responseText);
          addBotMessageToChat('Hubo un problema al procesar tu mensaje.');
        }


      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        addBotMessageToChat('Lo siento, ocurrió un error al comunicarse con el servidor.');
      }
    }

    // 4. Función para añadir mensaje del usuario al chat
    function addUserMessageToChat(message) {
      // console.log('Añadiendo mensaje del usuario al chat');
      const userMessageHTML = `
      <div class="text-end mb-3">
        <div class="d-inline-block p-3 rounded-3 bg-primary text-white">
          <p class="mb-0">${escapeHtml(message)}</p>
        </div>
      </div>
    `;
      chatContainer.insertAdjacentHTML('afterbegin', userMessageHTML);
    }

    // 5. Función para añadir mensaje del bot al chat
    function addBotMessageToChat(message) {
      // console.log('Añadiendo mensaje del bot al chat');
      const botMessageHTML = `
      <div class="mb-3">
        <div class="d-flex align-items-center mb-2">
          <div class="avatar avatar-l me-2">
            <img class="rounded-circle border border-2 border-white" src="assets/img/team/30.webp" alt="MediBot AI" />
          </div>
          <h6 class="mb-0">MediBot AI</h6>
        </div>
        <div class="d-inline-block p-3 rounded-3 bg-body-tertiary">
          <p class="mb-0">${message}</p>
        </div>
      </div>
    `;
      chatContainer.insertAdjacentHTML('afterbegin', botMessageHTML);
    }

    // 6. Función para añadir indicador de carga
    function addLoadingIndicator() {
      // console.log('Añadiendo indicador de carga');
      const id = 'loading-' + Date.now();
      const loadingHTML = `
      <div id="${id}" class="mb-3">
        <div class="d-flex align-items-center mb-2">
          <div class="avatar avatar-l me-2">
            <img class="rounded-circle border border-2 border-white" src="assets/img/team/30.webp" alt="Eric" />
          </div>
          <h6 class="mb-0">Eric</h6>
        </div>
        <div class="d-inline-block p-3 rounded-3 bg-body-tertiary">
          <p class="mb-0">
            <span class="typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </p>
        </div>
      </div>
    `;
      chatContainer.insertAdjacentHTML('afterbegin', loadingHTML);
      return id;
    }

    // 7. Función para remover indicador de carga
    function removeLoadingIndicator(id) {
      // console.log('Removiendo indicador de carga:', id);
      const loadingElement = document.getElementById(id);
      if (loadingElement) {
        loadingElement.remove();
      }
    }

    // 8. Función para escape de HTML (seguridad)
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // 9. Añadir estilos para el indicador de carga
    function addStyles() {
      // console.log('Añadiendo estilos CSS');
      const styleElement = document.createElement('style');
      styleElement.textContent = `
      .typing-indicator {
        display: flex;
        gap: 4px;
      }
      
      .typing-indicator .dot {
        width: 8px;
        height: 8px;
        background-color: #888;
        border-radius: 50%;
        opacity: 0.6;
        animation: dot-pulse 1.5s infinite ease-in-out;
      }
      
      .typing-indicator .dot:nth-child(1) {
        animation-delay: 0s;
      }
      
      .typing-indicator .dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .typing-indicator .dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes dot-pulse {
        0%, 60%, 100% {
          transform: scale(1);
          opacity: 0.6;
        }
        30% {
          transform: scale(1.5);
          opacity: 1;
        }
      }
    `;
      document.head.appendChild(styleElement);
    }

    // 10. Event listener para el botón de enviar
    if (sendButton) {
      // console.log('Agregando evento al botón de enviar');
      sendButton.addEventListener('click', function () {
        const message = inputField.value.trim();
        if (message) {
          sendMessageToWebhook(message);
          inputField.value = '';
        }
      });
    }

    // 11. Event listener para la tecla Enter en el campo de entrada
    if (inputField) {
      // console.log('Agregando evento de tecla Enter al campo de entrada');
      inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          const message = inputField.value.trim();
          if (message) {
            sendMessageToWebhook(message);
            inputField.value = '';
          }
          e.preventDefault();
        }
      });
    }

    // 12. Event listeners para las preguntas predefinidas
    if (predefinedQuestions && predefinedQuestions.length > 0) {
      // console.log('Agregando eventos a preguntas predefinidas');
      predefinedQuestions.forEach(question => {
        question.addEventListener('click', function (e) {
          e.preventDefault();
          const messageElement = this.querySelector('p');
          if (messageElement) {
            const message = messageElement.textContent;
            sendMessageToWebhook(message);
          }
        });
      });
    }

    // 13. Mensaje inicial del bot (opcional)
    setTimeout(() => {
      addBotMessageToChat('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?');
    }, 1000);

    // Inicializar estilos
    addStyles();

    // console.log('Inicialización del chat completada');
  });
</script> -->

<script type="module">
    // ==========================================================================
    // Script Chat con Historial de Sesión y Preparación para Adjuntos
    // ==========================================================================
    // Importaciones originales
    import {
        userService
    } from "./services/api/index.js";
    import {
        getJWTPayload
    } from "./services/utilidades.js";

    // --- Configuración ---
    const webhookUrl = 'https://hooks.medicalsoft.ai/webhook/chat_medical'; // URL del Webhook en n8n
    const chatHistoryKey = 'chatSessionHistoryMedical'; // Clave para guardar historial en sessionStorage
    const botName = 'MediBot AI'; // Nombre del bot para mostrar
    const botAvatar = 'assets/img/team/30.webp'; // Ruta al avatar del bot

    document.addEventListener('DOMContentLoaded', async function() {
        console.log('Iniciando script de chat v2...');

        // Variables globales dentro del listener
        let chatHistory = []; // Array para mantener el historial en memoria
        let currentUser = null; // Para guardar los datos del usuario recuperados
        let hostname = 'unknown'; // Hostname por defecto

        // --- 1. OBTENER DATOS DEL USUARIO Y HOSTNAME ---
        try {
            const payload = getJWTPayload();
            if (!payload || !payload.sub) {
                throw new Error("No se pudo obtener el payload del JWT o el ID de usuario (sub).");
            }
            currentUser = await userService.getByExternalId(payload.sub);
            if (!currentUser) {
                throw new Error(`No se encontraron datos para el usuario con ID externo: ${payload.sub}`);
            }
            hostname = window.location.hostname.split('.')[0];
            console.log('Usuario y hostname obtenidos:', currentUser.email, hostname);
        } catch (error) {
            console.error("Error crítico al obtener datos iniciales:", error);
            // Podrías mostrar un mensaje de error en la UI aquí si lo deseas
            // alert('No se pudo inicializar el chat: faltan datos del usuario.');
            return; // Detener ejecución si no hay datos esenciales
        }

        // --- 2. IDENTIFICAR ELEMENTOS DEL DOM ---
        const chatContainer = document.querySelector('.support-chat .d-flex.flex-column-reverse.scrollbar');
        const inputField = document.querySelector('.support-chat .form-control.outline-none');
        const sendButton = document.querySelector('.support-chat .send-btn');
        const predefinedQuestions = document.querySelectorAll('.support-chat .d-inline-flex.align-items-center.text-decoration-none');
        // Elementos para adjuntar archivos (¡ASEGÚRATE QUE ESTÉN EN TU HTML!)
        const fileInput = document.getElementById('chatFileInput');
        const attachButton = document.getElementById('chatAttachButton'); // Botón opcional para activar el input file

        // Comprobar elementos básicos del chat
        if (!chatContainer || !inputField || !sendButton) {
            console.error('Error crítico: No se pudieron encontrar los elementos básicos del chat (contenedor, input o botón de enviar).');
            return; // Detener si falta algo esencial
        }
        // Comprobar elementos de adjuntar (opcional pero recomendado)
        if (!fileInput) {
            console.warn("Input para adjuntar archivos ('chatFileInput') no encontrado. La función de adjuntar no estará disponible.");
        }
        if (!attachButton) {
            console.warn("Botón para adjuntar archivos ('chatAttachButton') no encontrado.");
        } else if (fileInput && attachButton) {
            // Conectar botón de adjuntar con el input oculto
            attachButton.addEventListener('click', () => {
                fileInput.click(); // Abre el selector de archivos al hacer clic en el botón
            });
            console.log('Botón de adjuntar conectado.');
        }
        // Opcional: Mostrar nombre de archivo seleccionado
        if (fileInput) {
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length > 0) {
                    // Podrías mostrar fileInput.files[0].name en algún lugar de la UI
                    console.log(`Archivo seleccionado: ${fileInput.files[0].name}`);
                    // Ejemplo: Cambiar placeholder del input de texto
                    // inputField.placeholder = `Archivo: ${fileInput.files[0].name}`;
                } else {
                    // inputField.placeholder = 'Escribe tu mensaje...'; // Restaurar placeholder
                }
            });
        }


        // --- 3. FUNCIONES PARA MANEJAR HISTORIAL (sessionStorage) ---

        function loadChatHistory() {
            const storedHistory = sessionStorage.getItem(chatHistoryKey);
            if (storedHistory) {
                try {
                    chatHistory = JSON.parse(storedHistory);
                    // Pintar historial en la UI. Invertir para que 'afterbegin' muestre en orden correcto.
                    const reversedHistory = [...chatHistory].reverse();
                    reversedHistory.forEach(msg => {
                        if (msg.type === 'user') {
                            addUserMessageToChat(msg.content, false); // false = no volver a guardar
                        } else {
                            addBotMessageToChat(msg.content, false); // false = no volver a guardar
                        }
                    });
                    console.log(`Historial de sesión cargado (${chatHistory.length} mensajes).`);
                } catch (error) {
                    console.error('Error al parsear historial de sesión guardado:', error);
                    sessionStorage.removeItem(chatHistoryKey); // Limpiar si está corrupto
                    chatHistory = [];
                }
            } else {
                console.log('No se encontró historial de sesión previo.');
                chatHistory = [];
            }
        }

        function saveToSessionHistory(messageObject) {
            // Añade al array en memoria ANTES de guardar
            if (!chatHistory.find(msg => msg.timestamp === messageObject.timestamp && msg.content === messageObject.content)) {
                chatHistory.push(messageObject);
            }
            try {
                // Guarda el array completo actualizado en sessionStorage
                sessionStorage.setItem(chatHistoryKey, JSON.stringify(chatHistory));
            } catch (error) {
                console.error("Error al guardar en sessionStorage (¿quizás lleno?):", error);
                // Aquí podrías implementar lógica para quitar mensajes viejos si el storage está lleno
            }
        }

        // --- 4. FUNCIONES PARA ACTUALIZAR LA INTERFAZ DE USUARIO (UI) ---

        function escapeHtml(text) {
            if (typeof text !== 'string') return text; // Devolver si no es string
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function addUserMessageToChat(message, save = true) {
            const timestamp = Date.now(); // Usar timestamp como ID temporal
            const userMessageHTML = `
            <div class="text-end mb-3" data-timestamp="${timestamp}">
              <div class="d-inline-block p-3 rounded-3 bg-primary text-white">
                <p class="mb-0">${escapeHtml(message)}</p>
              </div>
            </div>
          `;
            chatContainer.insertAdjacentHTML('afterbegin', userMessageHTML);
            // Hacer scroll hacia abajo (en este caso, hacia arriba por flex-column-reverse)
            chatContainer.scrollTop = 0; // Scroll al principio (mensaje más reciente)


            if (save) {
                saveToSessionHistory({
                    type: 'user',
                    content: message,
                    timestamp: timestamp
                });
            }
        }

        function addBotMessageToChat(message, save = true) {
            const timestamp = Date.now();
            // Asumimos que la respuesta del bot puede contener HTML simple (como <br>),
            // pero no debería contener scripts. Si necesitas seguridad extra, sanitiza aquí.
            const botMessageHTML = `
            <div class="mb-3" data-timestamp="${timestamp}">
              <div class="d-flex align-items-center mb-2">
                <div class="avatar avatar-l me-2">
                  <img class="rounded-circle border border-2 border-white" src="${botAvatar}" alt="${botName}" />
                </div>
                <h6 class="mb-0">${botName}</h6>
              </div>
              <div class="d-inline-block p-3 rounded-3 bg-body-tertiary">
                <p class="mb-0">${message}</p>
              </div>
            </div>
          `;
            chatContainer.insertAdjacentHTML('afterbegin', botMessageHTML);
            chatContainer.scrollTop = 0; // Scroll al principio

            if (save) {
                saveToSessionHistory({
                    type: 'bot',
                    content: message,
                    timestamp: timestamp
                });
            }
        }

        function addLoadingIndicator() {
            const id = 'loading-' + Date.now();
            const loadingHTML = `
            <div id="${id}" class="mb-3">
              <div class="d-flex align-items-center mb-2">
                <div class="avatar avatar-l me-2">
                   <img class="rounded-circle border border-2 border-white" src="${botAvatar}" alt="${botName}" />
                </div>
                <h6 class="mb-0">${botName}</h6>
              </div>
              <div class="d-inline-block p-3 rounded-3 bg-body-tertiary">
                <p class="mb-0">
                  <span class="typing-indicator">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                  </span>
                </p>
              </div>
            </div>
          `;
            chatContainer.insertAdjacentHTML('afterbegin', loadingHTML);
            chatContainer.scrollTop = 0; // Scroll al principio
            return id;
        }

        function removeLoadingIndicator(id) {
            const loadingElement = document.getElementById(id);
            if (loadingElement) {
                loadingElement.remove();
            }
        }

        function addStyles() {
            const styleId = 'chat-styles';
            if (document.getElementById(styleId)) return; // Evitar añadir estilos múltiples veces

            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = `
            .typing-indicator { display: flex; gap: 4px; }
            .typing-indicator .dot { width: 8px; height: 8px; background-color: #888; border-radius: 50%; opacity: 0.6; animation: dot-pulse 1.5s infinite ease-in-out; }
            .typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
            .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes dot-pulse { 0%, 60%, 100% { transform: scale(1); opacity: 0.6; } 30% { transform: scale(1.5); opacity: 1; } }
          `;
            document.head.appendChild(styleElement);
        }

        // --- 5. FUNCIÓN PRINCIPAL PARA ENVIAR MENSAJES Y/O ARCHIVOS ---

        async function sendMessageAndOrFileToWebhook() {
            const textMessage = inputField.value.trim();
            const selectedFile = (fileInput && fileInput.files.length > 0) ? fileInput.files[0] : null;

            // No enviar si no hay NADA (ni texto ni archivo)
            if (!textMessage && !selectedFile) {
                console.log("Nada que enviar.");
                return;
            }

            // Mostrar mensaje de usuario en la UI (si hay texto)
            if (textMessage) {
                addUserMessageToChat(textMessage); // Guarda en historial por defecto
            }
            // Mostrar indicación de archivo enviado (si hay archivo)
            if (selectedFile) {
                // Puedes mejorar esta UI, por ejemplo mostrando una miniatura si es imagen
                addUserMessageToChat(`Archivo adjunto: ${selectedFile.name}`, true);
            }

            const loadingId = addLoadingIndicator();

            // Crear FormData para enviar
            const formData = new FormData();

            // Añadir mensaje de texto (si existe)
            if (textMessage) {
                formData.append('message', textMessage);
            }

            // Añadir datos del usuario (¡Verificados al inicio!)
            formData.append('username', `${currentUser.first_name || ''} ${currentUser.middle_name || ''} ${currentUser.last_name || ''} ${currentUser.second_last_name || ''}`.trim());
            formData.append('tenant', hostname);
            formData.append('user_id', currentUser.id);
            // Usar optional chaining (?.) por si alguna propiedad no existiera
            formData.append('speciality', currentUser.specialty?.name || 'N/A');
            formData.append('phone', currentUser.phone || 'N/A');
            formData.append('email', currentUser.email || 'N/A');
            formData.append('profile', currentUser.role?.name || 'N/A');

            // Añadir archivo si existe
            if (selectedFile) {
                formData.append('attachment', selectedFile, selectedFile.name); // Clave 'attachment'
                console.log(`Adjuntando archivo: ${selectedFile.name}, Tamaño: ${selectedFile.size} bytes`);
                // ================= ¡¡¡ ADVERTENCIA IMPORTANTE !!! =================
                // El webhook en n8n (${webhookUrl}) DEBE estar configurado para aceptar
                // 'multipart/form-data' y procesar el campo llamado 'attachment'.
                // Si no, la subida del archivo NO funcionará correctamente.
                // Consulta con el responsable de configurar n8n.
                // ==================================================================
            }

            // Enviar al Webhook
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData // El navegador pondrá el Content-Type correcto automáticamente
                    // No añadas 'Content-Type': 'application/json' aquí
                });

                // Procesar respuesta
                const responseText = await response.text(); // Leer como texto siempre
                removeLoadingIndicator(loadingId); // Quitar indicador de carga

                if (response.ok) {
                    addBotMessageToChat(responseText || 'Respuesta recibida.'); // Guarda en historial
                } else {
                    console.error(`Error ${response.status} en la respuesta del servidor:`, responseText);
                    addBotMessageToChat(`Hubo un problema (${response.status}) al procesar tu mensaje. Intenta de nuevo.`, false); // No guardar error
                }

            } catch (error) {
                console.error('Error de red o al enviar mensaje/archivo:', error);
                removeLoadingIndicator(loadingId);
                addBotMessageToChat('Lo siento, ocurrió un error de conexión al intentar enviar tu mensaje.', false); // No guardar error
            } finally {
                // Limpiar campos después de enviar, independientemente del resultado
                inputField.value = '';
                if (fileInput) {
                    fileInput.value = ''; // Resetea el input de archivo para poder seleccionar el mismo otra vez
                    // inputField.placeholder = 'Escribe tu mensaje...'; // Restaurar placeholder si se cambió
                }
            }
        } // Fin de sendMessageAndOrFileToWebhook

        // --- 6. EVENT LISTENERS ---

        // Botón Enviar
        sendButton.addEventListener('click', sendMessageAndOrFileToWebhook);

        // Tecla Enter en el campo de texto
        inputField.addEventListener('keypress', function(e) {
            // Enviar con Enter, permitir Shift+Enter para nueva línea
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Evitar nueva línea o submit por defecto
                sendMessageAndOrFileToWebhook();
            }
        });

        // Preguntas Predefinidas
        predefinedQuestions.forEach(question => {
            question.addEventListener('click', function(e) {
                e.preventDefault();
                const messageElement = this.querySelector('p');
                if (messageElement) {
                    const message = messageElement.textContent.trim();
                    if (message) {
                        // Simular que el usuario escribió y envió la pregunta
                        inputField.value = message; // Poner el texto en el input (opcional)
                        sendMessageAndOrFileToWebhook();
                        // inputField.value = ''; // Limpiar input si se llenó antes
                    }
                }
            });
        });

        // --- 7. INICIALIZACIÓN FINAL ---
        addStyles(); // Añadir estilos CSS para el indicador de carga
        loadChatHistory(); // Cargar historial de la sesión al iniciar

        // Mensaje inicial del bot (solo si no hay historial previo)
        setTimeout(() => {
            if (chatHistory.length === 0) {
                addBotMessageToChat(`¡Hola ${currentUser.first_name || 'usuario'}! Soy ${botName}. ¿En qué puedo ayudarte hoy?`, true); // Guardar saludo
            }
        }, 500); // Pequeño retraso para asegurar que todo esté listo

        console.log('Script de chat v2 completamente inicializado y listo.');
        console.warn("Recordatorio MUY IMPORTANTE: La funcionalidad de adjuntar archivos depende de la configuración correcta del webhook en n8n para recibir 'multipart/form-data'.");

    }); // Fin de DOMContentLoaded
</script>

<!-- PARA HACER UN GUARDADO RAPIDO -->


<!-- 
desde aca construyo
M. Castro c:
===============================================-->

<!-- para texto enriquecido -->
<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        Editor
    } from "primereact/editor";

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll(".rich-text-react").forEach((element) => {
            ReactDOMClient.createRoot(element).render(
                React.createElement(Editor, {
                    style: {
                        height: "400px"
                    }
                })
            );
        });
    });
</script>

<script>
    // Cargar datos desde localStorage al iniciar
    let entidadesArray = JSON.parse(localStorage.getItem("entidades")) || [];

    // Función para guardar en localStorage
    function guardarEntidades() {
        localStorage.setItem("entidades", JSON.stringify(entidadesArray));
    }
</script>

<!-- crear impresiones -->
<script src="PlantillasImpresion/FuncionExtra.js"></script>
<script src="PlantillasImpresion/CrearImpresion.js"></script>


<!-- consultar información impresiones -->
<script src="funciones/funcionesJS/ConsultasDinamicas.js"></script>
<script src="funciones/funcionesJS/CrearFormatoImpresion.js"></script>
<script src="funciones/funcionesJS/RealizarEnvios.js"></script>
<script src="funciones/funcionesJS/funcioneConfig.js"></script>
<script src="funciones/funcionesJS/FuncionesFacturas.js"></script>

<!-- manejo de eventos mensajes -->
<script src="funciones/funcionesJS/eventos_mensajes/EventosMensajes.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosCitas.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosTurnos.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosFacturas.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosHistorias.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosRecetas.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosIncapacidad.js"></script>
<script src="funciones/funcionesJS/eventos_mensajes/EventosExamenes.js"></script>

<!-- encriptar info -->
<script src="funciones/funcionesEncrypt/encriptar.js"></script>

<!-- funciones plantillas -->
<script src="Configuracion/js/plantillasMensajes.js"></script>
<script src="Configuracion/js/CrudFuncionesMensajes.js"></script>
<script src="Configuracion/js/CrudPrecios.js"></script>
<script src="Configuracion/js/CrudMetodosPago.js"></script>
<script src="Configuracion/js/CrudCentroCostos.js"></script>
<script src="Configuracion/js/CrudConsentimientos.js"></script>
<script src="Configuracion/js/CrudEntidades.js"></script>
<script src="Configuracion/js/CrudEspecialdiades.js"></script>
<script src="Configuracion/js/CrudImpuestos.js"></script>
<script src="Configuracion/js/CrudRecargos.js"></script>
<script src="Configuracion/js/CrudTenant.js"></script>

<!-- funciones Imagenes -->
<script src="funciones/funcionesJS/FuncionesImagenes.js"></script>

<!-- funcionex textarea -->
<!-- <script src="apiVoz_4.0.js"></script> -->

<!-- descarga de pdf -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>


<!-- Crud Consetimintos -->
<script src="Documentos/js/CrudConsentimientos.js"></script>
<script src="Documentos/js/UtilsConsentimientos.js"></script>

<script src="funciones/funcionesJS/utils.js"></script>

<script>
    document.addEventListener("DOMContentLoaded", async function() {});
</script>
<!--
hasta aca construyo
M. Castro c:
===============================================-->

<!-- ===============================================-->
<!--    JavaScripts-->
<!-- ===============================================-->

<script src="<?= $BASE ?>vendors/popper/popper.min.js"></script>
<script src="<?= $BASE ?>vendors/bootstrap/bootstrap.min.js"></script>
<script src="<?= $BASE ?>vendors/anchorjs/anchor.min.js"></script>
<script src="<?= $BASE ?>vendors/is/is.min.js"></script>
<script src="<?= $BASE ?>vendors/fontawesome/all.min.js"></script>
<script src="<?= $BASE ?>vendors/lodash/lodash.min.js"></script>
<script src="<?= $BASE ?>vendors/list.js/list.min.js"></script>
<script src="<?= $BASE ?>vendors/feather-icons/feather.min.js"></script>
<script src="<?= $BASE ?>vendors/dayjs/dayjs.min.js"></script>
<script src="<?= $BASE ?>vendors/leaflet/leaflet.js"></script>
<script src="<?= $BASE ?>vendors/leaflet.markercluster/leaflet.markercluster.js"></script>
<script src="<?= $BASE ?>vendors/leaflet.tilelayer.colorfilter/leaflet-tilelayer-colorfilter.min.js"></script>
<script src="<?= $BASE ?>assets/js/phoenix.js"></script>
<script src="<?= $BASE ?>vendors/echarts/echarts.min.js"></script>
<script src="<?= $BASE ?>assets/js/ecommerce-dashboard.js"></script>
<script src="<?= $BASE ?>vendors/tinymce/tinymce.min.js"></script>
<script src="<?= $BASE ?>vendors/fullcalendar/index.global.min.js"></script>
<script src="<?= $BASE ?>vendors/typed.js/typed.umd.js"></script>
<script src="<?= $BASE ?>vendors/dropzone/dropzone-min.js"></script>
<script src="<?= $BASE ?>vendors/sortablejs/Sortable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.3.3/dist/echarts.min.js"></script>
<!-- <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6.3.1-12/skins/ui/oxide/skin.min.css"
  referrerpolicy="origin"></script> -->
</body>

</html>