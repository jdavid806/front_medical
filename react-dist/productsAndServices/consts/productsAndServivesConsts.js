import { productService } from "../../../services/api/index.js";
export const productsAndServicesSelect = {
  selectId: "productsAndServicesId",
  promise: productService.getAllProducts(),
  mapper: data => {
    console.log(data);
    return data["data"].map(item => {
      return {
        label: item.attributes.name,
        value: JSON.stringify(item)
      };
    });
  },
  label: "Productos y servicios",
  required: true,
  multiple: false,
  name: "productsAndServices"
};