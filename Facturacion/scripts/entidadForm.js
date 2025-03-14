
  const procedimientos = [{
      id: 1,
      nombre: "procedimiento 1"
    },
    {
      id: 2,
      nombre: "procedimiento 2"
    },
    {
      id: 3,
      nombre: "procedimiento 3"
    }
  ];
  const especialistas = [{
      id: 1,
      nombre: "especialista 1"
    },
    {
      id: 2,
      nombre: "especialista 2"
    },
    {
      id: 3,
      nombre: "especialista 3"
    }
  ];

  const pacientes = [{
      id: "11000",
      nombre: "paciente 1"
    },
    {
      id: "90192",
      nombre: "paciente 2"
    },
    {
      id: "9201",
      nombre: "paciente 3"
    }
  ];


  function cargarProcedimientos() {
    const selectProcedimientos = document.getElementById('procedureModal');

    selectProcedimientos.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los procedimientos";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectProcedimientos.appendChild(placeholderOption);

    procedimientos.forEach(procedimiento => {
      const optionProc = document.createElement('option');

      optionProc.value = procedimiento.id;
      optionProc.textContent = procedimiento.nombre;

      selectProcedimientos.appendChild(optionProc);
    });
  }

  function cargarEspecialistas() {
    const selectEspecialistas = document.getElementById('specialityModal');

    selectEspecialistas.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los especialistas";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectEspecialistas.appendChild(placeholderOption);

    especialistas.forEach(especialista => {
      const optionEsp = document.createElement('option');

      optionEsp.value = especialista.id;
      optionEsp.textContent = especialista.nombre;

      selectEspecialistas.appendChild(optionEsp);
    });
  }

  function cargarPacientes() {
    const selectPacientes = document.getElementById('patientsModal');

    selectPacientes.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los pacientes";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectPacientes.appendChild(placeholderOption);

    pacientes.forEach(paciente => {
      const optionPac = document.createElement('option');

      optionPac.value = paciente.id;
      optionPac.textContent = paciente.nombre;

      selectPacientes.appendChild(optionPac);
    });
  }

  
  function configurarSelectProcedimientosMultiple() {
    const procedureModal = document.getElementById('procedureModal');

    procedureModal.setAttribute('multiple', 'multiple');

    // Choices.js
    if (typeof Choices !== 'undefined') {
      const choices = new Choices(procedureModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }


  function configurarSelectEspecialistasMultiple() {
    const specialityModal = document.getElementById('specialityModal');
    specialityModal.setAttribute('multiple', 'multiple');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(specialityModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  function configurarSelectPacientesMultiple() {
    const patientsModal = document.getElementById('patientsModal');
    patientsModal.setAttribute('multiple', 'multiple');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(patientsModal, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    cargarProcedimientos(procedimientos);
    cargarEspecialistas(especialistas);
    cargarPacientes(pacientes);
    configurarSelectProcedimientosMultiple();
    configurarSelectEspecialistasMultiple();
    configurarSelectPacientesMultiple();
  });
