<div class="modal fade" id="newCustomerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo Cliente</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <form class="row g-3" id="customerForm">
                    <div class="col-md-6">
                        <label class="form-label" for="firstName">Nombre</label>
                        <input class="form-control" id="firstName" name="firstName" type="text">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="lastName">Apellido</label>
                        <input class="form-control" id="lastName" name="lastName" type="text">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="documentType">Tipo de documento</label>
                        <input class="form-control" id="documentType" name="documentType" type="text">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="dni">Número</label>
                        <input class="form-control" id="dni" name="dni" type="number">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="email">Email</label>
                        <input class="form-control" id="email" name="email" type="email">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="phone">Teléfono</label>
                        <input class="form-control" id="phone" name="phone" type="tel">
                    </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="submit">Aceptar</button>
            </div>
            </form>
        </div>
    </div>
</div>

<script>
    document.getElementById('customerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        // Captura los datos del formulario
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            documentType: document.getElementById('documentType').value,
            dni: document.getElementById('dni').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        // Envía los datos al backend
        sendDataToBackend(formData);
    });

    function sendDataToBackend(data) {

        fetch('http://localhost:8000/api/v1/customer-branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // console.log('Success:', data);
                // Aquí puedes manejar la respuesta del backend, por ejemplo, mostrar un mensaje de éxito

                // Cierra el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('newCustomerModal'));
                modal.hide();
            })
            .catch((error) => {
                console.error('Error:', error);
                // Aquí puedes manejar los errores, por ejemplo, mostrar un mensaje de error
            });
    }


</script>