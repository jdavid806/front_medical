<script>
    function borrarRetardo(indice) {
        Swal.fire({
            title: "¿Deseas borrar y olvidar el retardo?",
            text: "Esta accion no se puede deshacer",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            confirmButtonClass: "btn btn-phoenix-primary",
        }).then((result) => {
            if (result.isConfirmed) {
                $("#filaRetardo" + indice).remove();
            }
        })
    }
    
    function borrarAusencia(indice) {
        Swal.fire({
            title: "¿Deseas borrar y olvidar la ausencia?",
            text: "Esta accion no se puede deshacer",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            confirmButtonClass: "btn btn-phoenix-primary",
        }).then((result) => {
            if (result.isConfirmed) {
                $("#filaInasistencia" + indice).remove();
            }
        })
    }
    
    function borrarRecargo(indice) {
        Swal.fire({
            title: "¿Deseas borrar y olvidar este recargo?",
            text: "Esta accion no se puede deshacer",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            confirmButtonClass: "btn btn-phoenix-primary",
        }).then((result) => {
            if (result.isConfirmed) {
                $("#filaRecargo" + indice).remove();
            }
        })
    }
</script>
