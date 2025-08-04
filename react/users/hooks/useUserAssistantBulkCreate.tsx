import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { userAssistantService } from '../../../services/api'
import { UserAssistantFormInputs } from '../UserAssistantForm'

export const useUserAssistantBulkCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createUserAssistantBulk = async (supervisorUserId: string, assistants: string[]) => {
        setLoading(true)
        try {
            const response = await userAssistantService.bulkCreate({
                supervisor_user_id: supervisorUserId,
                assistants
            })
            SwalManager.success()
            return response
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createUserAssistantBulk }
}
