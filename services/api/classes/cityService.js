import OneToManyService from './oneToManyService.js';

export class CityService extends OneToManyService {
    async getAll() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'Santo Domingo' },
                    { id: 2, name: 'Santiago de los Caballeros' },
                    { id: 3, name: 'La Vega' },
                    { id: 4, name: 'San Pedro de Macorís' },
                    { id: 5, name: 'La Romana' },
                    { id: 6, name: 'San Cristóbal' },
                    { id: 7, name: 'Punta Cana' }
                ]);
            }, 500);
        });
    }
}

export default CityService;