import { url } from "../../../services/globalMedical";
import { VerifySupervisorFormData } from "../VerifySupervisorForm";

export const useVerifySupervisor = () => {
    const verifySupervisor = async (data: VerifySupervisorFormData) => {
        try {
            const response = await fetch(`api/auth/check-supervisor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            return await response.json()
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return {
        verifySupervisor
    }
}

