import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { UseIntegrationFormProps } from "../interfaces";

export const useIntegrationForm = (props: UseIntegrationFormProps) => {

    const { configs, initialConfigFields } = props;
    const { register, setValue, handleSubmit, control } = useForm<{
        files: { field: string, file: File | null }[]
        [key: string]: any
    }>();

    const { fields, append: appendFile, remove: removeFile, update: updateFile } = useFieldArray({
        control,
        name: "files"
    });

    const [configFields, setConfigFields] = useState<any[]>([]);

    useEffect(() => {
        if (configs.length === 0) {
            return;
        }

        initialConfigFields.forEach((field) => {
            const config = configs.find((config: any) => config.key === field.configKey);
            if (config) {
                field.initialValue = config.value;
            }
        });
        setConfigFields(initialConfigFields);
    }, [configs, initialConfigFields]);

    useEffect(() => {
        configFields.forEach((field) => {
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
    }
}
