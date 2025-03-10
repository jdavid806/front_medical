import React, { useState } from 'react';
import { useCountries } from "./hooks/useCountries.js";
import { useId } from 'react';
import { CustomSelect } from "../components/CustomSelect.js";
const CountriesSelect = ({
  multiple,
  required = false,
  onSelect
}) => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const {
    countries
  } = useCountries();
  const id = useId();
  const handleChange = countries => {
    setSelectedCountries(countries);
    onSelect(countries);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomSelect, {
    selectId: id,
    options: countries.map(country => ({
      value: country.id,
      label: country.name
    })),
    value: selectedCountries,
    required: required,
    onChange: handleChange,
    multiple: multiple,
    label: "Pa\xEDs"
  }));
};
export default CountriesSelect;