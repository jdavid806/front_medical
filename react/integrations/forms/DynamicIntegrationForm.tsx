import React from "react";
import { Button } from "primereact/button";
import { useIntegrationForm } from "../hooks/useIntegrationForm";
import { ConfigField } from "../components/ConfigField";
import { ConfigFieldI, DynamicIntegrationFormProps } from "../interfaces";

export const DynamicIntegrationForm = (props: DynamicIntegrationFormProps) => {
    const { configs, initialConfigFields, onSubmit } = props;
    const { configFields, setValue, handleSubmit, appendFile } = useIntegrationForm({ configs, initialConfigFields });
    return (
        <>
            {configFields.map((field: ConfigFieldI) => (<>
                <ConfigField
                    key={field.field}
                    field={field.field}
                    label={field.label}
                    type={field.type}
                    initialValue={field.initialValue}
                    source={field.source}
                    sourceType={field.sourceType}
                    multiple={field.multiple}
                    onChange={(value) => setValue(field.field, value)}
                    onFileChange={(value) => appendFile(value)}
                    placeholder={field.placeholder}
                    description={field.description}
                />
            </>))}
            <div className="d-flex justify-content-end">
                <Button label="Guardar" onClick={handleSubmit((data) => onSubmit(data))} />
            </div>
        </>
    );
};