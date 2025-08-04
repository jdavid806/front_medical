import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { usePatientsByFilters } from "./hooks/usePatientsByFilters";
import { getAge } from "../../services/utilidades";
import PatientFormModal from "./modals/form/PatientFormModal";
import { Button } from "primereact/button";

type PatientAsyncTableItem = {
  id: string;
  patientName: string;
  documentNumber: string;
  phone: string;
  age: string;
  dateLastAppointment: string;
};

export const PatientAsyncTable: React.FC = () => {
  const [tableItems, setTableItems] = useState<PatientAsyncTableItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const { patients, fetchPatientsByFilters, loading, totalRecords } =
    usePatientsByFilters();

  useEffect(() => {
    fetchPatientsByFilters({});
  }, []);

  const handlePageChange = (page) => {
    console.log(page);
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchPatientsByFilters({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
    });
  };

  const handlePatientCreated = () => {
    setShowPatientModal(false);
    refresh(); // Refrescar la tabla después de crear un paciente
  };

  const handleSearchChange = (_search: string) => {
    console.log(_search);

    setSearch(_search);
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: _search,
    });
  };

  const refresh = () =>
    fetchPatientsByFilters({
      per_page: perPage,
      page: currentPage,
      search: search ?? "",
    });

  useEffect(() => {
    const mappedPatients: PatientAsyncTableItem[] = patients.map((item) => {
      const lastAppointment =
        item.appointments.sort((a, b) => {
          const dateComparison =
            new Date(a.appointment_date).getTime() -
            new Date(b.appointment_date).getTime();
          if (dateComparison !== 0) return dateComparison;
          const timeComparison = a.appointment_time.localeCompare(
            b.appointment_time
          );
          return timeComparison;
        })[0] || null;

      const age = getAge(item.date_of_birth);

      return {
        id: item.id.toString(),
        patientName:
          `${item.first_name || ""} ${item.middle_name || ""} ${
            item.last_name || ""
          } ${item.second_last_name || ""}`.trim() || "--",
        documentNumber: item.document_number,
        phone: item.whatsapp || "--",
        age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : "--",
        dateLastAppointment: lastAppointment?.appointment_date || "--",
      };
    });
    setTableItems(mappedPatients);
  }, [patients]);

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "patientName",
      header: "Nombre del paciente",
      body: (rowData: PatientAsyncTableItem) => {
        return (
          <>
            <a href={`verPaciente?id=${rowData.id}`}>{rowData.patientName}</a>
          </>
        );
      },
    },
    { field: "documentNumber", header: "Nro. de documento" },
    { field: "phone", header: "Teléfono" },
    { field: "age", header: "Edad" },
    { field: "dateLastAppointment", header: "Fecha de última consulta" },
  ];

  return (
    <>
      <div className="card-body">
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button
            label="Nuevo Paciente "
            className="btn btn-primary"
            onClick={() => setShowPatientModal(true)}
          >
            <i className="fas fa-plus"></i>
          </Button>
        </div>

        <CustomPRTable
          columns={columns}
          data={tableItems}
          sortField="createdAt"
          sortOrder={-1}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          loading={loading}
          totalRecords={totalRecords}
          rows={perPage}
          first={first}
          onReload={refresh}
          lazy
        />

        <PatientFormModal
          visible={showPatientModal}
          onHide={() => setShowPatientModal(false)}
          onSuccess={handlePatientCreated}
          
        />
      </div>
    </>
  );
};
