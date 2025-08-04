import { useState } from 'react'
import { examTypeService } from '../../../services/api'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { ExamTypeInputs } from '../components/ExamConfigForm'
import { ExamTypeDto } from '../../models/models'

export const useExamTypeCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createExamType = async (examTypeData: Omit<ExamTypeInputs, 'id'>): Promise<ExamTypeDto | undefined> => {
        setLoading(true)
        try {
            console.log('examTypeData.form_config', examTypeData.form_config);
            console.log(typeof examTypeData.form_config);
            console.log(Object.keys(examTypeData.form_config).length);
            console.log(examTypeData.form_config != null);




            const data = {
                ...examTypeData,
                form_config: (
                    Object.keys(examTypeData.form_config).length > 0
                        && examTypeData.form_config != null
                        && examTypeData.form_config != undefined
                        && examTypeData.form_config != "{}"
                        ? examTypeData.form_config
                        : { tabs: [] }
                )
            }
            const result = await examTypeService.create(data)
            SwalManager.success()
            return result
        } catch (error) {
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createExamType }
}
