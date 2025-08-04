import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { examRecipeResultService } from '../../../services/api'
import { ExamRecipeResultFormInputs } from '../../clinical-records/AddParaclinicalForm'

export const useExamRecipeResultCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createExamRecipeResult = async (userData: Omit<ExamRecipeResultFormInputs, 'id'>) => {
        setLoading(true)
        try {
            const response = await examRecipeResultService.create(userData)
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

    return { loading, createExamRecipeResult }
}
