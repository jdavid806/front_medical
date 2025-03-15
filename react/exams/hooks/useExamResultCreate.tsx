import { useState } from 'react'
import { examResultService } from '../../../services/api'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'

export const useExamResultCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createExamResult = async (examResultData: Omit<any, 'id'>) => {
        setLoading(true)
        try {
            await examResultService.create(examResultData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createExamResult }
}
