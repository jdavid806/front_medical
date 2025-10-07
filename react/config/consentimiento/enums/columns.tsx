import { ConsentimientoData } from "./ConsentimientoData";
import { ConsentimientoTableColumn } from "./table-types";
import React from "react";
import { Button } from "primereact/button";

interface ColumnActionsProps {
  editConsentimiento: (id: string) => void;
  deleteConsentimiento: (id: string) => void;
}
interface DescriptionCellProps {
  html?: string | null;
}

export const DescriptionCell: React.FC<DescriptionCellProps> = ({ html }) => {
  const [expanded, setExpanded] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > 250); // 🔹 detecta si hay más contenido que la altura visible
    }
  }, [html]);

  if (!html) return <span>Sin descripción</span>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          maxHeight: expanded ? "none" : "250px",
          overflow: expanded ? "visible" : "hidden",
          whiteSpace: "normal",
          transition: "max-height 0.3s ease",
        }}
      />
      {isOverflowing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          style={{
            color: "#007bff",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            marginTop: "6px",
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
};

export const getColumns = ({
  editConsentimiento,
  deleteConsentimiento,
}: ColumnActionsProps): ConsentimientoTableColumn[] => [
  { field: "title", header: "Título" },
  { field: "data", header: "Datos" },
  {
    field: "description",
    header: "Descripción",
    body: (rowData: ConsentimientoData) => (
      <DescriptionCell html={rowData.description} />
    ),
  },
  {
    field: "",
    header: "Acciones",
    style: { width: "60px" },
    body: (rowData: ConsentimientoData) => (
      <div>
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
