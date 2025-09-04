import React, { useEffect, useState } from "react";
import { GenericListItemI } from "../interfaces";

export const useFieldListOptionsStatic = (source: string) => {
    const loadOptions = (): GenericListItemI[] => {
        switch (source) {
            case "DGII_TENANTS":
                return [
                    { label: "DGII - 1", value: "DGII_1" },
                    { label: "DGII - 2", value: "DGII_2" },
                    { label: "DGII - 3", value: "DGII_3" },
                ];
            default:
                return [];
        }
    };

    return { loadOptions };
};