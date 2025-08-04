import { useState } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { viewDocument } from "../../../services/koneksiService.js";
export const useViewDocument = () => {
  const [loading, setLoading] = useState(true);
  const viewDocumentPDF = async fileId => {
    try {
      await viewDocument({
        fileId
      });
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