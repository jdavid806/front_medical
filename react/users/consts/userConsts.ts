import { userService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { UserDto } from "../../models/models";

export const userAvailabilityFormUsersSelect: CustomSelectContainerConfig = {
    selectId: 'userAvailabilityFormUserId',
    promise: userService.getAll(),
    mapper: (data: UserDto[]) => {
        return data.map(item => {
            return {
                label: item.first_name + ' ' + item.last_name,
                value: item.id.toString()
            }
        })
    },
    label: 'Usuario',
    required: true,
    multiple: false,
    name: 'user_id'
}