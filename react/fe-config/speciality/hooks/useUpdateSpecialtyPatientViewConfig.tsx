import { userSpecialtyService } from "../../../../services/api"
import { usePRToast } from "../../../hooks/usePRToast"

export const useUpdateSpecialtyPatientViewConfig = () => {

    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const updateSpecialtyPatientViewConfig = async (id, data) => {
        try {
            const response = await userSpecialtyService.updatePatientViewConfig(id, data)
            showSuccessToast({
                title: "Éxito",
                message: "Configuración actualizada exitosamente"
            })
            return response
        } catch (error) {
            console.error(error)
            showServerErrorsToast(error)
            throw error
        }
    }

    return {
        updateSpecialtyPatientViewConfig,
        toast
    }
}
