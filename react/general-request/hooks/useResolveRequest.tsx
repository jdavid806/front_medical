import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { GeneralRequestService } from '../../../services/api/classes/generalRequestService'

export const useResolveRequest = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const resolveRequest = async (requestId: string, requestData: {
        status: string;
        notes: string | null;
    }) => {
        setLoading(true)
        try {
            const service = new GeneralRequestService()
            const response = await service.resolveRequest(requestId, requestData)
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

    return { loading, resolveRequest }
}
