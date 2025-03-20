import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { CashControlInputs } from '../components/CashControlForm'
import { cashControlService } from '../../../services/api'

export const useCashControlCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createCashControl = async (data: Omit<CashControlInputs, 'id'>) => {
        setLoading(true)
        try {
            await cashControlService.create(data)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createCashControl }
}
