import { ConsentimientoData } from "./ConsentimientoData";
import { ConsentimientoTableColumn } from "./table-types";
import { Button } from "primereact/button";
import React from "react";

interface ColumnActionsProps {
  editConsentimiento: (id: string) => void;
  deleteConsentimiento: (id: string) => void;
}

export const getColumns = ({
  editConsentimiento,
  deleteConsentimiento,
}: ColumnActionsProps): ConsentimientoTableColumn[] => [
  { field: "title", header: "Título" },
  { field: "data", header: "Datos" },
  {
    field: "description",
    header: "Descripción",
    body: (rowData: ConsentimientoData) => {
      const html = rowData.description || "";
      const text = html.replace(/<[^>]+>/g, "");
      const shortText = text.slice(0, 300);
      const isLong = text.length > 300;

      return (
        <div style={{ maxWidth: "600px" }}>
          <div
            id={`desc-${rowData.id}`}
            data-full={html}
            data-short={shortText}
            data-expanded="false"
            dangerouslySetInnerHTML={{ __html: isLong ? shortText + "..." : html }}
          ></div>

          {isLong && (
            <span
              onClick={(e) => {
                const el = document.getElementById(`desc-${rowData.id}`);
                if (!el) return;
                const expanded = el.dataset.expanded === "true";
                el.innerHTML = expanded
                  ? el.dataset.short + "..."
                  : el.dataset.full || "";
                el.dataset.expanded = expanded ? "false" : "true";
                e.currentTarget.textContent = expanded ? "Ver más" : "Ver menos";
              }}
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
                display: "inline-block",
                marginTop: "4px",
              }}
            >
              Ver más
            </span>
          )}
        </div>
      );
    },
  },
  {
    field: "",
    header: "Acciones",
    style: { width: "60px" },
    body: (rowData: ConsentimientoData) => (
      <div key={rowData.id}>
        <Button
          className="p-button-rounded p-button-text p-button-sm"
          onClick={(e) => {
            e.stopPropagation();
            editConsentimiento(rowData.id ?? "");
          }}
        >
          <i className="fas fa-pencil-alt"></i>
        </Button>
        <Button
          className="p-button-rounded p-button-text p-button-sm p-button-danger"
          onClick={(e) => {
            e.stopPropagation();
            deleteConsentimiento(rowData.id ?? "");
          }}
        >
          <i className="fa-solid fa-trash"></i>
        </Button>
      </div>
    ),
  },
];
