import { productService } from "../../../services/api";
import { CustomSelectContainerConfig } from "../../components/CustomSelectContainer";

export const productsAndServicesSelect: CustomSelectContainerConfig = {
  selectId: "productsAndServicesId",
  promise: productService.getAllProducts(),
  mapper: (data: any[]) => {
    console.log(data);
    return data["data"].map((item) => {
      return {
        label: item.attributes.name,
        value: JSON.stringify(item),
      };
    });
  },
  label: "Productos y servicios",
  required: true,
  multiple: false,
  name: "productsAndServices",
};
