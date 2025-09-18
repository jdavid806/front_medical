import React, { useState, useEffect } from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import {
  clinicalRecordService,
  remissionService,
  userService,
  userSpecialtyService,
} from "../../services/api";
import { Checkbox } from "primereact/checkbox";
import { PrimeReactProvider } from "primereact/api";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

export interface Remission {
  receiver_user_id: null;
  remitter_user_id: number;
  clinical_record_id: number;
  receiver_user_specialty_id: null;
  note: string;
}

export interface RemissionsFormProps {
  ref?: React.RefObject<any>;
  initialData?: Remission;
}

export const remissionsForm: React.FC<RemissionsFormProps> = forwardRef(
  ({ initialData }, ref) => {
    const [note, setNote] = useState("");
    const [mappedServiceClinicalRecord, setMappedServiceClinicalRecord] =
      useState([]);
    const [selectedService, setSelectedService] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [mappedServiceUsers, setMappedServiceUsers] = useState([]);
    const [checked, setChecked] = useState<boolean>(false);
    const [mappedServiceUserSpecialty, setMappedServiceUserSpecialty] =
      useState([]);
    const [selectedUserSpecialty, setSelectedUserSpecialty] = useState<any>([]);

    useEffect(() => {
      fetchClinicalRecords();
      fetchDoctors();
      fetchUserSpecialties();
    }, []);

    useEffect(() => {
      if (initialData) {
        setSelectedUser(initialData.receiver_user_id);
        setSelectedUserSpecialty(initialData.receiver_user_specialty_id);
        setChecked(initialData.receiver_user_specialty_id ? true : false);
        setNote(initialData.note);
      }
    }, [initialData]);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const newremission: Remission = {
        receiver_user_id: !checked ? selectedUser : null,
        remitter_user_id: 1,
        clinical_record_id: selectedService,
        receiver_user_specialty_id: checked ? selectedUserSpecialty : null,
        note: note,
      };
      console.log(newremission, checked);
      remissionService
        .createRemission(newremission, newremission.clinical_record_id)
        .then((response) => {
          console.log("saved:", response);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    useImperativeHandle(ref, () => ({
      getFormData: () => {
        return {
          receiver_user_id: !checked ? selectedUser : null,
          remitter_user_id: 1,
          //clinical_record_id: selectedService,
          receiver_user_specialty_id: checked ? selectedUserSpecialty : null,
          note: note,
        };
      },
      resetForm: () => {
        setSelectedUser(null)
        setSelectedUserSpecialty(null)
        setChecked(false)
        setNote("")
      }
    }));

    const fetchClinicalRecords = async () => {
      const url: any = new URLSearchParams(window.location.search).get(
        "patient_id"
      );

      if (url) {
        const data = await clinicalRecordService.ofParent(url);
        const mappedData = data.map((item: any) => {
          return {
            value: item.id,
            label:
              item.clinical_record_type.name +
              " - " +
              formatDate(item.created_at),
          };
        });

        setMappedServiceClinicalRecord(mappedData);
      }
    };

    const fetchDoctors = async () => {
      const data = await userService.getAll();
      console.log(data);
      const mappedData = data.map((item: any) => {
        return {
          value: item.id,
          label: item.first_name + " " + item.last_name + " - " + item.id,
        };
      });

      setMappedServiceUsers(mappedData);
    };

    const fetchUserSpecialties = async () => {
      const data = await userSpecialtyService.getAllItems();
      console.log(data);
      const mappedData = data.map((item: any) => {
        return {
          value: item.id,
          label: item.name + " - " + item.id,
        };
      });

      setMappedServiceUserSpecialty(mappedData);
    };

    const formatDate = (isoDate) => {
      if (!isoDate) return "";
      return new Date(isoDate).toISOString().split("T")[0];
    };

    return (
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* {mappedServiceClinicalRecord.length > 0 && (
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
        )} */}
          {!checked && (
            <div className="form-group">
              <label htmlFor="user" className="form-label">
                Doctores
              </label>
              <Dropdown
                inputId="user"
                value={selectedUser}
                onChange={(e: DropdownChangeEvent) => setSelectedUser(e.value)}
                options={mappedServiceUsers}
                optionLabel="label"
                optionValue="value"
                filter
                className="w-100"
                appendTo="self"
              />
            </div>
          )}
          {checked && (
            <div className="form-group">
              <label htmlFor="userSpecialty" className="form-label">
                Especialista
              </label>
              <Dropdown
                inputId="userSpecialty"
                value={selectedUserSpecialty}
                onChange={(e: DropdownChangeEvent) =>
                  setSelectedUserSpecialty(e.value)
                }
                options={mappedServiceUserSpecialty}
                optionLabel="label"
                optionValue="value"
                filter
                className="w-100"
                appendTo="self"
              />
            </div>
          )}
          <div className="m-3 d-flex align-items-center gap-2">
            <Checkbox
              onChange={(e: any) => setChecked(e.checked)}
              checked={checked}
            ></Checkbox>
            <label
              className="form-check-label"
              htmlFor="seleccionarEspecialista"
            >
              Desea remitir a un especialista?
            </label>
          </div>
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
          {/* <div className="d-flex justify-content-end mt-3">
          <button
            onClick={handleSubmit}
            className="btn btn-outline-info"
            type="button"
          >
            Guardar Remisión
          </button>
        </div> */}
        </form>
      </PrimeReactProvider>
    );
  }
);
