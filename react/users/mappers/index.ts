import { getJWTPayload } from "../../../services/utilidades";
import { VerifySupervisorFormData } from "../VerifySupervisorForm";
import { VerifySupervisorFormInputs } from "../VerifySupervisorForm";

export class VerifySupervisorFormMapper {

    static toFormData(data: VerifySupervisorFormInputs): VerifySupervisorFormData {
        return {
            external_id: getJWTPayload().sub,
            password: data.password
        }
    }
}
