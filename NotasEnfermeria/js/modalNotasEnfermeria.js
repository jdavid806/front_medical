import AlertManager from "../../services/alertManager.js";
import { patientNursingNoteService } from "../../services/api/index.js";
import FormSerializer from "../../services/formSerializer.js";

document.getElementById("guardarNota").addEventListener("click", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patient_id");
  const form = document.getElementById("formNuevaNota");
  const data = FormSerializer.serialize(form);

  // console.log(data);

  patientNursingNoteService
    .createForParent(patientId, data)
    .then(() => {
      AlertManager.success({
        text: "Se ha creado el registro exitosamente",
      });

      setTimeout(() => {
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
});
