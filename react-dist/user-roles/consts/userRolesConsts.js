export const userFormRolesSelect = {
  selectId: 'userFormSpecialtyId',
  data: [{
    value: '1',
    label: 'Administrador'
  }, {
    value: '2',
    label: 'Secretaria'
  }, {
    value: '3',
    label: 'Medico'
  }, {
    value: '4',
    label: 'Enfermera'
  }],
  mapper: data => {
    return data.map(item => {
      return {
        label: item.name,
        value: item.id
      };
    });
  },
  label: 'Rol',
  required: true,
  multiple: false
};