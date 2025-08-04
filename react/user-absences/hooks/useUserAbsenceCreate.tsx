import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { userAbsenceService } from '../../../services/api'

export const useUserAbsenceCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createUserAbsence = async (userAbsenceData: any, userId: string) => {
        setLoading(true)
        try {
            await userAbsenceService.createForParent(userId, userAbsenceData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createUserAbsence }
}
