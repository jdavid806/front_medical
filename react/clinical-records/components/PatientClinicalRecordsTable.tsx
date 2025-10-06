import React, { useEffect, useRef, useState } from "react";
import { PatientClinicalRecordDto } from "../../models/models";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { clinicalRecordStateColors, clinicalRecordStates } from "../../../services/commons";
import { HtmlRenderer } from "../../components/HtmlRenderer";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";

interface PatientClinicalRecordsTableItem {
  id: string;
  clinicalRecordName: string;
  clinicalRecordType: string;
  doctorName: string;
  description: string;
  status: string;
  patientId: string;
  patient?: any;
  createdAt: string;
  user: any;
  data: any;
  clinicalRecordTypeId: string;
}

interface PatientClinicalRecordsTableProps {
  records: PatientClinicalRecordDto[];
  onSeeDetail?: (id: string, clinicalRecordType: string) => void;
  onCancelItem?: (id: string) => void;
  onPrintItem?: (data: any, id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (data: any, type: string) => void;
  lazy?: boolean;
  totalRecords?: number;
  first?: number;
  rows?: number;
  loading?: boolean;
  onReload?: () => void;
  onPage?: (event: any) => void;
  onSearch?: (event: any) => void;
  onSort?: (event: any) => void;
}

export const PatientClinicalRecordsTable: React.FC<
  PatientClinicalRecordsTableProps
> = ({
  records,
  onSeeDetail,
  onCancelItem,
  onPrintItem,
  onDownloadItem,
  onShareItem,
  first,
  rows,
  totalRecords,
  loading,
  onPage,
  onReload,
  onSearch,
  onSort
}) => {
    const [tableRecords, setTableRecords] = useState<
      PatientClinicalRecordsTableItem[]
    >([]);
    const [sortField, setSortField] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<-1 | 1>(1); // 1 for asc, -1 for desc

    useEffect(() => {
      const mappedRecords: PatientClinicalRecordsTableItem[] = records
        .map((clinicalRecord) => {
          const formattedDate = new Date(
            clinicalRecord.created_at
          ).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          return {
            id: clinicalRecord.id,
            clinicalRecordName: clinicalRecord.clinical_record_type.name,
            clinicalRecordType: clinicalRecord.clinical_record_type.key_ || "",
            description: clinicalRecord.description || "--",
            doctorName: `${clinicalRecord.created_by_user.first_name} ${clinicalRecord.created_by_user.middle_name} ${clinicalRecord.created_by_user.last_name} ${clinicalRecord.created_by_user.second_last_name}`,
            status: clinicalRecord.status,
            patientId: clinicalRecord.patient_id,
            patient: clinicalRecord.patient,
            createdAt: formattedDate,
            user: clinicalRecord.created_by_user,
            data: clinicalRecord.data,
            clinicalRecordTypeId: clinicalRecord.clinical_record_type.id,
          };
        })
        .sort((a, b) => {
          // Función para convertir el string en fecha
          const parseCustomDate = (dateString: string): Date => {
            const [datePart, timePart] = dateString.split(", ");
            const [dayStr, monthStr, yearStr] = datePart.split(" de ");

            const months = [
              "enero", "febrero", "marzo", "abril", "mayo", "junio",
              "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
            ];

            const day = parseInt(dayStr, 10);
            const month = months.indexOf(monthStr.toLowerCase());
            const year = parseInt(yearStr, 10);
            const [hours, minutes, seconds] = timePart.split(":").map(Number);

            return new Date(year, month, day, hours, minutes, seconds);
          };

          const dateA = parseCustomDate(a.createdAt);
          const dateB = parseCustomDate(b.createdAt);

          return dateB.getTime() - dateA.getTime(); // Orden descendente
        });
      setTableRecords(mappedRecords);
    }, [records]);

    const handleSort = (e: any) => {
      const { sortField, sortOrder } = e;
      setSortField(sortField);
      setSortOrder(sortOrder === 1 ? 1 : -1);

      if (onSort) {
        onSort(e);
      }
    };

    const columns: CustomPRTableColumnProps[] = [
      {
        field: "clinicalRecordName",
        header: "Nombre de la historia",
        sortable: true
      },
      {
        field: "doctorName",
        header: "Doctor(a)",
        sortable: true
      },
      {
        field: "description",
        header: "Observaciones",
        body: (data: PatientClinicalRecordsTableItem) => <HtmlRenderer htmlContent={data.description} />
      },
      {
        field: "createdAt",
        header: "Fecha de creación",
        sortable: true
      },
      {
        field: "status",
        header: "Estado",
        body: (data: PatientClinicalRecordsTableItem) => {
          const color = clinicalRecordStateColors[data.status] || "secondary";
          const text = clinicalRecordStates[data.status] || "SIN ESTADO";

          const severityMap: Record<string, string> = {
            'success': 'success',
            'warning': 'warning',
            'danger': 'danger',
            'info': 'info',
            'primary': 'secondary',
            'secondary': 'secondary'
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
        body: (data: PatientClinicalRecordsTableItem) => (
          <TableActionsMenu
            data={data}
            onSeeDetail={onSeeDetail}
            onCancelItem={onCancelItem}
            onPrintItem={onPrintItem}
            onDownloadItem={onDownloadItem}
            onShareItem={onShareItem}
          />
        )
      },
    ];

    return (
      <>
        <div className="card mb-3">
          <div className="card-body">
            <CustomPRTable
              columns={columns}
              data={tableRecords}
              lazy
              first={first}
              rows={rows}
              totalRecords={totalRecords}
              loading={loading}
              sortField={sortField}
              sortOrder={sortOrder}
              onPage={onPage}
              onSearch={onSearch}
              onReload={onReload}
              onSort={handleSort}
            />
          </div>
        </div>
      </>
    );
  };

const TableActionsMenu: React.FC<{
  data: PatientClinicalRecordsTableItem;
  onSeeDetail?: (id: string, clinicalRecordType: string) => void;
  onCancelItem?: (id: string) => void;
  onPrintItem?: (data: any, id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (data: any, type: string) => void;
}> = ({ data, onSeeDetail, onCancelItem, onPrintItem, onDownloadItem, onShareItem }) => {
  const menu = useRef<Menu>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const items = [
    {
      label: "Ver detalle",
      icon: <i className="fa fa-eye me-2"></i>,
      command: () => onSeeDetail && onSeeDetail(data.id, data.clinicalRecordType)
    },
    {
      label: "Realizar revisión",
      icon: <i className="fa fa-edit me-2"></i>,
      visible: data.status === "pending_review",
      command: () => {
        console.log("Realizar revisión");
      }
    },
    {
      label: "Solicitar cancelación",
      icon: <i className="fa fa-times me-2"></i>,
      command: () => onCancelItem && onCancelItem(data.id)
    },
    {
      label: "Imprimir",
      icon: <i className="fa fa-print me-2"></i>,
      command: () => onPrintItem && onPrintItem(data, data.id, data.clinicalRecordName)
    },
    {
      label: "Descargar",
      icon: <i className="fa fa-download me-2"></i>,
      command: () => onDownloadItem && onDownloadItem(data.id, data.clinicalRecordName)
    },
    {
      separator: true
    },
    {
      label: "Compartir",
      icon: <i className="fa fa-share-alt me-2"></i>,
      items: [
        {
          label: "WhatsApp",
          icon: <i className="fa fa-whatsapp me-2"></i>,
          command: () => onShareItem && onShareItem(data, "whatsapp")
        },
        {
          label: "Email",
          icon: <i className="fa fa-envelope me-2"></i>,
          command: () => onShareItem && onShareItem(data, "email")
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
        appendTo={typeof document !== 'undefined' ? document.body : undefined}
      />
    </div>
  );
};