import { MedicalSupply } from "../pharmacy/supplies/interfaces";

export class MedicalSupplyManager {
    private data: MedicalSupply;

    constructor(data: MedicalSupply) {
        this.data = data;
    }

    public getSubtotal(): number {
        return this.data.products.reduce((total, item) => total + item.product.sale_price * item.quantity, 0);
    }
}
