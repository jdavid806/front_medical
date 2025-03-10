import React, { useState } from 'react';
import { CustomSelect } from "../components/CustomSelect.js";
import { useId } from 'react';
import { useCities } from "./hooks/useCities.js";
export const CitiesSelect = ({
  multiple,
  required = false,
  onSelect
}) => {
  const [selectedCities, setSelectedCities] = useState([]);
  const {
    cities
  } = useCities();
  const id = useId();
  const handleChange = countries => {
    setSelectedCities(countries);
    onSelect(countries);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomSelect, {
    selectId: id,
    options: cities.map(city => ({
      value: city.id,
      label: city.name
    })),
    value: selectedCities,
    required: required,
    onChange: handleChange,
    multiple: multiple,
    label: "Ciudad"
  }));
};