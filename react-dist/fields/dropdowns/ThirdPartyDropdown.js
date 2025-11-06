import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties.js";
export const ThirdPartyDropdown = props => {
  const {
    value,
    handleChange,
    optionLabel = 'label',
    optionValue = 'value',
    placeholder = 'Seleccione un tercero',
    label = 'Tercero'
  } = props;
  const [mappedThirdParties, setMappedThirdParties] = useState([]);
  const {
    thirdParties
  } = useThirdParties();
  useEffect(() => {
    const mapped = thirdParties.map(thirdParty => ({
      ...thirdParty,
      label: thirdParty.name,
      value: thirdParty.id
    }));
    setMappedThirdParties(mapped);
  }, [thirdParties]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "thirdParty"
  }, label), /*#__PURE__*/React.createElement(Dropdown, {
    id: "thirdParty",
    value: value,
    onChange: handleChange,
    options: mappedThirdParties,
    optionLabel: optionLabel,
    optionValue: optionValue,
    placeholder: placeholder,
    className: "w-100",
    filter: true,
    showClear: true
  })));
};