function changeAjaxFast(table, columnChange, value, columnWhere , idWhere , toast = false) {
    console.log("Funcion");
    
    $.ajax({
        type: "POST",
        url: `${baseSitema}js/Ajax_Change_Fast.php`,
        data: {
            'action': 'changeAjaxFast',
            'table': table,
            'columnChange': columnChange,
            'value': value,
            'columnWhere': columnWhere,
            'idWhere': idWhere
        },
        success: function(response) {
            console.log("Response");
            console.log(response);
            if (response == "ok") {
                if (toast) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Actualizado',
                        showConfirmButton: false,
                        timer: 1500,
                        toast: true,
                        timerProgressBar: true,
                        position : 'top-end'
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
                        position : 'top-end'
                    })
                }
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
        }
    })
}