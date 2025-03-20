<?php include "../menu.php" ?> 

<div class="content">
    <div class="container-small">
        <div class="pb-9">
            <div class="text-center">
                <h2 class="mb-4">Visualizar Documento</h2>
            </div>
            <div class="document-content">
                <div class="card">
                    <div class="card-body" id="document-container">
                        <p class="text-center text-muted">Cargando documento...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // Función para obtener parámetros de la URL
    function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Datos de documentos
    const documentos = [
      { id: 1, tipo: "incapacidad", titulo: "Incapacidad Médica", content: "documento 1" },
      { id: 2, tipo: "historia", titulo: "Historia Clínica", content: "documento 2" },
      { id: 3, tipo: "receta", titulo: "Receta Médica", content: "documento 3" },
      { id: 4, tipo: "examen", titulo: "Examen Diagnóstico", content: "documento 4" },
      { id: 5, tipo: "factura", titulo: "Factura de Servicios", content: "documento 5" },
      { id: 6, tipo: "incapacidad", titulo: "Incapacidad Laboral", content: "documento 6" },
      { id: 7, tipo: "historia", titulo: "Historial de Paciente", content: "documento 7" },
      { id: 8, tipo: "receta", titulo: "Prescripción Médica", content: "documento 8" },
      { id: 9, tipo: "examen", titulo: "Resultado de Laboratorio", content: "documento 9" },
      { id: 10, tipo: "factura", titulo: "Comprobante de Pago", content: "documento 10" }
    ];

    // Obtener el ID de la URL
    const documentId = getParameterByName('id');
    
    // Función para mostrar el documento
    function mostrarDocumento() {
        const container = document.getElementById('document-container');
        
        // Si no hay ID o no es un número, mostrar mensaje
        if (!documentId) {
            container.innerHTML = '<div class="alert alert-warning">No se especificó un ID de documento</div>';
            return;
        }
        
        // Buscar el documento en el array
        const documento = documentos.find(doc => doc.id === parseInt(documentId));
        
        // Mostrar el documento o un mensaje de error
        if (documento) {
            container.innerHTML = `
                <h3>${documento.titulo}</h3>
                <hr>
                <div class="mt-3">
                    ${documento.content}
                </div>
            `;
        } else {
            container.innerHTML = `<div class="alert alert-danger">No se encontró ningún documento con ID ${documentId}</div>`;
        }
    }

    // Llamar a la función cuando la página cargue
    document.addEventListener('DOMContentLoaded', mostrarDocumento);
</script>