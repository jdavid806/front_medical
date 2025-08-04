import AlertManager from "../../../services/alertManager.js";
import { appointmentService } from "../../../services/api/index.js";
import FormSerializer from "../../../services/formSerializer.js";
import { userService } from "../../../services/api/index.js";

document
  .getElementById("finishStep")
  .addEventListener("click", async function () {
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

    const currentUser = await userService.getLoggedUser();

    data.created_by_user_id = currentUser?.id || 1;
    data.appointment_time = data.appointment_time + ":00";

    appointmentService
      .createForParent(data.patient_id || data.selectPaciente, data)
      .then((response) => {
        createAppointmentMessage(response.id, response.patient_id).then(() => {
          Swal.fire({
            icon: "success",
            title: "Se ha creado el registro exitosamente",
            text: "Por favor espere un momento mientras se envía el mensaje",
            showConfirmButton: false,
            // confirmButtonText: "Aceptar",
            // confirmButtonColor: '#3085d6',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            $("#modalCrearCita").modal("hide");
            window.location.reload();
          });
        });
      })
      .catch((err) => {
        if (err.data?.errors) {
          AlertManager.formErrors(err.data.errors);
        } else {
          AlertManager.error({
            text:
              err.data.error || err.message || "Ocurrió un error inesperado",
          });
        }
      });
  });
