import { useState } from 'react'
import { examTypeService } from '../../../services/api'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { ExamTypeInputs } from '../components/ExamConfigForm'

export const useExamTypeCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createExamType = async (examTypeData: Omit<ExamTypeInputs, 'id'>) => {
        setLoading(true)
        try {
            await examTypeService.create(examTypeData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createExamType }
}
