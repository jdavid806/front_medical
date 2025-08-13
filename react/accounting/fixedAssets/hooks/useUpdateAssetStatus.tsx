import { useState } from "react";
import AssetsService from "../../../../services/api/classes/assetsService";
import { ErrorHandler } from "../../../../services/errorHandler";

export interface UpdateAssetStatusBody {
  status: string;
  status_type: string | null;
  status_changed_at: string | null;
  maintenance_cost: number;
  status_comment: string | null;
}

export const useUpdateAssetStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const updateAssetStatus = async (assetId: string | number, body: UpdateAssetStatusBody) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const service = new AssetsService();
            await service.updateAssetStatus(assetId, body);
            setSuccess(true);
        } catch (err) {
            setError(err as Error);
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateAssetStatus,
        loading,
        error,
        success
    };
};