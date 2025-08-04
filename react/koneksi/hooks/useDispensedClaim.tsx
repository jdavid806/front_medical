import React, { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler";
import { getDispensedClaim } from "../../../services/koneksiService";

export const useDispensedClaim = () => {
    const [dispensedClaim, setDispensedClaim] = useState<any | null>(null);
    const [dispensedClaimFiles, setDispensedClaimFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDispensedClaim = async (claimId: string) => {
        try {
            const data = await getDispensedClaim({ claimId });
            setDispensedClaimFiles(data.files);
            setDispensedClaim(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        dispensedClaim,
        dispensedClaimFiles,
        fetchDispensedClaim,
        loading
    };
};
