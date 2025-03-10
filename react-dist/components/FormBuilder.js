import React, { useState, useEffect } from 'react';
import { Editor } from 'primereact/editor';
import { CustomModal } from "../components/CustomModal.js";
export const FormBuilder = () => {
  const [tabs, setTabs] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newFieldData, setNewFieldData] = useState({
    type: 'text',
    label: '',
    options: ''
  });
  const [currentCard, setCurrentCard] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('../../ConsultasJson/formData.json');
        const data = await response.json();
        console.log(data);
        initializeForm(data.form1);
      } catch (error) {
        console.error("Error cargando el JSON:", error);
      }
    };
    fetchData();
  }, []);
  const initializeForm = formData => {
    const initialFormValues = {};
    const initializedTabs = formData.tabs.map(tab => {
      // Procesar todas las cards
      const cards = Object.keys(tab).filter(key => key.startsWith('card')).flatMap(key => tab[key]) // Aplanar todos los arrays de cards
      .map(card => {
        // Procesar campos y sus valores iniciales
        const fields = card.fields.map(field => {
          // Inicializar valor principal
          initialFormValues[field.id] = field.type === 'checkbox' ? false : '';

          // Inicializar subcampos de checkbox
          if (field.type === 'checkbox' && field.toggleFields) {
            field.toggleFields.forEach(subField => {
              initialFormValues[subField.id] = '';
            });
          }
          return field;
        });
        return {
          ...card,
          fields
        };
      });
      return {
        ...tab,
        cards
      };
    });
    setFormValues(initialFormValues);
    setTabs(initializedTabs);
  };
  const handleEditorChange = (html, fieldId) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: html
    }));
  };
  const renderField = field => {
    switch (field.type) {
      case 'textarea':
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
          htmlFor: field.id,
          className: "form-label"
        }, field.label), /*#__PURE__*/React.createElement(Editor, {
          value: formValues[field.id] || '',
          onTextChange: e => handleEditorChange(e.htmlValue, field.id),
          style: {
            height: '150px'
          }
        }));
      case 'select':
        return /*#__PURE__*/React.createElement("div", {
          className: "mb-3 form-floating"
        }, /*#__PURE__*/React.createElement("select", {
          className: "form-select",
          id: field.id,
          value: formValues[field.id] || '',
          onChange: e => setFormValues(prev => ({
            ...prev,
            [field.id]: e.target.value
          }))
        }, /*#__PURE__*/React.createElement("option", {
          value: "",
          disabled: true
        }, "Seleccione"), field.options.map((opt, i) => /*#__PURE__*/React.createElement("option", {
          key: i,
          value: opt.value
        }, opt.text))), /*#__PURE__*/React.createElement("label", {
          htmlFor: field.id
        }, field.label));
      case 'checkbox':
        return /*#__PURE__*/React.createElement("div", {
          className: "form-check mb-3 p-0"
        }, /*#__PURE__*/React.createElement("div", {
          className: "d-flex gap-2 align-items-center form-check form-switch mb-2"
        }, /*#__PURE__*/React.createElement("input", {
          className: "form-check-input",
          type: "checkbox",
          id: field.id,
          checked: formValues[field.id] || false,
          onChange: e => {
            setFormValues(prev => ({
              ...prev,
              [field.id]: e.target.checked
            }));
          }
        }), /*#__PURE__*/React.createElement("label", {
          className: "form-check-label",
          htmlFor: field.id
        }, field.label)), formValues[field.id] && field.toggleFields?.map(subField => /*#__PURE__*/React.createElement("div", {
          key: subField.id
        }, subField.type === 'textarea' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
          htmlFor: subField.id,
          className: "form-label"
        }, subField.label), /*#__PURE__*/React.createElement(Editor, {
          value: formValues[subField.id] || '',
          onTextChange: e => handleEditorChange(e.htmlValue, subField.id),
          style: {
            height: '100px'
          }
        })) : /*#__PURE__*/React.createElement("input", {
          type: "text",
          className: "form-control",
          id: subField.id,
          placeholder: subField.placeholder,
          value: formValues[subField.id] || '',
          onChange: e => setFormValues(prev => ({
            ...prev,
            [subField.id]: e.target.value
          }))
        }))));
      case 'number':
        return /*#__PURE__*/React.createElement("div", {
          className: "mb-3 form-floating"
        }, /*#__PURE__*/React.createElement("input", {
          type: "number",
          className: "form-control",
          id: field.id,
          value: formValues[field.id] || '',
          onChange: e => setFormValues(prev => ({
            ...prev,
            [field.id]: e.target.value
          }))
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: field.id
        }, field.label));
      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "mb-3 form-floating"
        }, /*#__PURE__*/React.createElement("input", {
          type: "text",
          className: "form-control",
          id: field.id,
          value: formValues[field.id] || '',
          onChange: e => setFormValues(prev => ({
            ...prev,
            [field.id]: e.target.value
          }))
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: field.id
        }, field.label));
    }
  };
  const addNewTab = () => {
    const tabName = prompt('Ingrese el nombre de la nueva pestaña:');
    if (tabName) {
      setTabs(prev => [...prev, {
        tab: tabName,
        cards: [{
          title: 'Nueva Tarjeta',
          fields: []
        }]
      }]);
      setActiveTab(tabs.length);
    }
  };
  const addNewCard = tabIndex => {
    const cardName = prompt('Ingrese el nombre de la tarjeta:', 'Nueva Tarjeta');
    if (cardName) {
      setTabs(prev => prev.map((tab, index) => {
        if (index === tabIndex) {
          return {
            ...tab,
            cards: [...tab.cards, {
              title: cardName,
              fields: []
            }]
          };
        }
        return tab;
      }));
    }
  };
  const handleAddField = () => {
    const newField = {
      id: `field-${Date.now()}`,
      label: newFieldData.label,
      type: newFieldData.type,
      ...(newFieldData.type === 'select' && {
        options: newFieldData.options.split(',').map(opt => ({
          value: opt.trim(),
          text: opt.trim()
        }))
      }),
      ...(newFieldData.type === 'checkbox' && {
        toggleFields: [{
          type: 'textarea',
          id: `subfield-${Date.now()}`,
          label: '',
          placeholder: newFieldData.label
        }]
      })
    };
    setTabs(prev => prev.map(tab => {
      if (tab.cards.some(card => card === currentCard)) {
        return {
          ...tab,
          cards: tab.cards.map(card => {
            if (card === currentCard) {
              return {
                ...card,
                fields: [...card.fields, newField]
              };
            }
            return card;
          })
        };
      }
      return tab;
    }));
    setShowFieldModal(false);
    setNewFieldData({
      type: 'text',
      label: '',
      options: ''
    });
  };
  const getFormConfiguration = () => {
    return {
      tabs: tabs.map(tab => ({
        tab: tab.tab,
        cards: tab.cards.map(card => ({
          title: card.title,
          fields: card.fields.map(field => ({
            ...field,
            value: formValues[field.id]
          }))
        }))
      })),
      values: formValues
    };
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-tabs",
    id: "customTabs"
  }, tabs.map((tab, index) => /*#__PURE__*/React.createElement("li", {
    key: index,
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`,
    onClick: () => setActiveTab(index)
  }, tab.tab))), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary ms-2",
    onClick: addNewTab
  }, "Agregar Pesta\xF1a"))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content mt-4"
  }, tabs.map((tab, tabIndex) => /*#__PURE__*/React.createElement("div", {
    key: tabIndex,
    className: `tab-pane fade ${activeTab === tabIndex ? 'show active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, tab.cards?.map((card, cardIndex) => /*#__PURE__*/React.createElement("div", {
    key: cardIndex,
    className: "col-12 col-md-6 col-lg-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, card.title), card.fields?.map((field, fieldIndex) => /*#__PURE__*/React.createElement("div", {
    key: fieldIndex
  }, renderField(field))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm mt-2",
    onClick: () => {
      setCurrentCard(card);
      setShowFieldModal(true);
    }
  }, "Agregar Campo")))))), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => addNewCard(tabIndex)
  }, "Agregar Tarjeta"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      const config = getFormConfiguration();
      console.log(config);
    }
  }, "Guardar formulario"))))), /*#__PURE__*/React.createElement(CustomModal, {
    show: showFieldModal,
    onHide: () => setShowFieldModal(false),
    title: "Agregar Nuevo Campo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de Campo"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: newFieldData.type,
    onChange: e => setNewFieldData(prev => ({
      ...prev,
      type: e.target.value
    }))
  }, /*#__PURE__*/React.createElement("option", {
    value: "text"
  }, "Texto"), /*#__PURE__*/React.createElement("option", {
    value: "textarea"
  }, "\xC1rea de Texto"), /*#__PURE__*/React.createElement("option", {
    value: "select"
  }, "Selecci\xF3n"), /*#__PURE__*/React.createElement("option", {
    value: "checkbox"
  }, "Checkbox"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Etiqueta"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    value: newFieldData.label,
    onChange: e => setNewFieldData(prev => ({
      ...prev,
      label: e.target.value
    }))
  })), newFieldData.type === 'select' && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Opciones (separadas por comas)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    value: newFieldData.options,
    onChange: e => setNewFieldData(prev => ({
      ...prev,
      options: e.target.value
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setShowFieldModal(false)
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: handleAddField
  }, "Guardar"))));
};