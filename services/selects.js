import 'https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js';
import { userService, userSpecialtyService, countryService, cityService } from "./api/index.js";

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

export const countriesSelect = async (element) => {
    const data = await countryService.getAll()
    const mappedData = data.map(item => {
        return {
            value: item.id,
            label: `${item.name}`
        }
    })
    console.log("paises: ", mappedData, element);
    new Choices(element, {
        items: mappedData,
        choices: mappedData
    });
}

export const citiesSelect = async (element) => {
    const data = await cityService.getAll()
    const mappedData = data.map(item => {
        return {
            value: item.id,
            label: `${item.name}`
        }
    })
    console.log("ciudades: ", mappedData, element);

    new Choices(element, {
        items: mappedData,
        choices: mappedData
    });
}