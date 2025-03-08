import { daysOfWeek } from "../../services/commons"
import { objectToArray } from "../../services/utilidades"
import { CustomSelectContainerConfig } from "../components/CustomSelectContainer"

export const userAvailabilityFormDaysSelect: CustomSelectContainerConfig = {
    selectId: 'userAvailabilityFormDays',
    data: objectToArray(daysOfWeek),
    mapper: (data: any[]) => {
        return data.map((item, index) => {
            return {
                label: item,
                value: index.toString()
            }
        })
    },
    label: 'Días de la semana',
    required: true,
    multiple: true,
    name: 'days_of_week'
}