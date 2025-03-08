import { useState } from 'react'
import { examCategoryService } from '../../../services/api'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { ExamCategoryInputs } from '../components/ExamCategoryForm'

export const useExamCategoryCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createExamCategory = async (examCategoryData: Omit<ExamCategoryInputs, 'id'>) => {
        setLoading(true)
        try {
            await examCategoryService.create(examCategoryData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createExamCategory }
}
