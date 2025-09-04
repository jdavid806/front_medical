export interface ConfigFieldI {
    configKey: string;
    field: string;
    label: string;
    type?: string;
    initialValue?: string;
    source?: string;
    sourceType?: string;
    multiple?: boolean;
    placeholder?: string;
    description?: string;
}

export interface UseIntegrationFormProps {
    configs: any[];
    initialConfigFields: ConfigFieldI[];
}

export interface DynamicIntegrationFormProps {
    configs: any[];
    initialConfigFields: ConfigFieldI[];
    onSubmit: (data: any) => void;
}

export interface DynamicConfigFieldProps {
    field: string;
    label: string;
    initialValue?: string;
    source?: string;
    sourceType?: string;
    multiple?: boolean;
    placeholder?: string;
    type?: string;
    description?: string;
    onChange: (value: string) => void;
    onFileChange?: ({ field, file }: { field: string; file: File | null }) => void;
}

export interface DynamicConfigFieldListProps extends DynamicConfigFieldProps {
    options?: any[];
}

export interface GenericListItemI {
    label: string;
    value: string;
}

export interface IntegrationConfigFormProps {
    configs?: any;
}