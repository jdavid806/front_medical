import React, { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler";
import { viewDocument } from "../../../services/koneksiService";

export const useViewDocument = () => {
    const [loading, setLoading] = useState(true);

    const viewDocumentPDF = async (fileId: string) => {
        try {
            await viewDocument({ fileId });
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        viewDocumentPDF,
        loading
    };
};
