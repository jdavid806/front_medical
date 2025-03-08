<div class="modal fade" id="nuevaNotaModal" tabindex="-1" aria-labelledby="nuevaNotaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="nuevaNotaModalLabel">Nueva Nota</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevaNota">
                    <!-- Campo Título -->
                    <div class="mb-3">
                        <label for="tituloNota" class="form-label">Título</label>
                        <input type="text" class="form-control" id="tituloNota" placeholder="Ingrese el título de la nota" required>
                    </div>

                    <!-- Select Enfermera -->
                    <div class="mb-3">
                        <label for="user_id" class="form-label">Seleccione la enfermera</label>
                        <select class="form-select" id="user_id" required>
                            <option value="" disabled selected>Seleccione una opción</option>
                        </select>
                    </div>

                    <!-- Text Area Nota -->
                    <div class="mb-3">
                        <label for="note" class="form-label">Nota</label>
                        <textarea class="form-control" id="note" rows="4" placeholder="Escriba la nota aquí" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" id="guardarNota" form="formNuevaNota" class="btn btn-primary">Guardar Nota</button>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        usersSelect
    } from "./services/selects.js";

    document.addEventListener('DOMContentLoaded', function() {
        usersSelect(document.getElementById('user_id'))
    })
</script>
<script type="module" src="./NotasEnfermeria/js/modalNotasEnfermeria.js"></script>