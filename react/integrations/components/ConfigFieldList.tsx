import React from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { ConfigFieldListSingle } from "./ConfigFieldListSingle";
import { ConfigFieldListMultiple } from "./ConfigFieldListMultiple";
import { useFieldListOptions } from "../hooks/useFieldListOptions";

export const ConfigFieldList = (props: DynamicConfigFieldProps) => {
    const { multiple, source, sourceType } = props;

    const { options } = useFieldListOptions(source || "", sourceType || "");

    return (<>
        {!multiple && (
            <ConfigFieldListSingle {...props} options={options} />
        )}
        {multiple && (
            <ConfigFieldListMultiple {...props} options={options} />
        )}
    </>);
};