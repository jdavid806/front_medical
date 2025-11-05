import { CashRegisterProduct } from "../interfaces";

export class CashRegisterProductHelper {
    static calculateTotal(products: CashRegisterProduct[]) {
        return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    }
}