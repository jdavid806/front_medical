import React from "react";
import { userService } from "../../../services/api";
import { GenericListItemI } from "../interfaces";

export const useFieldListOptionsApi = (source: string) => {

    const loadOptions = async (): Promise<GenericListItemI[]> => {
        switch (source) {
            case "USERS":
                const response = await userService.getAll();
                return response.map((user: any) => ({
                    label: `${user.first_name || ""} ${user.last_name || ""} ${user.middle_name || ""} ${user.second_last_name || ""}`,
                    value: `${user.id}`,
                }));
            default:
                return [];
        }
    };

    return { loadOptions };
};
