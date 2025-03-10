import { clinicalRecordService } from "../../services/api/index.js";
import FormSerializer from "../../services/formSerializer.js";
import { AlertManager } from "../../services/alertManager.js";

document.getElementById("finishStep").addEventListener("click", function () {
    const form = document.getElementById("antecedentesForm");
    const data = {
        ...FormSerializer.serialize(form),
        patient_id: 1,
        created_by_user_id: 1,
        branch_id: 1,
    };

    clinicalRecordService.createForParent(data).then(() => {
        AlertManager.success({
            text: "Se ha creado el registro exitosamente",
        });
    });
});