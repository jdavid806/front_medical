import { branchService } from "../../../services/api/index.js";
export const userAvailabilityFormBranchSelect = {
  selectId: 'userAvailabilityFormAppointmentTypeId',
  promise: branchService.active(),
  mapper: data => {
    return data.map(item => {
      return {
        label: item.address,
        value: JSON.stringify(item)
      };
    });
  },
  label: 'Sucursal',
  required: true,
  multiple: false,
  name: 'branch_id'
};