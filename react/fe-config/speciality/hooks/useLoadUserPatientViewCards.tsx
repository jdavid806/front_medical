import { useEffect, useState } from "react"
import { userService } from "../../../../services/api"


export const useLoadUserPatientViewCards = () => {

    const [patientViewCards, setPatientViewCards] = useState<string[]>()

    const fetchUserPatientViewCards = async () => {
        try {
            const patientViewConfig = await userService.getPatientViewConfig()
            setPatientViewCards(patientViewConfig.visible_cards)
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    useEffect(() => {
        fetchUserPatientViewCards()
    }, [])

    return {
        fetchUserPatientViewCards,
        patientViewCards
    }
}