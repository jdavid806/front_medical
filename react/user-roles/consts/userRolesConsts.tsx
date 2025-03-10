import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { UserRoleDto } from "../../models/models";

export const userFormRolesSelect: CustomSelectContainerConfig = {
    selectId: 'userFormSpecialtyId',
    data: [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Secretaria' },
        { value: '3', label: 'Medico' },
        { value: '4', label: 'Enfermera' },
    ],
    mapper: (data: UserRoleDto[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'Rol',
    required: true,
    multiple: false
}