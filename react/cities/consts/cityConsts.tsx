import { cityService } from "../../../services/api"
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer"

export const userFormCitiesSelect: CustomSelectContainerConfig = {
    selectId: 'userFormCityId',
    promise: cityService.getAll(),
    mapper: (data: any[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'Ciudad',
    required: true,
    multiple: false,
    name: 'city_id'
}