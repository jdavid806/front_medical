import { patientService } from "../../services/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
    patientService.getAll();
    
    const pacientesData = JSON.parse(document.getElementById("pacientesData").textContent);
    const itemsPerPage = 6; // Número de pacientes por página
  
    // Función para filtrar y mostrar los pacientes
    const filterPacientes = () => {
      const searchText = document.getElementById("searchPaciente").value.toLowerCase().trim();
      const fechaInicio = document.getElementById("fechaInicio").value ? new Date(document.getElementById("fechaInicio").value).setHours(0, 0, 0, 0) : null;
      const fechaFin = document.getElementById("fechaFin").value ? new Date(document.getElementById("fechaFin").value).setHours(23, 59, 59, 999) : null;
      const status = document.getElementById("statusPaciente").value;
  
      const filteredPacientes = pacientesData.filter(paciente => {
        let isMatch = true;
  
        // Filtro de búsqueda por nombre o documento
        if (searchText && !paciente.nombre.toLowerCase().includes(searchText) && !paciente.Documento.toLowerCase().includes(searchText)) {
          isMatch = false;
        }
  
        // Filtro de fechas
        const fechaPaciente = new Date(paciente.fechaConsulta).setHours(0, 0, 0, 0);
        if (fechaInicio && fechaPaciente < fechaInicio) isMatch = false;
        if (fechaFin && fechaPaciente > fechaFin) isMatch = false;
  
        // Filtro por status
        if (status && paciente.status !== status) isMatch = false;
  
        return isMatch;
      });
  
      renderPacientes(filteredPacientes);
      renderPagination(filteredPacientes);
    };
  
    // Función para renderizar las tarjetas de pacientes
    const renderPacientes = (pacientes) => {
      const pacientesList = document.getElementById("pacientesList");
      pacientesList.innerHTML = ""; // Limpiar los resultados anteriores
  
      // Obtener la página actual desde el parámetro en la URL o predeterminado
      const currentPage = getCurrentPage();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedPacientes = pacientes.slice(startIndex, startIndex + itemsPerPage);
  
      paginatedPacientes.forEach(paciente => {
        const cardHtml = `
          <div class="col">
            <div class="card h-100 hover-actions-trigger">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="avatar-group">
                    <a class="d-inline-block ml-2" href="#" role="button">
                      <div class="avatar avatar-m rounded-circle">
                        <img class="rounded-circle" src="${paciente.foto}" alt="" />
                      </div>
                    </a>
                  </div>
                  <div class="d-flex flex-column align-items-start mb-2">
                    <p class="fw-bold mb-0 text-truncate lh-1">Documento: ${paciente.Documento}</p>
                  </div>
                  <div class="top-0 end-0 mt-4 me-4">
                    <button class="btn btn-primary btn-icon" onclick="window.location.href='verPaciente?${paciente.Documento}'">
                      <span class="fa-solid fa-chevron-right"></span>
                    </button>
                  </div>
                </div>
                <span class="badge badge-phoenix fs-10 mb-4 badge-phoenix-${paciente.status === 'Atendido' ? 'danger' : (paciente.status === 'En espera' ? 'warning' : 'success')}">${paciente.status}</span>
                <p class="fw-bold mb-0">Nombre: ${paciente.nombre}</p>
                <p class="fw-bold mb-0">Edad: ${paciente.edad} Años</p>
                <p class="fw-bold mb-0">Fecha de Consulta: ${paciente.fechaConsulta}</p>
              </div>
            </div>
          </div>`;
  
        pacientesList.innerHTML += cardHtml;
      });
    };
  
    // Función para renderizar los controles de paginación
    const renderPagination = (pacientes) => {
      const totalPages = Math.ceil(pacientes.length / itemsPerPage);
      const paginationControls = document.getElementById("paginationControls");
      paginationControls.innerHTML = ""; // Limpiar los controles anteriores
  
      if (totalPages > 1) {
        const currentPage = getCurrentPage();
        let paginationHtml = `<ul class="pagination">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">&laquo;</a>
            </li>`;
  
        for (let page = 1; page <= totalPages; page++) {
          paginationHtml += `<li class="page-item ${page === currentPage ? 'active' : ''}">
              <a class="page-link" href="#" onclick="changePage(${page})">${page}</a>
            </li>`;
        }
  
        paginationHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">&raquo;</a>
          </li></ul>`;
  
        paginationControls.innerHTML = paginationHtml;
      }
    };
  
    const getCurrentPage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return parseInt(urlParams.get("page") || "1");
    };
  
    const changePage = (page) => {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("page", page);
      window.location.search = urlParams.toString();
    };
  
    document.getElementById("searchPaciente").addEventListener("input", filterPacientes);
    document.getElementById("fechaInicio").addEventListener("input", filterPacientes);
    document.getElementById("fechaFin").addEventListener("input", filterPacientes);
    document.getElementById("statusPaciente").addEventListener("change", filterPacientes);
  
    filterPacientes();
  });
  
  // Importar servicios externos (API)


  