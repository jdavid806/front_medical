<style>
    * {
        font-size: large;
    }
</style>
<style>
    /* Estilos para el dropdown de Choices */
    .choices__list--dropdown .choices__item--selectable {
        color: #333;
        /* Color del texto normal */
        padding: 8px 10px;
    }

    /* Cuando se hace hover */
    .choices__list--dropdown .choices__item--selectable:hover,
    .choices__list--dropdown .choices__item--selectable.is-highlighted {
        background-color: #f5f5f5;
        /* Color de fondo al hacer hover */
        color: #333 !important;
        /* Color del texto al hacer hover */
    }

    /* Opcional: estilo para el placeholder */
    .choices__list--dropdown .choices__placeholder {
        color: #999;
    }

    .navbar .dropdown-menu.dropdown-menu-end.navbar-dropdown-caret {
        /* Tus estilos existentes */
        width: auto !important;
        right: 0 !important;
    }

    /* Ajustar el espaciado entre elementos */
    .row-custom {
        gap: 30px;
        /* Espacio entre elementos */
    }

    /* Asegurar que el texto no se desborde */
    .text-truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>


<link rel="stylesheet" href="fuentes/fuentes.css">
<nav class="navbar navbar-top fixed-top navbar-expand-lg" id="navbarCombo" data-navbar-top="combo"
    data-move-target="#navbarVerticalNav">
    <div class="navbar-logo">

    </div>
    <a class="navbar-brand me-1 me-sm-3" href="/Dashboard">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center" id=""><img src="assets/img/logos/FullColor.svg" alt="phoenix"
                    width="125" />

            </div>
        </div>
    </a>
    </div>

    <ul class="navbar-nav navbar-nav-icons flex-row flex-grow-1">
        <li class="nav-item w-100">
            <div id="NavbarHeader"></div>
        </li>
    </ul>

    <ul class="navbar-nav navbar-nav-icons flex-row">
        <li class="nav-item">
            <div class="theme-control-toggle fa-icon-wait px-2">

                <input class="form-check-input ms-0 theme-control-toggle-input" type="checkbox"
                    data-theme-control="phoenixTheme" value="dark" id="themeControlToggle" />
                <label class="mb-0 theme-control-toggle-label theme-control-toggle-light" for="themeControlToggle"
                    data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme"
                    style="height:32px;width:32px;"><span class="icon" data-feather="moon"></span></label>
                <label class="mb-0 theme-control-toggle-label theme-control-toggle-dark" for="themeControlToggle"
                    data-bs-toggle="tooltip" data-bs-placement="left" data-bs-title="Switch theme"
                    style="height:32px;width:32px;"><span class="icon" data-feather="sun"></span></label>
            </div>

        </li>




        <!-- <li class="nav-item"><a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#searchBoxModal"><span
                    data-feather="search" style="height:19px;width:19px;margin-bottom: 2px;"></span></a></li> -->

        <li class="nav-item dropdown">


            <!-- Botón de notificaciones con icono de Bootstrap -->
            <!-- <a id="btnNotificaciones" class="nav-link position-relative" href="#" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <span class="far fa-bell"></span>
            </a> -->

            <!-- Menú desplegable de notificaciones -->
            <div class="dropdown-menu dropdown-menu-end py-0 shadow border navbar-dropdown-caret"
                style="width: 450px !important; margin-right: -10px;">
                <div class="card position-relative border-0">
                    <!-- Cabecera del menú -->
                    <div class="card-header p-2 mt-1">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title mb-0">Notificaciones</h5>
                            <button id="markAllButton" class="btn btn-link p-0 fs-9 fw-normal" type="button">Marcar como
                                leídas</button>
                        </div>
                    </div>

                    <!-- Cuerpo del menú con lista de notificaciones -->
                    <div id="bodyNotificaciones" class="card-body p-0" style="max-height: 500px; overflow-y: auto;">
                        <!-- Notificaciones cargadas por medio del script -->
                    </div>

                    <!-- Pie del menú -->
                    <div class="card-footer p-0 border-top">
                        <div class="my-2 text-center fw-bold fs-10 text-body-tertiary">
                            <a class="fw-bolder" href="#">Historial de notificaciones</a>
                        </div>
                    </div>
                </div>
            </div>
        </li>



        <li class="nav-item dropdown"><a class="nav-link lh-1 pe-0" id="navbarDropdownUser" href="#!" role="button"
                data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                <div class="avatar avatar-l ">
                    <img class="rounded-circle user-avatar" src="assets/img/profile/profile_default.jpg" alt="" />

                </div>
            </a>
            <div class="dropdown-menu dropdown-menu-end navbar-dropdown-caret py-0 dropdown-profile shadow border"
                aria-labelledby="navbarDropdownUser">
                <div class="card position-relative border-0">
                    <div class="card-body p-0">
                        <div class="text-center pt-4 pb-3">
                            <div class="avatar avatar-xl ">
                                <img class="rounded-circle user-avatar" src="assets/img/profile/profile_default.jpg"
                                    alt="" />

                            </div>
                            <h6 class="mt-2 text-body-emphasis username"></h6>
                            <b class="mt-2 text-body-emphasis"><span class="user-role"></span><span
                                    class="user-specialty"></span></b>
                            <div id="admin-container" style="display: none;"></div>
                            <div id="doctor-container" style="display: none;"></div>
                        </div>
                        <!-- <div class="mb-3 mx-3">
                      <input class="form-control form-control-sm" id="statusUpdateInput" type="text" placeholder="Update your status" />
                    </div> -->
                    </div>
                    <div class="overflow-auto scrollbar" style="height: 4rem;">
                        <ul class="nav d-flex flex-column mb-2 pb-1">
                            <!-- <li class="nav-item"><a class="nav-link px-3 d-block" href="apps/social/settings.php"> <span
                    class="me-2 text-body align-bottom" data-feather="user"></span><span>Perfil</span></a></li> -->
                            <li class="nav-item"><a class="nav-link px-3 d-block" href="#settings-offcanvas"
                                    data-bs-toggle="offcanvas"> <span class="me-2 text-body align-bottom"
                                        data-feather="sliders"></span>Personalizar</a></li>
                        </ul>
                    </div>
                    <div class="px-3"> <a class="btn btn-phoenix-secondary d-flex flex-center w-100" id="btn-logout"
                            href="#">
                            <span class="me-2" data-feather="log-out"> </span>Cerrar Sesión</a></div>
                    <div class="my-2 text-center fw-bold fs-10 text-body-quaternary"><a
                            class="text-body-quaternary me-1" href="#!">Privacy policy</a>&bull;<a
                            class="text-body-quaternary mx-1" href="#!">Terms</a>&bull;<a
                            class="text-body-quaternary ms-1" href="#!">Cookies</a></div>
                </div>
            </div>
            </div>
        </li>
    </ul>
</nav>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import NavbarHeader from './react-dist/layout/menu/NavbarHeader.js';

    ReactDOMClient.createRoot(document.getElementById('NavbarHeader')).render(React.createElement(NavbarHeader));

    import {
        userService
    } from './services/api/index.js';
    import {
        getJWTPayload
    } from "./services/utilidades.js";
    import UserManager from './services/userManager.js';
    import {
        authMiddleware
    } from "./Middleware/authMiddleware.js";


    document.addEventListener('DOMContentLoaded', async function() {
        // Aplicar middleware de autenticación
        // authMiddleware();        
        const user = await userService.getByExternalId(getJWTPayload().sub);

        if (user) {
            document.querySelectorAll('.username').forEach(element => {
                element.textContent =
                    `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`;
            })
            document.querySelectorAll('.user-role').forEach(element => {
                element.textContent = user.role.name;
            })
            document.querySelectorAll('.user-specialty').forEach(element => {
                if (user.role.group == 'DOCTOR') {
                    element.textContent = ' | ' + user.specialty.name;
                }
            })
            const menu = await userService.getMenuByRole(user.id);
            const permissionsAuthRoute = await userService.getMenuByRolePermission(user.role.id);

            localStorage.setItem("roles", JSON.stringify(user.role));
            localStorage.setItem("permissionsAuthRoute", JSON.stringify(permissionsAuthRoute.menus));
            localStorage.setItem("menus", JSON.stringify(menu.menus));

            if (window.updateNavbarMenus) {
                window.updateNavbarMenus();
            }
            const avatarUrl = getUrlImage(user.minio_url);

            // console.log(avatarUrl);


            document.querySelectorAll('.user-avatar').forEach(element => {
                element.src = avatarUrl || 'assets/img/profile/profile_default.jpg';
            })

            const adminContainer = document.getElementById('admin-container');
            const doctorContainer = document.getElementById('doctor-container');

            if (user.role.group == 'ADMIN') {

                adminContainer.style.display = 'block';
                const adminContent = document.createElement('p');

                const dayModule = user.availabilities.find(availability => {
                    return availability.days_of_week.includes(new Date().getDay()) && availability
                        .is_active
                }).module.name

                adminContent.textContent = 'Modulo: ' + dayModule;
                adminContainer.appendChild(adminContent);

            } else if (user.role.group == 'DOCTOR') {

                doctorContainer.style.display = 'block';
                const doctorContent = document.createElement('p');

                const dayOffice = user.availabilities.find(availability => {
                    return availability.days_of_week.includes(new Date().getDay())
                })?.office

                doctorContent.textContent = 'Consultorio: ' + (dayOffice || 'Sin consultorio');
                doctorContainer.appendChild(doctorContent);
            }
        }
    })
</script>

<script>
    const themeController = document.body;

    const imgLogo = document.getElementById("imgLogo");

    themeController.addEventListener(
        "clickControl",
        ({
            detail: {
                control,
                value
            }
        }) => {
            if (control === "phoenixTheme") {
                const prStyle = document.getElementById("user-style-pr-default");
                // console.log(control, prStyle);

                // Obtener el modo del tema
                const mode = value === 'auto' ? window.phoenix.utils.getSystemTheme() : value;

                // Cambiar la imagen según el tema
                if (mode === "dark") {
                    //imgLogo.src = "/logo_monaros_sinbg_dark.png";
                    prStyle.href = `assets/css/bootstrap4pr_dark/theme.css`;
                } else {
                    //imgLogo.src = "/logo_monaros_sinbg_light.png";
                    prStyle.href = `assets/css/bootstrap4pr/theme.css`;
                }

            }
        }
    );

    // NOTIFICACIONES 

    // Objeto que contiene las notificaciones
    const notificationsData = {
        notifications: [{
                id: 1,
                user: {
                    name: "Jessie Samson",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "comment",
                message: "Ha comentado tu post",
                time: "10:41",
                date: "2021-08-07",
                read: false
            },
            {
                id: 2,
                user: {
                    name: "MedicalSoft",
                    avatar: null,
                    initials: "M",
                    status: "online"
                },
                type: "event",
                message: "Ha creado un evento",
                time: "10:20",
                date: "2021-08-07",
                read: false
            },
            {
                id: 3,
                user: {
                    name: "Kiera Anderson",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "offline"
                },
                type: "like",
                message: "Le ha gustado tu post",
                time: "09:30",
                date: "2021-08-07",
                read: true
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            },
            {
                id: 4,
                user: {
                    name: "Herman Carter",
                    avatar: "https://i.pinimg.com/736x/6c/6e/d7/6c6ed7f4011b7f926b3f1505475aba16.jpg",
                    status: "online"
                },
                type: "appointment",
                message: "Ha solicitado una cita",
                time: "09:11",
                date: "2021-08-07",
                read: false
            }
        ],
        unreadCount: 3
    };

    const notificationIcons = {
        comment: "💬",
        event: "📅",
        like: "👍",
        appointment: "🗓️",
        system: "⚙️",
        default: "🔔"
    };

    function getNotificationIcon(type) {
        return notificationIcons[type] || notificationIcons.default;
    }

    // Función para renderizar las notificaciones
    function renderNotifications() {
        const notificationsContainer = document.getElementById('bodyNotificaciones');

        // Limpiar contenedor primero
        notificationsContainer.innerHTML = '';

        // Ordenar notificaciones (no leídas primero)
        const sortedNotifications = [...notificationsData.notifications].sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeB - dateTimeA; // Orden descendente (más reciente primero)
        });

        // Crear elementos para cada notificación
        sortedNotifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className =
                `px-2 px-sm-3 py-3 notification-card position-relative border-bottom ${notification.read ? 'read' : 'unread'}`;

            // Determinar clase de estado (online/offline)
            const statusClass = notification.user.status === 'online' ? 'status-online' : 'status-offline';

            // Crear avatar (imagen o iniciales)
            let avatarHtml;
            if (notification.user.avatar) {
                avatarHtml =
                    `<img class="rounded-circle" src="${notification.user.avatar}" alt="${notification.user.name}">`;
            } else {
                avatarHtml =
                    `<span class="avatar-name rounded-circle bg-primary text-white" style="padding: 0.3rem !important;">${notification.user.initials}</span>`;
            }

            const notificationIcon = getNotificationIcon(notification.type);

            notificationElement.innerHTML = `
      <div class="d-flex align-items-center">
        <div class="avatar avatar-m me-3"">
          ${avatarHtml}
        </div>
        <div class="flex-1 me-sm-3">
          <h6 class="fs-9 text-primary mb-1">${notification.user.name}</h6>
          <p class="fs-9 text-body-highlight mb-1 fw-normal">
            <span class="me-1">${notificationIcon}</span>${notification.message}
          </p>
          <p class="text-body-secondary fs-9 mb-0 d-flex align-items-center">
            <i class="far fa-clock me-1" style="width: 0.7rem; opacity: 0.5"></i>
            <span class="fms-2 text-body-quaternary text-opacity-75 fw-bold fs-10">${notification.time} - ${notification.date}</span>
          </p>
        </div>
        ${!notification.read ? '<span class="position-absolute top-50% end-0 p-1 bg-primary rounded-circle" style="margin-right: 0.3rem"></span>' : ''}
      </div>
    `;

            notificationsContainer.appendChild(notificationElement);
        });

        // Actualizar indicador de notificaciones no leídas
        updateUnreadIndicator();
    }

    // Función para actualizar el indicador de notificaciones no leídas (círculo)
    function updateUnreadIndicator() {
        const unreadCount = notificationsData.notifications.filter(n => !n.read).length;
        const bellIconContainer = document.getElementById('btnNotificaciones');

        // Limpiar cualquier indicador existente
        const existingIndicator = document.getElementById('notification-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Agregar nuevo indicador si hay notificaciones no leídas
        if (unreadCount > 0) {
            const indicator = document.createElement('span');
            indicator.className = 'notification-indicator';
            indicator.id = 'notification-indicator';
            indicator.style.position = 'absolute';
            indicator.style.top = '20%';
            indicator.style.right = '3px';
            indicator.style.width = '0.6rem';
            indicator.style.height = '0.6rem';
            indicator.style.backgroundColor = '#dc3545';
            indicator.style.borderRadius = '50%';
            indicator.style.border = '2px solid white';
            bellIconContainer.appendChild(indicator);
        }
    }

    // Función para marcar todas las notificaciones como leídas
    function markAllAsRead() {
        notificationsData.notifications.forEach(notification => {
            notification.read = true;
        });
        notificationsData.unreadCount = 0;
        renderNotifications();
    }

    // Inicializar cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        // Renderizar notificaciones iniciales
        renderNotifications();

        // Asignar evento al botón "Marcar como leídas"
        const markAllButton = document.getElementById('markAllButton');
        if (markAllButton) {
            markAllButton.addEventListener('click', markAllAsRead);
        }
    });
</script>