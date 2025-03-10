import { userService } from "../../../services/api/index.js";
export const userAvailabilityFormUsersSelect = {
  selectId: 'userAvailabilityFormUserId',
  promise: userService.getAll(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.first_name + ' ' + item.last_name,
        value: item.id.toString()
      };
    });
  },
  label: 'Usuario',
  required: true,
  multiple: false,
  name: 'user_id'
};