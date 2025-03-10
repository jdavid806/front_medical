import { genders } from "../../services/commons"
import { objectToArray } from "../../services/utilidades"
import { CustomSelectContainerConfig } from "../components/CustomSelectContainer"

export const userFormGendersSelect: CustomSelectContainerConfig = {
    selectId: 'userFormGender',
    data: objectToArray(genders),
    mapper: (data: any[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'Genero',
    required: true,
    multiple: false,
    name: 'gender'
}