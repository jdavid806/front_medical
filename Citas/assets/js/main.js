document.addEventListener("DOMContentLoaded", function() {
    // Inicializar columnas como áreas de arrastre
    const columns = document.querySelectorAll(".column");
    columns.forEach(column => {
      new Sortable(column, {
        group: "shared", // Permite mover tareas entre columnas
        animation: 150,
        onAdd: function(evt) {
          const task = evt.item;
          const newColumn = evt.to;
          const status = newColumn.getAttribute("data-status");
          const taskId = task.getAttribute("data-id");

          Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres mover la tarea a '${status}'?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, mover',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {

              console.log(`Tarea con ID '${taskId}' movida a '${status}'`);
              // Llamada AJAX para guardar el cambio en el servidor (preparado para implementación futura)
            } else {

              evt.from.appendChild(task);
            }
          });
        }
      });
    });
  });