import React, { useState, useEffect } from 'react';
import { DynamicFormCardSummary } from "./components/DynamicFormCardSummary.js";
import { DynamicFormTabs } from "../dynamic-form/components/DynamicFormTabs.js";
export const DynamicFormSummary = ({
  form
}) => {
  const [tabs, setTabs] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    if (form) {
      initializeForm(form);
    }
  }, [form]);
  const initializeForm = formData => {
    const initialFormValues = {};
    const initializedTabs = formData.tabs.map(tab => ({
      ...tab,
      cards: Object.keys(tab).filter(key => key.startsWith('card')).flatMap(key => tab[key]).map((card, index) => ({
        ...Object.assign(card, {
          id: `card-${index}`
        }),
        fields: card.fields.map(field => {
          if (formData.values?.[field.id]) {
            initialFormValues[field.id] = formData.values[field.id];
          } else {
            initialFormValues[field.id] = field.type === 'checkbox' ? false : '';
          }
          if (field.type === 'checkbox' && field.toggleFields) {
            field.toggleFields.forEach(subField => {
              if (!formData.values?.[subField.id]) {
                initialFormValues[subField.id] = '';
              } else {
                initialFormValues[subField.id] = formData.values[subField.id];
              }
            });
          }
          return field;
        })
      }))
    }));
    setFormValues(initialFormValues);
    setTabs(initializedTabs);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement(DynamicFormTabs, {
    tabs: tabs,
    activeTab: activeTab,
    setActiveTab: setActiveTab
  }), /*#__PURE__*/React.createElement("div", {
    className: "tab-content mt-4"
  }, tabs.map((tab, tabIndex) => /*#__PURE__*/React.createElement("div", {
    key: tabIndex,
    className: `tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, tab.cards?.map((card, cardIndex) => /*#__PURE__*/React.createElement(DynamicFormCardSummary, {
    key: cardIndex,
    card: card,
    formValues: formValues
  })))))));
};