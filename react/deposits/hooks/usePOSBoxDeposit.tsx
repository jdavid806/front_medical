import { useEffect, useState } from "react";
import { depositService } from "../../../services/api";

export const usePOSBoxDeposit = () => {
    const [posBoxDeposit, setPosBoxDeposit] = useState<any | null>(null);

    const fetchPOSBoxDeposit = async () => {
        try {
            const response = await depositService.getPOSBoxDeposit();
            setPosBoxDeposit(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPOSBoxDeposit();
    }, []);

    return {
        posBoxDeposit,
        fetchPOSBoxDeposit
    };
};
