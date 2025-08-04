<form id="formCrearIncapacidad">
    <div class="row">
        <div class="col-12">
            <div class="mt-3">
                <label for="selectTipo" class="form-label">¿Cómo desea agregar las vacunas?</label>
                <select class="form-select" id="selectTipo">
                    <option value="" disabled selected>Seleccione una opción</option>
                    <option value="manual">Manual</option>
                    <option value="inventario">Desde inventario</option>
                </select>
            </div>
            <div class="mt-3" id="divSelectVacunas" style="display: none;">
                <select class="form-select" id="selectVacunas"></select>
            </div>
            <div class="mt-3" id="divInputVacuna" style="display: none;">
                <input type="text" class="form-control" id="inputVacuna" placeholder="Nombre de la vacuna">
                <!-- <div class="text-end mt-3">
                    <button id="btnNuevaVacuna" class="btn btn-primary" type="button"><span
                            class="fa-solid fa-plus me-2 fs-9"></span>Agregar</button>
                </div> -->
            </div>
            <div class="text-end mt-3" id="divBtnVacunas">
                <button id="btnVacunas" class="btn btn-primary" type="button">
                    <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar
                </button>
            </div>
            <div class="mt-3" id="vacunasAgregadas" style="display: none;">

            </div>
        </div>
    </div>
</form>

<script type="module">
import {
    farmaciaService
} from "./services/api/index.js";

const divSelectVacunas = document.getElementById("divSelectVacunas");
const divInputVacuna = document.getElementById("divInputVacuna");
const divBtnVacunas = document.getElementById("divBtnVacunas");

document.getElementById("selectTipo").addEventListener("change", function() {
    if (this.value === "manual") {
        divSelectVacunas.style.display = "none";
        divInputVacuna.style.display = "block";
    } else if (this.value === "inventario") {
        divInputVacuna.style.display = "none";
        divSelectVacunas.style.display = "block";
    }
});

const selectVacunas = document.getElementById("selectVacunas");
let choicesInstance;

async function cargarVacunas() {
    const vacunas = await farmaciaService.getAllVacunas();
    // console.log("Vacunas: ", vacunas);

    selectVacunas.innerHTML = "";

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione una vacuna";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectVacunas.appendChild(placeholderOption);

    vacunas.forEach(vacuna => {
        const option = document.createElement("option");
        option.value = vacuna.id;
        option.textContent = vacuna.name;
        selectVacunas.appendChild(option);
    });

    // console.log("selectVacunas: ", selectVacunas);
    selectMultiple();
}

function selectMultiple() {
    selectVacunas.setAttribute('multiple', 'multiple');

    if (typeof Choices !== 'undefined') {
        const choices = new Choices(selectVacunas, {
            removeItemButton: true,
            placeholder: true
        });
    }
}

function eliminarFila(event) {
    const boton = event.currentTarget;
    const fila = boton.closest('tr');
    fila.remove();

    const tbody = document.querySelector("#tablaVacunas tbody");
    if (tbody && tbody.children.length === 0) {
        document.getElementById("vacunasAgregadas").style.display = "none";
    }
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll("#tablaVacunas tbody button");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarFila);
    });
}

function resetearSelect() {
    if (choicesInstance) {
        choicesInstance.removeActiveItems(); // Elimina todas las opciones seleccionadas
    }
}

document.addEventListener("DOMContentLoaded", function() {
    cargarVacunas();
});

document.getElementById("btnVacunas").addEventListener("click", function() {
    const tipo = document.getElementById("selectTipo").value;
    let opcionesSeleccionadas = [];

    if (tipo === "inventario") {
        opcionesSeleccionadas = Array.from(selectVacunas.selectedOptions).filter(option => option.value !== "")
            .map(option => ({
                value: option.value,
                text: option.textContent
            }))
    } else if (tipo === "manual") {
        const inputVacuna = document.getElementById("inputVacuna");
        const vacuna = inputVacuna.value.trim();

        if (vacuna === "") {
            alert("Por favor, ingresa el nombre de la vacuna.");
            return;
        }

        opcionesSeleccionadas = [{
            value: vacuna.toLowerCase().replace(/\s+/g, "-"),
            text: vacuna
        }];

        inputVacuna.value = "";
    }

    generarTablaVacunas(opcionesSeleccionadas);
});

function generarTablaVacunas(opcionesSeleccionadas) {
    const vacunasAgregadas = document.getElementById("vacunasAgregadas");
    let tablaVacunas = "";

    if (vacunasAgregadas.innerHTML.trim() === "") {
        tablaVacunas = `
        <div style="width: 100%; margin: 0 auto;">
        <table class="table text-center" id="tablaVacunas">
            <thead>
                <tr>
                    <th width="30%">Vacuna</th>
                    <th width="20%">Dosis</th>
                    <th width="20%">Esquema</th>
                    <th width="20%">Refuerzo</th>
                    <th width="10%">Eliminar</th>
                </tr>
            </thead>
            <tbody>`
    } else {
        const tbody = document.querySelector("#tablaVacunas tbody");
        tablaVacunas = `
        <div style="width: 100%; margin: 0 auto;"></div>
        <table class="table text-center" id="tablaVacunas">
            <thead>
                <tr>
                    <th width="30%">Vacuna</th>
                    <th width="20%">Dosis</th>
                    <th width="20%">Esquema</th>
                    <th width="20%">Refuerzo</th>
                    <th width="10%">Eliminar</th>
                </tr>
            </thead>
            <tbody>
            ${tbody.innerHTML}
        `;
    }

    opcionesSeleccionadas.forEach(vacuna => {
        tablaVacunas += `
        <tr>
            <td>${vacuna.text}</td>
            <td>
                <input type="number" min="1" id="dosisVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: 1" style="width: 90%;">
            </td>
            <td>
                <input type="text" min="1" id="esquemaVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: 0-6 meses" style="width: 90%;">
            </td>
            <td>
                <input type="text" min="1" id="refuerzoVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: Anual" style="width: 90%;">
            </td>
            <td>
                <button class="btn btn-danger btn-sm"><span class="fa-solid fa-trash"></span></button>
            </td>
        </tr>`;
    });

    tablaVacunas += `
            </tbody>
        </table>
        </div>`;

    // <div class="text-end">
    //         <button id="btnPrueba" class="btn btn-primary" type="button">
    //             <span class="fa-solid fa-plus me-2 fs-9"></span></button>
    //     </div>`;

    vacunasAgregadas.innerHTML = tablaVacunas;
    vacunasAgregadas.style.display = "block";
}

// document.getElementById("btnVacunas").addEventListener("click", function() {
//     const opcionesSeleccionadas = Array.from(selectVacunas.selectedOptions).filter(option => option.value !==
//         "").map(option => ({
//         value: option.value,
//         text: option.textContent
//     }));

//     const vacunasAgregadas = document.getElementById("vacunasAgregadas");

//     if (opcionesSeleccionadas.length > 0) {
//         let tablaVacunas = `
//         <div style="width: 100%; margin: 0 auto;">
//         <table class="table text-center" id="tablaVacunas">
//             <thead>
//                 <tr>
//                     <th width="30%">Vacuna</th>
//                     <th width="20%">Dosis</th>
//                     <th width="20%">Esquema</th>
//                     <th width="20%">Refuerzo</th>
//                     <th width="10%">Eliminar</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//         opcionesSeleccionadas.forEach(vacuna => {
//             tablaVacunas += `
//         <tr>
//             <td>${vacuna.text}</td>
//             <td>
//                 <input type="number" min="1" id="dosisVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: 1" style="width: 90%;">
//             </td>
//             <td>
//                 <input type="text" min="1" id="esquemaVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: 0-6 meses" style="width: 90%;">
//             </td>
//             <td>
//                 <input type="text" min="1" id="refuerzoVacuna_${vacuna.value}" class="form-control form-control-sm mx-auto" placeholder="Ej: Anual" style="width: 90%;">
//             </td>
//             <td>
//                 <button class="btn btn-danger btn-sm"><span class="fa-solid fa-trash"></span></button>
//             </td>
//         </tr>`;
//         });

//         tablaVacunas += `
//             </tbody>
//         </table>
//         </div>

//         <div class="text-end">
//                 <button id="btnPrueba" class="btn btn-primary" type="button">
//                     <span class="fa-solid fa-plus me-2 fs-9"></span></button>
//             </div>`;

//         vacunasAgregadas.innerHTML = tablaVacunas;
//         vacunasAgregadas.style.display = "block";

//         agregarEventosEliminar();
//         resetearSelect();
//     } else {
//         alert("Seleccione al menos una vacuna");
//     }
// });

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnPrueba') {
        capturarDatosVacunas();
    }
});

// function capturarDatosVacunas() {
//     const tablaVacunas = document.getElementById("tablaVacunas");

//     if (!tablaVacunas) {
//         console.error("No se encontró la tabla de vacunas");
//         return;
//     }

//     const filas = tablaVacunas.querySelectorAll("tbody tr"); 
//     const dataVacunas = [];

//     filas.forEach(fila => {
//         const celdas = fila.querySelectorAll("td"); 

//         if (celdas.length >= 2) { 
//             const nombreVacuna = celdas[0].textContent.trim();
//             const inputDosis = celdas[1].querySelector("input");
//             const esquema = celdas[2].querySelector("input").value;
//             const refuerzo = celdas[3].querySelector("input").value;

//             if (inputDosis) {
//                 const dosis = inputDosis.value;

//                 if (dosis && dosis > 0) {
//                     dataVacunas.push({
//                         nombre: nombreVacuna,
//                         dosis: parseInt(dosis),
//                         scheme: esquema,
//                         booster_frequency: refuerzo
//                     });
//                 }
//             }
//         }
//     });

//     console.log("Vacunas seleccionadas:", dataVacunas);

// }
</script>

<script>
// const vacunas = [{
//         id: 1,
//         nombre: "Vaxigrip Tetra",
//         lote: "AB123",
//         dosis: "0.5 ml"
//     },
//     {
//         id: 2,
//         nombre: "Fluzone High-Dose Quadrivalent",
//         lote: "CD456",
//         dosis: "0.7 ml"
//     },
//     {
//         id: 3,
//         nombre: "Pfizer-BioNTech",
//         lote: "EF789",
//         dosis: "0.3 ml"
//     },
//     {
//         id: 4,
//         nombre: "Moderna",
//         lote: "GH012",
//         dosis: "0.5 ml"
//     },
//     {
//         id: 5,
//         nombre: "AstraZeneca",
//         lote: "IJ345",
//         dosis: "0.5 ml"
//     },
//     {
//         id: 6,
//         nombre: "Priorix",
//         lote: "KL678",
//         dosis: "0.5 ml"
//     },
//     {
//         id: 7,
//         nombre: "Boostrix",
//         lote: "MN901",
//         dosis: "0.5 ml"
//     },
//     {
//         id: 8,
//         nombre: "Adacel",
//         lote: "OP234",
//         dosis: "0.5 ml"
//     }
// ];

// const selectVacunas = document.getElementById("selectVacunas");
// let choicesInstance;

// function cargarVacunas() {
//     selectVacunas.innerHTML = "";

//     const placeholderOption = document.createElement("option");
//     placeholderOption.value = "";
//     placeholderOption.textContent = "Seleccione una vacuna";
//     placeholderOption.disabled = true;
//     placeholderOption.selected = true;
//     selectVacunas.appendChild(placeholderOption);

//     vacunas.forEach(vacuna => {
//         const option = document.createElement("option");
//         option.value = vacuna.id;
//         option.textContent = vacuna.nombre;
//         selectVacunas.appendChild(option);
//     });
// }
</script>