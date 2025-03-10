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

export const countriesSelect = async (element, onChange, initialValue = '') => {
    const data = await countryService.getAll()

    const mappedData = data.data.filter(country => [
        "AR",
        "BO",
        "BR",
        "CL",
        "CO",
        "CR",
        "CU",
        "DO",
        "EC",
        "SV",
        "GT",
        "HN",
        "MX",
        "NI",
        "PA",
        "PY",
        "PE",
        "PR",
        "UY",
        "VE"
    ].includes(country.iso2)).map(item => {
        return {
            value: item.name,
            label: `${item.name}`,
            customProperties: {
                id: item.id
            }
        }
    })

    if (element.choicesInstance) {
        element.choicesInstance.clearStore();
        element.choicesInstance.setChoices(mappedData, 'value', 'label', true);
    } else {
        element.choicesInstance = new Choices(element, {
            items: mappedData,
            choices: mappedData
        });
    }

    if (initialValue) {
        const selectedCountry = mappedData.find(c => c.value == initialValue);
        if (selectedCountry) {
            element.choicesInstance.setChoiceByValue(selectedCountry.value);
        }
    }

    element.addEventListener('change', (event) => {
        const selectedOption = element.choicesInstance.getValue();
        onChange(selectedOption);
    });
}

export const departmentsSelect = async (element, countryId, onChange, initialValue = '') => {
    const data = await departmentService.ofParent(countryId);
    const mappedData = data.map(item => ({
        value: item.name,
        label: `${item.name}`,
        customProperties: {
            id: item.id
        }
    }));

    if (element.choicesInstance) {
        element.choicesInstance.clearStore();
        element.choicesInstance.setChoices(mappedData, 'value', 'label', true);
    } else {
        element.choicesInstance = new Choices(element, {
            items: mappedData,
            choices: mappedData
        });
    }

    if (initialValue) {
        const selectedDept = mappedData.find(c => c.value == initialValue);
        if (selectedDept) {
            element.choicesInstance.setChoiceByValue(selectedDept.value);
        }
    }

    element.addEventListener('change', (event) => {
        const selectedOption = element.choicesInstance.getValue();
        onChange(selectedOption);
    });
};

export const citiesSelect = async (element, departmentId, onChange, initialValue = '') => {
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

    if (element.choicesInstance) {
        element.choicesInstance.clearStore();
        element.choicesInstance.setChoices(mappedData, 'value', 'label', true);
    } else {
        element.choicesInstance = new Choices(element, {
            items: mappedData,
            choices: mappedData
        });
    }

    if (initialValue) {
        const selectedCity = mappedData.find(c => c.value == initialValue);
        if (selectedCity) {
            element.choicesInstance.setChoiceByValue(selectedCity.value);
        }
    }

    element.addEventListener('change', (event) => {
        const selectedOption = element.choicesInstance.getValue();
        onChange(selectedOption);
    });
}