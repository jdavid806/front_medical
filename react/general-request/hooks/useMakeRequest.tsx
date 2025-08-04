import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { authService } from '../../../services/api'
import { GeneralRequestService } from '../../../services/api/classes/generalRequestService'

export const useMakeRequest = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const makeRequest = async (requestData: {
        type: string;
        requestable_id: string;
        requestable_type: string;
        notes: string | null;
    }) => {
        setLoading(true)
        try {
            const service = new GeneralRequestService()
            const response = await service.makeRequest(requestData)
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

    return { loading, makeRequest }
}
