import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface Clinica {
  id: number;
  nombre: string;
  convenioActivo: boolean;
}

interface Props {
  clinicas: Clinica[];
  onCrear: (id: number) => void;
  onCancelar: (id: number) => void;
}

export function ConveniosList({ clinicas, onCrear, onCancelar }: Props) {
  return (
    <div className="d-flex flex-wrap gap-3">
      {clinicas.map((clinica) => (
        <Card
          key={clinica.id}
          title={clinica.nombre}
          className="shadow-sm"
          style={{ width: "250px" }}
        >
          {clinica.convenioActivo ? (
            <Button
              label="Cancelar Convenio"
              icon="pi pi-times"
              className="p-button-danger w-100"
              onClick={() => onCancelar(clinica.id)}
            />
          ) : (
            <Button
              label="Crear Convenio"
              icon="pi pi-check"
              className="p-button-success w-100"
              onClick={() => onCrear(clinica.id)}
            />
          )}
        </Card>
      ))}
    </div>
  );
}
