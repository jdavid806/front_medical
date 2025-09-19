import { useState } from 'react'
import { ErrorHandler } from '../../../services/errorHandler'
import { SwalManager } from '../../../services/alertManagerImported'
import { UserRoleFormInputs } from '../components/UserRoleForm'
import { userRolesService } from '../../../services/api'

export const useUserRoleCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)

    const createUserRole = async (userRoleData: Omit<UserRoleFormInputs, 'id'>) => {
        setLoading(true)
        try {
            console.log('Data a enviar:', userRoleData);
            const finalData = {
                role: {
                    group: userRoleData.group,
                    name: userRoleData.name
                },
                menus: userRoleData.menus, 
                permissions: userRoleData.permissions
            }
            await userRolesService.storeMenusPermissions(finalData)
            SwalManager.success()
        } catch (error) {
            ErrorHandler.generic(error)
        } finally {
            setLoading(false)
        }
    }

    return { loading, createUserRole }
}
