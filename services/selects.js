import 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js';
import { userService, userSpecialtyService, countryService, cityService, departmentService } from "./api/index.js";

export const usersSelect = async (element) => {
    const users = await userService.getAll()
    const mappedUsers = users.map(user => {
        return {
            value: user.id,
            label: `${user.first_name} ${user.last_name}`
        }
    })
    const usersChoices = new Choices(element, {
        items: mappedUsers,
        choices: mappedUsers
    });
    console.log(usersChoices);
}

export const usersSelectWithData = (data, element) => {
    const mappedUsers = data.map(user => {
        return {
            value: user.id,
            label: `${user.first_name} ${user.last_name}`
        }
    })
    console.log(mappedUsers);

    return new Choices(element, {
        items: mappedUsers,
        choices: mappedUsers
    });
}

export const userSpecialtiesSelect = async (element) => {
    const data = await userSpecialtyService.getAllItems()
    const mappedData = data.map(item => {
        return {
            value: item.id,
            label: `${item.name}`
        }
    })
    new Choices(element, {
        items: mappedData,
        choices: mappedData
    });
}

export const countriesSelect = async (element, onChange) => {
    const data = await countryService.getAll()
    const mappedData = data.data.map(item => {
        return {
            value: item.name,
            label: `${item.name}`,
            customProperties: {
                id: item.id
            }
        }
    })
    console.log("paises: ", mappedData, element);
    const choices = new Choices(element, {
        items: mappedData,
        choices: mappedData
    });

    element.addEventListener('change', (event) => {
        const selectedOption = choices.getValue();
        onChange(selectedOption);
    });
}

export const departmentsSelect = async (element, countryId, onChange) => {
    const data = await departmentService.ofParent(countryId);
    const mappedData = data.map(item => ({
        value: item.name,
        label: `${item.name}`,
        customProperties: {
            id: item.id
        }
    }));

    console.log("Departamentos: ", mappedData, element);

    if (element.choicesInstance) {
        element.choicesInstance.clearStore();
        element.choicesInstance.setChoices(mappedData, 'value', 'label', true);
    } else {
        element.choicesInstance = new Choices(element, {
            items: mappedData,
            choices: mappedData
        });
    }

    element.addEventListener('change', (event) => {
        const selectedOption = element.choicesInstance.getValue();
        onChange(selectedOption);
    });
};

export const citiesSelect = async (element, departmentId, onChange) => {
    const data = await cityService.ofParent(departmentId)
    const mappedData = data.map(item => {
        return {
            value: item.name,
            label: `${item.name}`,
            customProperties: {
                id: item.id
            }
        }
    })

    console.log("Ciudades: ", mappedData, element);

    if (element.choicesInstance) {
        element.choicesInstance.clearStore();
        element.choicesInstance.setChoices(mappedData, 'value', 'label', true);
    } else {
        element.choicesInstance = new Choices(element, {
            items: mappedData,
            choices: mappedData
        });
    }

    element.addEventListener('change', (event) => {
        const selectedOption = element.choicesInstance.getValue();
        onChange(selectedOption);
    });
}