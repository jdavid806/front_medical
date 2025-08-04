import { useState } from 'react';
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamTypeUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateExamType = async (id, data) => {
    setLoading(true);
    try {
      const finalData = {
        ...data,
        form_config: Object.keys(data.form_config).length > 0 || data.form_config != null && data.form_config != "{}" ? data.form_config : {
          tabs: []
        }
      };
      await examTypeService.update(id, finalData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateExamType,
    loading
  };
};