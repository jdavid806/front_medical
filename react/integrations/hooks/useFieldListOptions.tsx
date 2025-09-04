import React, { useEffect, useState } from "react";
import { useFieldListOptionsStatic } from "./useFieldListOptionsStatic";
import { useFieldListOptionsApi } from "./useFieldListOptionsApi";
import { GenericListItemI } from "../interfaces";

export const useFieldListOptions = (source: string, sourceType: string) => {
    const [options, setOptions] = useState<GenericListItemI[]>([]);

    const { loadOptions: loadOptionsStatic } = useFieldListOptionsStatic(source);
    const { loadOptions: loadOptionsApi } = useFieldListOptionsApi(source);

    useEffect(() => {
        const fetchOptions = async () => {
            if (sourceType === "api") {
                const options = await loadOptionsApi();
                setOptions(options);
            }
            if (sourceType === "static") {
                setOptions(loadOptionsStatic());
            }
        };
        fetchOptions();
    }, [sourceType]);

    return { options };
};