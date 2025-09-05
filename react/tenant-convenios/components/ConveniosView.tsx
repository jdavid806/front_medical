import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { ConveniosList } from "./ConveniosList";
import { useConvenios } from "../hooks/useConvenios";

export function ConveniosView() {
  const { clinicas, loading, error, crearConvenio, cancelarConvenio } =
    useConvenios();

  return (
    <div className="container mt-4">
      {loading && <ProgressSpinner />}
      {error && <Message severity="error" text={error} />}

      {!loading && (
        <ConveniosList
          clinicas={clinicas}
          onCrear={crearConvenio}
          onCancelar={cancelarConvenio}
        />
      )}
    </div>
  );
}
