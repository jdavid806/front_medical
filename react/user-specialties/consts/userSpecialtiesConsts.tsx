import { userSpecialtyService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { UserSpecialtyDto } from "../../models/models";

export const userFormSpecialtiesSelect: CustomSelectContainerConfig = {
    selectId: 'userFormSpecialtyId',
    promise: userSpecialtyService.getAll(),
    mapper: (data: UserSpecialtyDto[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'Especialidad',
    required: true,
    multiple: false
}