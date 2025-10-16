export const useFieldListOptionsStatic = source => {
  const loadOptions = () => {
    switch (source) {
      case "DGII_TENANTS":
        return [{
          label: "DGII - 1",
          value: "DGII_1"
        }, {
          label: "DGII - 2",
          value: "DGII_2"
        }, {
          label: "DGII - 3",
          value: "DGII_3"
        }];
      case "SISPRO_ID_TYPE":
        return [{
          label: "Cédula de ciudadanía",
          value: "CC"
        }, {
          label: "Cédula de extranjería",
          value: "CE"
        }, {
          label: "Pasaporte",
          value: "PA"
        }];
      default:
        return [];
    }
  };
  return {
    loadOptions
  };
};