import React from "react";

export const EstimatesTableActions = () => {
  return (
    <div className="text-end align-middle">
      <div className="dropdown">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i data-feather="settings"></i> Acciones
        </button>
        <ul className="dropdown-menu" style={{ zIndex: 10000 }}>
          <li>
            <a className="dropdown-item" href="#" data-column="editar">
              <div className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-pen" style={{ width: "20px" }}></i>
                <span>Editar</span>
              </div>
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" data-column="eliminar">
              <div className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-trash" style={{ width: "20px" }}></i>
                <span>Eliminar</span>
              </div>
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" data-column="imprimir">
              <div className="d-flex gap-2 align-items-center">
                <i className="fa-solid fa-print" style={{ width: "20px" }}></i>
                <span>Imprimir</span>
              </div>
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" data-column="descargar">
              <div className="d-flex gap-2 align-items-center">
                <i
                  className="fa-solid fa-download"
                  style={{ width: "20px" }}
                ></i>
                <span>Descargar</span>
              </div>
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" data-column="firma">
              <div className="d-flex gap-2 align-items-center">
                <i
                  className="fas fa-file-signature"
                  style={{ width: "20px" }}
                ></i>
                <span>Añadir firma</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
