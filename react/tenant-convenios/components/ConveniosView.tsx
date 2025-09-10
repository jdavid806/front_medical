import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ConveniosList } from "./ConveniosList";
import { useConvenios } from "../hooks/useConvenios";

export function ConveniosView() {
  const toast = useRef<Toast>(null);
  const { convenios, conveniosDisponibles, loading, error, crearConvenio, cancelarConvenio } =
    useConvenios(toast);

  const conveniosActivos = convenios.filter((c) => c.convenioActivo);

  return (
    <div className="container mt-4">
      <Toast ref={toast} />

      {loading && <ProgressSpinner />}
      {error && <Message severity="error" text={error} />}

      {!loading && (
        <>
          <h4 className="mt-3 mb-2">Convenios Activos</h4>
          {conveniosActivos.length > 0 ? (
            <ConveniosList
              clinicas={conveniosActivos}
              onCrear={crearConvenio}
              onCancelar={cancelarConvenio}
            />
          ) : (
            <Message severity="info" text="No hay convenios activos" />
          )}

          <h4 className="mt-4 mb-2">Aliados de la red MedicalSoft+ Disponibles</h4>
          {conveniosDisponibles.length > 0 ? (
            <ConveniosList
              clinicas={conveniosDisponibles}
              onCrear={crearConvenio}
              onCancelar={cancelarConvenio}
            />
          ) : (
            <Message severity="info" text="No hay aliados disponibles para convenios" />
          )}
        </>
      )}
    </div>
  );
}
