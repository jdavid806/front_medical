import { IsoDate, UUID } from "./common.model";

export interface IMovements {
  id: UUID;
  date: IsoDate;
  accountingAccount: string;
  accountingCode: string;
  branchOffice: string;
  centerCorst: string; // Nota: Mantengo el nombre original 'centerCorst'
  clientId: string;
  description: string;
  detail: string;
  thirdName: string;
  cost: number;
  voucher: string;
}

export class Movements {
  id: UUID;
  date: Date;
  accountingAccount: string;
  accountingCode: string;
  branchOffice: string;
  centerCorst: string;
  clientId: string;
  description: string;
  detail: string;
  thirdName: string;
  cost: number;
  voucher: string;

  constructor(movement: IMovements) {
    this.id = movement.id;
    this.date = new Date(movement.date);
    this.accountingAccount = movement.accountingAccount;
    this.accountingCode = movement.accountingCode;
    this.branchOffice = movement.branchOffice;
    this.centerCorst = movement.centerCorst;
    this.clientId = movement.clientId;
    this.description = movement.description;
    this.detail = movement.detail;
    this.thirdName = movement.thirdName;
    this.cost = movement.cost;
    this.voucher = movement.voucher;
  }

  get parsedDate(): string {
    return `${this.date.getDate()}/${this.date.getMonth() + 1}/${this.date.getFullYear()}`;
  }
}
