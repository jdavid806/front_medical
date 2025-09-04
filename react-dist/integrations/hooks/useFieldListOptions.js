import { useEffect, useState } from "react";
import { useFieldListOptionsStatic } from "./useFieldListOptionsStatic.js";
import { useFieldListOptionsApi } from "./useFieldListOptionsApi.js";
export const useFieldListOptions = (source, sourceType) => {
  const [options, setOptions] = useState([]);
  const {
    loadOptions: loadOptionsStatic
  } = useFieldListOptionsStatic(source);
  const {
    loadOptions: loadOptionsApi
  } = useFieldListOptionsApi(source);
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
  return {
    options
  };
};