import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { CashControlInputs } from '../components/CashControlForm'
import { cashControlService } from '../../../services/api'
import { getJWTPayload } from '../../../services/utilidades'

export const useCashControlCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createCashControl = async (data: Omit<CashControlInputs, 'id'>) => {
        setLoading(true)
        try {
            const finalData: CashControlInputs = {
                ...data,
                who_validate: getJWTPayload().sub.toString(),
                payments: data.payments || []
            }
            await cashControlService.create(finalData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createCashControl }
}
