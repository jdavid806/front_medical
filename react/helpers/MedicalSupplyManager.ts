import { MedicalSupply, RequestedProduct } from "../pharmacy/supplies/interfaces";
import { userService } from "../../services/api";
import { UserDto } from "../models/models";

interface MedicalSupplyRequestedBy {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    external_id: string;
}

export class MedicalSupplyManager {
    private data: MedicalSupply;

    constructor(data: MedicalSupply) {
        this.data = data;
        // const asyncScope = async () => {
        //     if (!data.requested_by) return;
        //     const user: UserDto = await userService.getByExternalId(data.requested_by);
        //     this.requestedBy = {
        //         name: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`,
        //         email: user.email || '--',
        //         phone: user.phone || '--',
        //         address: user.address || '--'
        //     };
        // }
        //asyncScope();
    }

    get products(): RequestedProduct[] {
        return this.data.products;
    }

    get requestedBy(): MedicalSupplyRequestedBy | null {
        return {
            id: this.data.requested_by_user?.id || '--',
            name: `${this.data.requested_by_user?.first_name || ''} ${this.data.requested_by_user?.middle_name || ''} ${this.data.requested_by_user?.last_name || ''} ${this.data.requested_by_user?.second_last_name || ''}`,
            email: this.data.requested_by_user?.email || '--',
            phone: this.data.requested_by_user?.phone || '--',
            address: this.data.requested_by_user?.address || '--',
            external_id: this.data.requested_by_user?.external_id || '--'
        };
    }

    get statusLabel(): string {
        const statusMap: { [key: string]: string } = {
            'pendiente': 'Pendiente',
            'aprobado': 'Aprobado',
            'rechazado': 'Rechazado',
            'entregado': 'Entregado'
        };
        return statusMap[this.data.status] || this.data.status;
    }

    get statusSeverity(): "success" | "danger" | "warning" | "info" | "secondary" {
        const severityMap: { [key: string]: "success" | "danger" | "warning" | "info" | "secondary" } = {
            'pendiente': 'warning',
            'aprobado': 'success',
            'rechazado': 'danger',
            'entregado': 'info'
        };
        return severityMap[this.data.status] || 'secondary';
    }

    getSubtotal(): number {
        return this.data.products.reduce((total, item) => total + item.product?.sale_price * item.quantity, 0);
    }
}
