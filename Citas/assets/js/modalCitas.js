import AlertManager from "../../../services/alertManager.js";
import { appointmentService } from "../../../services/api/index.js";
import FormSerializer from "../../../services/formSerializer.js";

document.getElementById("finishStep").addEventListener("click", function () {
  const form = document.getElementById("formNuevaCita");
  const data = {
    ...FormSerializer.serialize(form),
    appointment_state_id: 1,
    assigned_user_id: 3,
    created_by_user_id: 1,
    duration: 30,
    branch_id: null,
    phone: "573054091063",
    email: "pinillacarlos892@gmail.com",
  };

  data.appointment_time = data.appointment_time + ":00";

  appointmentService
    .createForParent(data.patient_id || data.selectPaciente, data)
    .then(async (response) => {
      console.log(response);
      AlertManager.success({
        text: "Se ha creado el registro exitosamente",
      });
      await createAppointmentMessage(response.id, response.patient_id);
      setTimeout(() => {
        $("#modalCrearCita").modal("hide");
        window.location.reload();
      }, 3000);
    })
    .catch((err) => {
      if (err.data?.errors) {
        AlertManager.formErrors(err.data.errors);
      } else {
        AlertManager.error({
          text: err.data.error || err.message || "Ocurrió un error inesperado",
        });
      }
    });
});
