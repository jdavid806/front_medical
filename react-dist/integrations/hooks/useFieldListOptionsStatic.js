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
      default:
        return [];
    }
  };
  return {
    loadOptions
  };
};