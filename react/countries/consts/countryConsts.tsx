import { countryService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { CountryDto } from "../../models/models";

export const userFormCountriesSelect: CustomSelectContainerConfig = {
    selectId: 'userFormCountryId',
    promise: countryService.getAll(),
    mapper: (data: CountryDto[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'País',
    required: true,
    multiple: false,
    name: 'country_id'
}