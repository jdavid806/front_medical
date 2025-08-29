import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useExamRecipes } from "./hooks/useExamRecipes";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { examRecipeService, userService } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";
import { examRecipeStatus, examRecipeStatusColors } from "../../services/commons";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF";
import { Menu } from "primereact/menu";

interface ExamRecipesTableItem {
  id: string;
  doctor: string;
  exams: string;
  patientId: string;
  created_at: string;
  status: string;
  resultMinioUrl?: string;
  user: any;
  details: any[];
}

const patientId = new URLSearchParams(window.location.search).get("patient_id");

export const ExamRecipesApp: React.FC = () => {
  const { examRecipes, fetchExamRecipes } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState<ExamRecipesTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const mappedExamRecipes: ExamRecipesTableItem[] = examRecipes
      .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
      .map((prescription: any) => ({
        id: prescription.id,
        doctor: `${prescription.user.first_name || ""} ${prescription.user.middle_name || ""
          } ${prescription.user.last_name || ""} ${prescription.user.second_last_name || ""
          }`,
        exams: prescription.details
          .map((detail) => detail.exam_type.name)
          .join(", "),
        patientId: prescription.patient_id,
        created_at: new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(prescription.created_at)),
        status: prescription.status,
        resultMinioUrl: prescription.result?.result_minio_url,
        user: prescription.user,
        details: prescription.details
      }));
    setTableExamRecipes(mappedExamRecipes);
    setTotalRecords(mappedExamRecipes.length);
  }, [examRecipes]);

  const cancelPrescription = async (id: string) => {
    SwalManager.confirmCancel(async () => {
      try {
        await examRecipeService.cancel(id);
        SwalManager.success({
          title: "Receta anulada",
          text: "La receta ha sido anulada correctamente.",
        });
        fetchExamRecipes(patientId!);
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la receta.",
        });
      }
    });
  };

  const seeExamRecipeResults = async (minioUrl: string | undefined | null) => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, '_blank');
    }
  };

  const handlePageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleReload = () => {
    fetchExamRecipes(patientId!);
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "doctor",
      header: "Doctor",
      sortable: true
    },
    {
      field: "exams",
      header: "Exámenes recetados",
      sortable: true
    },
    {
      field: "created_at",
      header: "Fecha de creación",
      sortable: true
    },
    {
      field: "status",
      header: "Estado",
      body: (rowData: ExamRecipesTableItem) => {
        const color = examRecipeStatusColors[rowData.status];
        const text = examRecipeStatus[rowData.status] || "SIN ESTADO";

        // Mapear colores de Phoenix a PrimeReact
        const severityMap: Record<string, string> = {
          'success': 'success',
          'warning': 'warning',
          'danger': 'danger',
          'info': 'info',
          'primary': null, // No hay equivalente directo, usar secondary
          'secondary': null
        };

        const severity = severityMap[color] || 'secondary';

        return (
          <Badge
            value={text}
            severity={severity}
            className="p-badge-lg"
          />
        );
      }
    },
    {
      field: "actions",
      header: "Acciones",
      body: (rowData: ExamRecipesTableItem) => (
        <TableActionsMenu
          rowData={rowData}
          onPrint={() => {
            generarFormato("RecetaExamen", rowData, "Impresion");
          }}
          onDownload={() => {
            generarFormato("RecetaExamen", rowData, "Descarga");
          }}
          onViewResults={() => seeExamRecipeResults(rowData.resultMinioUrl)}
          onCancel={() => cancelPrescription(rowData.id)}
          onShare={async () => {
            const user = await userService.getLoggedUser();
            //@ts-ignore
            enviarDocumento(
              rowData.id,
              "Descarga",
              "RecetaExamen",
              "Completa",
              rowData.patientId,
              user.id,
              "Receta_de_examenes"
            );
          }}
        />
      )
    }
  ];

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomPRTable
            columns={columns}
            data={tableExamRecipes}
            lazy={false}
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            loading={loading}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            onReload={handleReload}
          />
        </div>
      </div>
    </>
  );
};

const TableActionsMenu: React.FC<{
  rowData: ExamRecipesTableItem;
  onPrint: () => void;
  onDownload: () => void;
  onViewResults: () => void;
  onCancel: () => void;
  onShare: () => void;
}> = ({ rowData, onPrint, onDownload, onViewResults, onCancel, onShare }) => {
  const menu = useRef<Menu>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const items = [
    {
      label: "Imprimir",
      icon: "pi pi-print",
      command: () => {
        onPrint();
        menu.current?.hide(); 
      }
    },
    {
      label: "Descargar",
      icon: "pi pi-download",
      command: () => {
        onDownload();
        menu.current?.hide();
      }
    },
    ...(rowData.status === "uploaded" ? [{
      label: "Visualizar resultados",
      icon: "pi pi-eye",
      command: () => {
        onViewResults();
        menu.current?.hide(); 
      }
    }] : []),
    ...(rowData.status === "pending" ? [{
      label: "Anular receta",
      icon: "pi pi-times",
      command: () => {
        onCancel();
        menu.current?.hide(); 
      }
    }] : []),
    {
      separator: true
    },
    {
      label: "Compartir",
      icon: "pi pi-share-alt",
      items: [
        {
          label: "WhatsApp",
          icon: "pi pi-whatsapp",
          command: () => {
            onShare();
            menu.current?.hide();
          }
        }
      ]
    }
  ];

  const handleMenuHide = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="table-actions-menu">
      <Button
        icon="pi pi-ellipsis-v"
        className="p-button-rounded btn-primary"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls={`popup_menu_${rowData.id}`}
        aria-haspopup
      >
        Acciones
        <i className="fa fa-cog ml-2"></i>
      </Button>
      <Menu
        model={items}
        popup
        ref={menu}
        id={`popup_menu_${rowData.id}`}
        onHide={handleMenuHide}
        appendTo={typeof document !== 'undefined' ? document.body : undefined}
      />
    </div>
  );
};