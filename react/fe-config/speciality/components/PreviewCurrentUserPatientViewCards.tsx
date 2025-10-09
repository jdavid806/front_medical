import React from "react"
import { PreviewSpecialtyPatientViewCards } from "./PreviewSpecialtyPatientViewCards"
import { getUserLogged } from "../../../../services/utilidades"
import { useLoggedUser } from "../../../users/hooks/useLoggedUser"

export const PreviewCurrentUserPatientViewCards = () => {

    const { loggedUser } = useLoggedUser()

    return (
        <div>
            <PreviewSpecialtyPatientViewCards userId={loggedUser?.id} />
        </div>
    )
}