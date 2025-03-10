import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  clinicalRecordService,
  evolutionNotesService,
} from "../../services/api";

interface Evolution {
  clinical_record_id: number;
  create_by_user_id: number;
  note: string;
  //   clinicalRecord: string;
}

export const EvolutionsForm: React.FC = () => {
  const [note, setNote] = useState("");
  const [mappedServiceClinicalRecord, setMappedServiceClinicalRecord] =
    useState([]);
  const [selectedService, setSelectedService] = useState<any>([]);

  useEffect(() => {
    fetchClinicalRecords();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newEvolution: Evolution = {
      clinical_record_id: selectedService ? selectedService : 0,
      create_by_user_id: 1,
      note,
      //   clinicalRecord
    };
    console.log(newEvolution);

    evolutionNotesService
      .createEvolutionNotes(newEvolution, newEvolution.clinical_record_id)
      .then((response) => {
        console.log("saved:", response);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchClinicalRecords = async () => {
    const url: any = new URLSearchParams(window.location.search).get(
      "patient_id"
    );

    const data = await clinicalRecordService.ofParent(url);
    console.log(data);
    const mappedData = data.map((item: any) => {
      return {
        value: item.id,
        label:
          item.clinical_record_type.name + " - " + formatDate(item.created_at),
      };
    });

    setMappedServiceClinicalRecord(mappedData);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {mappedServiceClinicalRecord.length > 0 && (
          <div className="form-group">
            <label htmlFor="clinicalRecords" className="form-label">
              Historias
            </label>
            <Dropdown
              inputId="clinicalRecords"
              value={selectedService}
              onChange={(e: DropdownChangeEvent) => setSelectedService(e.value)}
              options={mappedServiceClinicalRecord}
              optionLabel="label"
              optionValue="value"
              filter
              className="w-100"
              style={{
                zIndex: 100000,
              }}
              panelStyle={{
                zIndex: 100000,
              }}
              appendTo="self"
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="note" className="form-label">
            Nota
          </label>
          <textarea
            id="note"
            className="form-control"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button
            onClick={handleSubmit}
            className="btn btn-outline-info"
            type="button"
          >
            Guardar Evolución
          </button>
        </div>
      </form>
    </div>
  );
};
