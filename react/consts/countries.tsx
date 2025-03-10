import { countryService } from "../../services/api";
import { CustomSelectContainerConfig } from "../components/CustomSelectContainer";
import { CountryDto } from "../models/models";

export const CountriesSelectConfig: CustomSelectContainerConfig = {
    mapper: (data: CountryDto[]) => {
        return data.map(item => {
            return {
                label: item.name,
                value: item.id
            }
        })
    },
    label: 'País',
    multiple: false,
    promise: countryService.getAll(),
    required: true
}