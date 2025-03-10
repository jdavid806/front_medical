import { PrimeReactProvider } from "primereact/api";
import React from "react";
// import { Card } from "primereact/card";

export const EvolutionNotesList = ({ dataEvolutions }) => {
  return (
    <PrimeReactProvider>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataEvolutions.length === 0 ? (
          <p>No hay datos disponibles</p>
        ) : (
          dataEvolutions.map((note, index) => (
            <Card
              key={index}
              title={`Nota ${note.id}`}
              subTitle={`Creado: ${new Date(
                note.created_at
              ).toLocaleDateString()}`}
              className="shadow-md p-3"
            >
              <p>
                <strong>Nota:</strong> {note.note}
              </p>
              <p>
                <strong>Activo:</strong> {note.is_active ? "Sí" : "No"}
              </p>
              <p>
                <strong>Última actualización:</strong>{" "}
                {new Date(note.updated_at).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>
       */}
      sfdsdfds
    </PrimeReactProvider>
  );
};
