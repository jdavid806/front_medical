import { branchService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";
import { BranchDto } from "../../models/models";

export const userAvailabilityFormBranchSelect: CustomSelectContainerConfig = {
    selectId: 'userAvailabilityFormAppointmentTypeId',
    promise: branchService.active(),
    mapper: (data: BranchDto[]) => {
        return data.map(item => {
            return {
                label: item.address,
                value: JSON.stringify(item)
            }
        })
    },
    label: 'Sucursal',
    required: true,
    multiple: false,
    name: 'branch_id'
}