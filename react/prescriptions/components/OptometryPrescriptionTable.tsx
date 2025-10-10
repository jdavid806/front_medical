import React, { useCallback, useEffect, useRef, useState } from "react";
import { PrescriptionDto, PrescriptionTableItem } from "../../models/models.js";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../components/CustomPRTable.js";
import {
  recipeInvoiceStates,
  recipeInvoiceStateColors,
} from "../../../services/commons.js";
import { OptometryBillingModal } from "../../clinical-records/optometry/modal/OptometryBillingModal.js";
import { useOptometry } from "../../clinical-records/optometry/hooks/useOptometry.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from "../../../services/utilidades";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface PrescriptionTableProps {
  prescriptions: PrescriptionDto[];
}

interface ShowBillingModal {
  show: boolean;
  id: any;
}

export const OptometryPrescriptionTable: React.FC<PrescriptionTableProps> = ({
  prescriptions,
}) => {
  const [showBillingModal, setShowBillingModal] = useState<ShowBillingModal>({
    show: false,
    id: 0,
  });
  const [tablePrescriptions, setTablePrescriptions] = useState<
    PrescriptionTableItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<-1 | 1>(-1);
  const toast = useRef<Toast>(null);

  const { getRecipeInvoiceStatus } = useOptometry();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "recetas-compartir",
    type: "whatsapp",
  };
  const { template, setTemplate, fetchTemplate } = useTemplate(data);
  const {
    sendMessage: sendMessageWpp,
    responseMsg,
    loading: loadingMessage,
    error,
  } = useMassMessaging();

  const sendMessageWppRef = useRef(sendMessageWpp);
  const fetchTemplateRef = useRef(fetchTemplate);

  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);

  useEffect(() => {
    fetchTemplateRef.current = fetchTemplate;
  }, [fetchTemplate]);

  useEffect(() => {
    const mappedPrescriptions: PrescriptionTableItem[] = prescriptions
      .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
      .map((prescription: any) => ({
        id: prescription.id,
        doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
        patient: `${prescription.patient.first_name} ${prescription.patient.last_name}`,
        patient_data: prescription.patient,
        created_at: new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(prescription.created_at)),
        status: prescription.invoice_id ? "pending" : "paid",
        optometry_item: prescription.optometry_item,
        clinical_record: prescription.clinical_record,
        prescriber: prescription.prescriber,
      }));
    setTablePrescriptions(mappedPrescriptions);
    setTotalRecords(mappedPrescriptions.length);
  }, [prescriptions]);

  const handlePageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleReload = () => {
    setLoading(true);
    // Aquí puedes agregar lógica para recargar datos si es necesario
    setLoading(false);
  };

  const handleSort = (e: any) => {
    const { sortField, sortOrder } = e;
    setSortField(sortField);
    setSortOrder(sortOrder === 1 ? 1 : -1);
  };

  async function generatePdfFile(prescription) {
    //@ts-ignore
    await generarFormato(
      "RecetaOptometria",
      prescription,
      "Impresion",
      "prescriptionInput"
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput: any = document.getElementById(
          "pdf-input-hidden-to-prescriptionInput"
        );
        let file = fileInput?.files[0];

        if (!file) {
          resolve(null);
          return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\ClinicalRecords");
        formData.append("model_id", prescription.id);
        //@ts-ignore
        guardarArchivo(formData, true)
          .then((response) => {
            resolve(response.file);
          })
          .catch(reject);
      }, 1000);
    });
  }

  const sendMessageWhatsapp = useCallback(
    async (prescription) => {
      const templatePrescriptions = await fetchTemplateRef.current();
      const dataToFile: any = await generatePdfFile(prescription);
      //@ts-ignore
      const urlPDF = getUrlImage(
        dataToFile.file_url.replaceAll("\\", "/"),
        true
      );

      const replacements = {
        NOMBRE_PACIENTE: `${prescription.patient_data.first_name} ${prescription.patient_data.middle_name} ${prescription.patient_data.last_name} ${prescription.patient_data.second_last_name}`,
        ESPECIALISTA: `${prescription.prescriber.first_name} ${prescription.prescriber.middle_name} ${prescription.prescriber.last_name} ${prescription.prescriber.second_last_name}`,
        ESPECIALIDAD: `${prescription.prescriber.specialty.name}`,
        RECOMENDACIONES: `${prescription.clinical_record.description}`,
        FECHA_RECETA: `${prescription.created_at}`,
        "ENLACE DOCUMENTO": "",
      };

      const templateFormatted = formatWhatsAppMessage(
        templatePrescriptions.template,
        replacements
      );

      const dataMessage = {
        channel: "whatsapp",
        recipients: [
          getIndicativeByCountry(prescription.patient_data.country_id) +
            prescription.patient_data.whatsapp,
        ],
        message_type: "media",
        message: templateFormatted,
        attachment_url: urlPDF,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook",
      };
      await sendMessageWppRef.current(dataMessage);
      SwalManager.success({
        text: "Mensaje enviado correctamente",
        title: "Éxito",
      });
    },
    [sendMessageWpp, fetchTemplate]
  );

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "doctor",
      header: "Doctor",
      sortable: true,
    },
    {
      field: "created_at",
      header: "Fecha de creación",
      sortable: true,
    },
    {
      field: "status",
      header: "Estado de facturación",
      body: (data: PrescriptionTableItem) => {
        const text = recipeInvoiceStates[data.status] || "SIN ESTADO";
        const color = recipeInvoiceStateColors[data.status] || "secondary";

        // Mapear colores de Phoenix a PrimeReact
        const severityMap: Record<string, string> = {
          success: "success",
          warning: "warning",
          danger: "danger",
          info: "info",
          primary: "secondary",
          secondary: "secondary",
        };

        const severity = severityMap[color] || "secondary";

        return (
          <Badge value={text} severity={severity} className="p-badge-lg" />
        );
      },
    },
    {
      field: "actions",
      header: "Acciones",
      body: (data: PrescriptionTableItem) => (
        <TableActionsMenu
          data={data}
          onPrint={async () => {
            const result = await getRecipeInvoiceStatus(data.id);
            if (result.has_invoice) {
              //@ts-ignore
              generarFormato("RecetaOptometria", data, "Impresion");
            } else {
              setShowBillingModal({ show: true, id: data.id });
            }
          }}
          onDownload={async () => {
            const result = await getRecipeInvoiceStatus(data.id);
            if (result.has_invoice) {
              //@ts-ignore
              generarFormato("RecetaOptometria", data, "Descarga");
            } else {
              setShowBillingModal({ show: true, id: data.id });
            }
          }}
          onShare={async () => {
            const result = await getRecipeInvoiceStatus(data.id);
            if (result.has_invoice) {
              sendMessageWhatsapp(data);
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Primero debe facturar la receta",
                life: 5000,
              });
            }
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomPRTable
            columns={columns}
            data={tablePrescriptions}
            lazy={false}
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            loading={loading}
            sortField={sortField}
            sortOrder={sortOrder}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            onReload={handleReload}
            onSort={handleSort}
          />
        </div>
        <Toast ref={toast} />
      </div>
      <OptometryBillingModal
        receiptId={showBillingModal.id}
        show={showBillingModal.show}
        onHide={() => setShowBillingModal({ show: false, id: 0 })}
        onSaveSuccess={() => {
          // Aquí puedes agregar lógica para refrescar datos si es necesario
        }}
      />
    </>
  );
};

const TableActionsMenu: React.FC<{
  data: PrescriptionTableItem;
  onPrint: () => void;
  onDownload: () => void;
  onShare: () => void;
}> = ({ data, onPrint, onDownload, onShare }) => {
  const menu = useRef<Menu>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const items = [
    {
      label: "Imprimir",
      icon: "pi pi-print",
      command: onPrint,
    },
    {
      label: "Descargar",
      icon: "pi pi-download",
      command: onDownload,
    },
    {
      separator: true,
    },
    {
      label: "Compartir por WhatsApp",
      icon: "pi pi-whatsapp",
      command: onShare,
    },
  ];

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setOpenMenuId(openMenuId === data.id ? null : data.id);
    if (menu.current) {
      const menuElement = menu.current as any;
      if (openMenuId === data.id) {
        menuElement.hide();
      } else {
        menuElement.show(e);
      }
    }
  };

  const handleMenuHide = () => {
    setOpenMenuId(null);
  };

  return (
    <div className="table-actions-menu">
      <Button
        className="p-button-rounded btn-primary"
        onClick={(e) => menu.current?.toggle(e)}
        aria-controls={`popup_menu_${data.id}`}
        aria-haspopup
      >
        Acciones
        <i className="fa fa-cog ml-2"></i>
      </Button>
      <Menu
        model={items}
        popup
        ref={menu}
        id={`popup_menu_${data.id}`}
        onHide={handleMenuHide}
        appendTo={typeof document !== "undefined" ? document.body : undefined}
      />
    </div>
  );
};
