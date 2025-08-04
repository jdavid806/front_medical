import React from "react";
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../../components/CustomDataTable";
import { useEffect } from "react";
import { useState } from "react";
import { PatientClinicalRecordDto } from "../../models/models";
import { SeeDetailTableAction } from "../../components/table-actions/SeeDetailTableAction";
import { RequestCancellationTableAction } from "../../components/table-actions/RequestCancellationTableAction";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper";
import { CustomPRTable, CustomPRTableColumnProps, CustomPRTableProps } from "../../components/CustomPRTable";
import { clinicalRecordStateColors, clinicalRecordStates } from "../../../services/commons";
import { HtmlRenderer } from "../../components/HtmlRenderer";

interface PatientClinicalRecordsTableItem {
  id: string;
  clinicalRecordName: string;
  clinicalRecordType: string;
  doctorName: string;
  description: string;
  status: string;
  patientId: string;
  patient?: any;
}

interface PatientClinicalRecordsTableProps {
  records: PatientClinicalRecordDto[];
  onSeeDetail?: (id: string, clinicalRecordType: string) => void;
  onCancelItem?: (id: string) => void;
  onPrintItem?: (data: any, id: string, title: string) => void;
  onDownloadItem?: (id: string, title: string) => void;
  onShareItem?: (data:any, type: string) => void;
  lazy?: boolean
  totalRecords?: number
  first?: number
  rows?: number
  loading?: boolean
  onReload?: () => void
  onPage?: (event: any) => void
  onSearch?: (event: any) => void
};

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
  onSearch
}) => {
    const [tableRecords, setTableRecords] = useState<
      PatientClinicalRecordsTableItem[]
    >([]);

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
              "enero",
              "febrero",
              "marzo",
              "abril",
              "mayo",
              "junio",
              "julio",
              "agosto",
              "septiembre",
              "octubre",
              "noviembre",
              "diciembre",
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

    const columns: CustomPRTableColumnProps[] = [
      { field: "clinicalRecordName", header: "Nombre de la historia" },
      { field: "doctorName", header: "Doctor(a)" },
      { field: "description", header: "Observaciones", body: (data: PatientClinicalRecordsTableItem) => <HtmlRenderer htmlContent={data.description} /> },
      { field: "createdAt", header: "Fecha de creación" },
      {
        field: "status", header: "Estado", body: (data: PatientClinicalRecordsTableItem) => {
          const color = clinicalRecordStateColors[data.status] || "secondary";
          const text = clinicalRecordStates[data.status] || "SIN ESTADO";
          return (<>
            <span className={`badge badge-phoenix badge-phoenix-${color}`}>
              {text}
            </span>
          </>)
        }
      },
      {
        field: "", header: "Acciones", body: (data: any) => <>
          <div className="text-end align-middle">
            <TableActionsWrapper>
              <SeeDetailTableAction
                onTrigger={() =>
                  onSeeDetail && onSeeDetail(data.id, data.clinicalRecordType)
                }
              />


              <RequestCancellationTableAction
                onTrigger={() => onCancelItem && onCancelItem(data.id)}
              />

              <PrintTableAction
                onTrigger={() =>
                  onPrintItem && onPrintItem(data, data.id, data.clinicalRecordName)
                }
              />
              <DownloadTableAction
                onTrigger={() =>
                  onDownloadItem && onDownloadItem(data.id, data.clinicalRecordName)
                }
              />

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="dropdown-header">Compartir</li>

              <ShareTableAction
                shareType="whatsapp"
                onTrigger={() =>
                  onShareItem &&
                  onShareItem(data, "whatsapp")
                }
              />
              <ShareTableAction
                shareType="email"
                onTrigger={() =>
                  onShareItem &&
                  onShareItem(data, "email")
                }
              />
            </TableActionsWrapper>
          </div>
        </>
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
              onPage={onPage}
              onSearch={onSearch}
              onReload={onReload}
            >
            </CustomPRTable>
          </div>
        </div>
      </>
    );
  };
