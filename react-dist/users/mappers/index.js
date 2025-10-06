import { getJWTPayload } from "../../../services/utilidades.js";
export class VerifySupervisorFormMapper {
  static toFormData(data) {
    return {
      external_id: getJWTPayload().sub,
      password: data.password
    };
  }
}