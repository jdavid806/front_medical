import React, { useEffect, useRef } from "react";
import Choices from "choices.js";

export interface CustomSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  data?: any;
}
export interface CustomSelectProps {
  selectId: string;
  options: CustomSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  required?: boolean;
  showLabel?: boolean;
  label?: string;
  name?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  selectId,
  options,
  value,
  onChange,
  multiple,
  required = false,
  showLabel = true,
  label = "",
  name,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const choicesInstance = useRef<any | null>(null);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        removeItemButton: multiple,
        shouldSort: false,
        duplicateItemsAllowed: false,
      });

      selectRef.current.addEventListener("change", handleChange);
    }

    return () => {
      if (choicesInstance.current) {
        selectRef.current?.removeEventListener("change", handleChange);
        choicesInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (choicesInstance.current && value) {
      choicesInstance.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (choicesInstance.current) {
      choicesInstance.current.setChoices(options, "value", "label", true);
    }
  }, [options]);

  const handleChange = () => {
    if (selectRef.current) {
      const selectedValues = Array.from(selectRef.current.options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setSelectedValues(selectedValues);

      if (onChange) {
        onChange(selectedValues);
      }
    }
  };

  return (
    <>
      {showLabel && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && "*"}
        </label>
      )}
      <select
        id={selectId}
        ref={selectRef}
        multiple={multiple}
        className="form-select"
        style={{ display: "none" }}
        required={required}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <input type="hidden" name={name} value={selectedValues} />
    </>
  );
};
