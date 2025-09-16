import { PrescriptionPackagesFormInputs, PrescriptionPackagesFormData } from "./PrescriptionPackagesForm";

export class PrescriptionPackagesMapper {
    static toFormDataFromFormInputs(data: PrescriptionPackagesFormInputs): PrescriptionPackagesFormData {
        return {
            name: data.name,
            description: data.description,
            relatedTo: data.relatedTo,
            cie11Code: ""
        }
    }
}
