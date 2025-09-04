import { userService } from "../../../services/api/index.js";
export const useFieldListOptionsApi = source => {
  const loadOptions = async () => {
    switch (source) {
      case "USERS":
        const response = await userService.getAll();
        return response.map(user => ({
          label: `${user.first_name || ""} ${user.last_name || ""} ${user.middle_name || ""} ${user.second_last_name || ""}`,
          value: `${user.id}`
        }));
      default:
        return [];
    }
  };
  return {
    loadOptions
  };
};