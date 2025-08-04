import AlertManager from "../../services/alertManager.js";
import { patientDisabilityService } from "../../services/api/index.js";
import FormSerializer from "../../services/formSerializer.js";
import { handleSuccess, handleError } from "../../services/utilidades.js";

document
  .getElementById("btnGuardarIncapacidad")
  .addEventListener("click", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("patient_id");
    const form = document.getElementById("formCrearIncapacidad");
    console.log("form:", form);
    const data = FormSerializer.serialize(form);

    console.log("data:", data);

    if (data.accionModalCrearIncapacidad === "crear") {
      patientDisabilityService
        .createForParent(patientId, data)
        .then(() =>
          handleSuccess(AlertManager, "Se ha creado el registro exitosamente")
        )
        .catch((err) => handleError(AlertManager, err));
    } else {
      patientDisabilityService
        .update(data.id, data)
        .then(() =>
          handleSuccess(
            AlertManager,
            "Se ha actualizado el registro exitosamente"
          )
        )
        .catch((err) => handleError(AlertManager, err));
    }
  });
