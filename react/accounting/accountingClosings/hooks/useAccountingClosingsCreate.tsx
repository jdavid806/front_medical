import { useState } from 'react'
import AccountingClosingsService from '../../../../services/api/classes/accountingClosingsService'
import { AccountingClosingFormInputs } from '../form/AccountingClosingForm'
import { SwalManager } from '../../../../services/alertManagerImported'
import { ErrorHandler } from '../../../../services/errorHandler'

export const useAccountingClosingsCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createAccountingClosing = async (userData: Omit<AccountingClosingFormInputs, 'id'>) => {
        setLoading(true)
        try {
            const service = new AccountingClosingsService();
            const response = await service.create(userData)
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

    return { loading, createAccountingClosing }
}
