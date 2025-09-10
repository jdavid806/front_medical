import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

interface Clinica {
  id: number;
  idConvenio?: number;
  nombre: string;
  convenioActivo: boolean;
}

interface Props {
  clinicas: Clinica[];
  onCrear: (tenantB: number, module: string) => void;
  onCancelar: (id: number) => void;
}

export function ConveniosList({ clinicas, onCrear, onCancelar }: Props) {
  const [selectedModule, setSelectedModule] = useState<{ [key: number]: string }>({});

  const modules = [
    { label: "Farmacia", value: "farmacia" },
    { label: "Laboratorio", value: "laboratorio" },
    { label: "Urgencias", value: "urgencias" },
  ];

  const tenantA = 1; // fijo por ahora, luego se puede obtener del contexto de login

  return (
    <div className="d-flex flex-wrap gap-3">
      {clinicas.map((clinica) => (
        <Card
          key={clinica.id}
          title={clinica.nombre}
          className="shadow-sm"
          style={{ width: "280px" }}
        >
          {clinica.convenioActivo ? (
            <Button
              label="Cancelar Convenio"
              icon="pi pi-times"
              className="p-button-danger w-100"
              onClick={() => onCancelar(clinica.idConvenio)}
            />
          ) : (
            <div className="flex flex-column gap-2">
              <Dropdown
                value={selectedModule[clinica.id]}
                options={modules}
                onChange={(e) =>
                  setSelectedModule({ ...selectedModule, [clinica.id]: e.value })
                }
                placeholder="Seleccione módulo"
                className="w-100 mb-2"
              />
              <Button
                label="Crear Convenio"
                icon="pi pi-check"
                className="p-button-success w-100"
                disabled={!selectedModule[clinica.id]}
                onClick={() =>
                  onCrear(clinica.id, selectedModule[clinica.id])
                }
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
