import { IsoDate, UUID } from "./common.model";

/////////////////////////
///// Api interface /////
/////////////////////////

export interface IMovements {
  id: UUID;
  date: IsoDate;
  accountingCode: string;
  accountingAccount: string;
  clientId: string;
  branchOffice: string;
  thirdName: string;
  description: string;
  detail: string;
  centerCorst: string;
  cost: number;
  voucher?: string;
}

///////////////////
///// Adapter /////
///////////////////

export class Movements {
  id: UUID;
  date: Date;
  accountingCode: string;
  accountingAccount: string;
  clientId: string;
  branchOffice: string;
  thirdName: string;
  description: string;
  detail: string;
  centerCorst: string;
  cost: number;
  voucher?: string;

  constructor(movements: IMovements) {
    this.id = movements.id;
    this.date = new Date(movements.date);
    this.accountingCode = movements.accountingCode;
    this.accountingAccount = movements.accountingAccount;
    this.clientId = movements.clientId;
    this.branchOffice = movements.branchOffice;
    this.thirdName = movements.thirdName;
    this.description = movements.description;
    this.detail = movements.detail;
    this.centerCorst = movements.centerCorst;
    this.cost = movements.cost;
    this.voucher = movements.voucher ? movements.voucher : 'NaN';
  }

  get parsedDate(): string {
    return this.date.getDay() + '/' + this.date.getMonth() + '/' + this.date.getFullYear();
  }
}
