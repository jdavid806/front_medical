<?php
include '../data/mocks.php';
?>

<div class="modal fade modal-xl" id="modalUserRole" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addUserRolModal" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
        <form class="needs-validation modal-content" novalidate>
            <div class="modal-header">
                <h5 class="mb-0" id="header-modal-user-role">Nuevo Rol de Usuario</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label class="form-label">Nombre</label>
                        <input type="text" required class="form-control" id="rol-name">
                        <div class="invalid-feedback">Por favor escriba un nombre valido.</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-1">
                        <div class="card">
                            <div class="card-header">
                                <h5>Menús</h5>
                            </div>
                            <div class="card-body">
                                <div class="list-group" id="rol-menu-list">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-1">
                        <div class="card">
                            <div class="card-header">
                                <h5>Permisos</h5>
                            </div>
                            <div class="card-body">
                                <div class="list-group" id="rol-permissions-list">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <input type="hidden" id="id" value="0">
            <input type="hidden" id="idUsuario" value="<?= $_SESSION['ID'] ?>">

            <div class="modal-footer">
                <button type="button" class="btn btn-link text-danger px-3 my-0" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left"></i> &nbsp; Cerrar</button>
                <button type="button" class="btn btn-primary my-0" onclick="onSubmitUserRole()" id="button-save-user-role"><i class="fas fa-bookmark"></i> &nbsp; Crear Rol de Usuario</button>
            </div>
        </form>
    </div>
</div>

<script>
    function onSubmitUserRole() {
        let data = {
            id: $("#modalUserRole #id").val(),
            name: $("#name").val()
        };

        console.log(data);

        const currentForm = document.getElementById(`modalUserRole`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            $("#modalUserRole").modal('hide');
            resetModalNewUserRole();
        }
    }

    function resetModalNewUserRole() {
        $("#header-modal-user-role").html(`<i class="fas fa-user"></i> Nuevo Rol de Usuario`);
        $("#button-save-user-role").html(`<i class="fas fa-bookmark"></i> &nbsp; Crear Rol de Usuario`);

        $("#modalUserRole #id").val("0");
        $("#name").val("");
    }

    function deleteUserRole(id) {
        Swal.fire({
            title: '¿Deseas eliminar este rol de usuario?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Eliminando rol de usuario");
            }
        });
    }

    function editUserRole(id, index) {
        $("#header-modal-user-role").html(`Editar rol de usuario`);
        $("#button-save-user-role").html(`Actualizar rol de usuario`);
        $("#modalUserRole #id").val(id);

        const data = JSON.parse(
            document.getElementById("data_user_role_" + index).value
        );

        console.log(data);

        $("#rol-name").val(data.name);
        $("#modalUserRole").modal('show');
    }

    $('#modalUserRole').on('hidden.bs.modal', function() {
        resetModalNewUserRole();
    });
</script>
<script type="module">
    import {
        menuService,
        permissionService
    } from '../services/api/index.js';

    async function getMenuList() {
        try {
            const data = await menuService.getAll();
            const menuList = document.getElementById('rol-menu-list');
            menuList.innerHTML = "";
            data.forEach(menu => {
                let menuItem = document.createElement('div');
                menuItem.classList.add('form-check', 'form-switch');
                let menuSwitch = document.createElement('input');
                menuSwitch.classList.add('form-check-input');
                menuSwitch.type = 'checkbox';
                menuSwitch.dataset.menuId = menu.id;
                let menuLabel = document.createElement('label');
                menuLabel.classList.add('form-check-label');
                menuLabel.onclick = function() {
                    menuSwitch.checked = !menuSwitch.checked;
                }
                menuLabel.innerHTML = menu.name;
                menuItem.appendChild(menuSwitch);
                menuItem.appendChild(menuLabel);
                menuList.appendChild(menuItem);
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function getPermissionsList() {
        try {
            const data = await permissionService.getAll();
            const permissionsList = document.getElementById('rol-permissions-list');
            permissionsList.innerHTML = "";
            data.forEach(permission => {
                let permissionItem = document.createElement('div');
                let permissionTitle = document.createElement('h5');
                permissionTitle.innerHTML = permission.name;
                permissionTitle.classList.add('mb-2');
                permissionItem.appendChild(permissionTitle);

                permission.permissions.forEach(subPermission => {
                    let subPermissionItem = document.createElement('div');
                    subPermissionItem.classList.add('form-check', 'form-switch');
                    let subPermissionSwitch = document.createElement('input');
                    subPermissionSwitch.classList.add('form-check-input');
                    subPermissionSwitch.type = 'checkbox';
                    subPermissionSwitch.dataset.permissionId = subPermission.key;
                    let subPermissionLabel = document.createElement('label');
                    subPermissionLabel.classList.add('form-check-label');
                    subPermissionLabel.innerHTML = subPermission.name;
                    subPermissionLabel.onclick = function() {
                        subPermissionSwitch.checked = !subPermissionSwitch.checked;
                    }
                    subPermissionItem.appendChild(subPermissionSwitch);
                    subPermissionItem.appendChild(subPermissionLabel);
                    permissionItem.appendChild(subPermissionItem);
                });

                permissionsList.appendChild(permissionItem);

                let separator = document.createElement('hr');
                permissionsList.appendChild(separator);
            });
        } catch (error) {
            console.log(error);
        }
    }

    getMenuList();
    getPermissionsList();
</script>