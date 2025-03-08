import { useState } from 'react'
import { moduleService } from '../../../services/api'
import { ModuleFormInputs } from '../components/ModuleForm'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'

export const useModuleCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createModule = async (moduleData: Omit<ModuleFormInputs, 'id'>) => {
        setLoading(true)
        try {
            await moduleService.create(moduleData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createModule }
}
