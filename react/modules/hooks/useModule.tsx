import React, { useState } from "react";
import { ModuleDto } from "../../models/models";
import { moduleService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useModule = () => {
    const [module, setModule] = useState<ModuleDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchModule = async (id: string) => {
        try {
            const data = await moduleService.get(id);
            setModule(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        module,
        fetchModule,
        loading
    };
};
