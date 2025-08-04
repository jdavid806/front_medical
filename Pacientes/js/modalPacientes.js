import AlertManager from "../../services/alertManager.js";
import { patientService } from "../../services/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
  let companionsTemp = [];

  document.getElementById("finishStep").addEventListener("click", function () {
    const form = document.getElementById("formNuevoPaciente");
    const formData = new FormData(form);

    const data = {
      companions: [],
      social_security: {},
      patient: {},
    };

    let fileInput = document.getElementById("uploadImage");
    let file = fileInput.files[0];

    formData.forEach((value, key) => {
      const keys = key.split("[").map((k) => k.replace("]", ""));
      if (keys[0] === "companions") {
        const index = parseInt(keys[1], 10);
        if (!data.companions[index]) {
          data.companions[index] = {};
        }
        data.companions[index][keys[2]] = value;
      } else if (keys[0] === "social_security") {
        data.social_security[keys[1]] = value;
      } else if (keys[0] === "patient") {
        data.patient[keys[1]] = value;
      }
    });

    data.patient.is_active = true;

    data.companions = companionsTemp.map((companion) => ({
      document_type: companion.typeDocument,
      document_number: (companion.numberIdentification || 0).toString(),
      first_name: companion.firstName,
      middle_name: companion.secondName || null,
      last_name: companion.lastName,
      second_last_name: companion.secondLastName || null,
      email: companion.email,
      mobile: companion.whatsapp,
      is_active: companion.is_active === "true" || companion.is_active === true, // Asegurar booleano
      relationship: companion.relationship,
    }));

    const id = document.getElementById("modalPacientesPatientId").value;

    if (!id) {
      patientService
        .storePatient(data)
        .then(async (res) => {
          AlertManager.success({
            text: "Se ha creado el registro exitosamente.",
          });

          const minioUrl = await guardarArchivoPaciente(
            "uploadImage",
            res.patient_id
          );

          if (minioUrl) {
            await patientService.update(res.patient_id, {
              minio_url: minioUrl,
            });
          }

          setTimeout(() => {
            const modal = document.getElementById("modalCrearPaciente");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            window.location.reload();
          }, 4000);
        })
        .catch((err) => {
          if (err.data?.errors) {
            AlertManager.formErrors(err.data.errors);
          } else {
            AlertManager.error({
              text: err.message || "Ocurrió un error inesperado",
            });
          }
        });
    } else {
      patientService
        .updatePatient(id, data)
        .then(async () => {
          AlertManager.success({
            text: "Se ha actualizado el registro exitosamente",
          });

          const minioUrl = await guardarArchivoPaciente("uploadImage", id);

          if (minioUrl) {
            await patientService.update(id, {
              minio_url: minioUrl,
            });
          }

          setTimeout(() => {
            const modal = document.getElementById("modalCrearPaciente");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          if (err.data?.errors) {
            AlertManager.formErrors(err.data.errors);
          } else {
            AlertManager.error({
              text: err.message || "Ocurrió un error inesperado",
            });
          }
        });
    }
  });

  document
    .getElementById("saveCompanionButton")
    .addEventListener("click", function () {
      const companionForm = document.getElementById("partnerForm");
      const companionFormData = new FormData(companionForm);
      const companionData = {};

      companionFormData.forEach((value, key) => {
        companionData[key] = value;
      });

      // Almacenar los datos temporalmente con la estructura correcta
      companionsTemp.push({
        typeDocument: companionData.document_type,
        numberIdentification:
          parseInt(companionData.document_number, 10) || null,
        firstName: companionData.first_name,
        lastName: companionData.last_name,
        email: companionData.email,
        whatsapp: companionData.mobile,
        is_active:
          companionData.is_active === "true" ||
          companionData.is_active === true, // Asegurar booleano
        relationship: companionData.relationship,
      });

      // Cerrar el modal de crear acompañante
      const createCompanionModal = bootstrap.Modal.getInstance(
        document.getElementById("newPartnerModal")
      );
      createCompanionModal.hide();
    });
});
// Variable para almacenar los datos del acompañante temporalmente
