import { PrimeReactProvider } from "primereact/api";
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { userService, remissionService } from "../../services/api";

export const RemissionsContent: React.FC = () => {
  const [dates, setDates] = useState([new Date("2025-01-01"), new Date()]);
  const [mappedServiceDoctors, setMappedServiceDoctors] = useState([]);
  const [selectedService, setSelectedService] = useState(2);
  const [dataRemissions, SetdataRemissions] = useState([]);

  useEffect(() => {
    fetchDoctors();
    handeFilter();
  }, []);

  const fetchDoctors = async () => {
    const data = await userService.getAll();
    const mappedData = data.map((item: any) => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name,
      };
    });

    setMappedServiceDoctors(mappedData);
  };

  const handeFilter = async () => {
    const patientId: any = new URLSearchParams(window.location.search).get(
      "patient_id"
    );
    const startDate = formatDateRange(dates)[0];
    const endDate = formatDateRange(dates)[1];

    const data = await remissionService.getRemissionsByParams(
      startDate,
      endDate,
      selectedService,
      patientId
    );
    SetdataRemissions(data);
  };

  const formatDateRange = (dateRange) => {
    if (!Array.isArray(dateRange) || dateRange.length !== 2) return "";

    const formatDate = (date) => date.toISOString().split("T")[0];

    const [fromDate, toDate] = dateRange;
    return [formatDate(fromDate), formatDate(toDate)];
  };
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <PrimeReactProvider>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Filtros
            </button>
          </h2>
          <div
            className="accordion-collapse collapse"
            id="collapseThree"
            aria-labelledby="headingThree"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body pt-0">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="doctors" className="form-label">
                    Fechas
                  </label>
                  <Calendar
                    value={dates}
                    onChange={(e: any) => setDates(e.value)}
                    selectionMode="range"
                    appendTo={"self"}
                    className="w-100"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="doctors" className="form-label">
                    Doctores
                  </label>
                  <Dropdown
                    inputId="doctors"
                    value={selectedService}
                    onChange={(e: DropdownChangeEvent) =>
                      setSelectedService(e.value)
                    }
                    options={mappedServiceDoctors}
                    optionLabel="label"
                    optionValue="value"
                    filter
                    className="w-100"
                    appendTo="self"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button onClick={handeFilter} className="btn btn-primary">
                  Filtrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataRemissions.length === 0 ? (
            <p>No hay datos disponibles</p>
          ) : (
            dataRemissions.map((note: any, index) => (
              <div className="card my-2">
                <div className="card-body">
                  <div className="card-title d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: note.is_active ? "green" : "red",
                        borderRadius: "50%",
                        display: "inline-block",
                        marginLeft: "8px",
                      }}
                    ></span>
                    <strong>
                      {note.clinical_record.clinical_record_type.name +
                        " - " +
                        note.remitter_by_user.first_name +
                        " " +
                        note.remitter_by_user.last_name}
                    </strong>
                  </div>
                  <p className="card-text">{note.note}</p>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2">
                      <strong>Remitido a:</strong>
                      <span>
                        {note.receiver_by_user.first_name +
                          " " +
                          note.receiver_by_user.last_name}
                      </span>
                    </div>
                    <span className="card-text">
                      <small className="text-muted">
                        {formatDate(note.created_at)}
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PrimeReactProvider>
  );
};
