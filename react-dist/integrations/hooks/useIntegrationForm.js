import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
export const useIntegrationForm = props => {
  const {
    configs,
    initialConfigFields
  } = props;
  const {
    register,
    setValue,
    handleSubmit,
    control
  } = useForm();
  const {
    fields,
    append: appendFile,
    remove: removeFile,
    update: updateFile
  } = useFieldArray({
    control,
    name: "files"
  });
  const [configFields, setConfigFields] = useState([]);
  useEffect(() => {
    if (configs.length === 0) {
      return;
    }
    initialConfigFields.forEach(field => {
      const config = configs.find(config => config.key === field.configKey);
      if (config) {
        field.initialValue = config.value;
      }
    });
    setConfigFields(initialConfigFields);
  }, [configs, initialConfigFields]);
  useEffect(() => {
    configFields.forEach(field => {
      register(field.field, {
        value: field.initialValue
      });
    });
  }, [configFields]);
  return {
    configFields,
    setValue,
    handleSubmit,
    appendFile,
    removeFile,
    updateFile
  };
};