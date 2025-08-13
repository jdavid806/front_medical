import { DisabilityData } from "./DisabilityData";
import { DisabilityTableColumn } from "./table-types";

const columns: DisabilityTableColumn[] = [
  { field: "admittedBy", header: "Admitido por" },
  { field: "patientName", header: "Paciente" },
  { field: "requestedBy", header: "Solicitado por" },
  { field: "requestedAt", header: "Solicitado el" },
  { field: "reason", header: "Razón de la anulación" },
  {
    field: "",
    header: "",
    body: (rowData: DisabilityData) => (
      <>
        <button
          className="btn btn-link"
          onClick={() => { } }
        >
          <i
            className="fs-7 fa-solid fa-eye cursor-pointer"
            title="Ver historia clinica"
          ></i>
        </button>
        <button
          className="btn btn-link"
          onClick={() => openResolveRequestModal(rowData.requestId)}
        >
          <i
            className="fs-7 fa-solid fa-file-signature cursor-pointer"
            title="Resolver solicitud"
          ></i>
        </button>
      </>
    ),
  },
];
