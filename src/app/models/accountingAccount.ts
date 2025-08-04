import { IsoDate, UUID } from "./common.model";

/////////////////////////
///// Api interface /////
/////////////////////////

export interface IAccountingAccount {
  id: UUID;
  accountingccount: string;
  otherData?: {
    classCode: string;
    groupCode: string;
    accountCode: string;
    subAccountCode: string;
    assistantCode: string;
    category: string;
    detail: string;
    niif: boolean;
    status: boolean;
  };
  children?: IAccountingAccount[];
}

///////////////////
///// Adapter /////
///////////////////

export class AccountingAccount {
  id: UUID;
  accountingccount: string;
  otherData?: {
    classCode: string;
    groupCode: string;
    accountCode: string;
    subAccountCode: string;
    assistantCode: string;
    category: string;
    detail: string;
    niif: boolean;
    status: boolean;
  };
  children?: AccountingAccount[];

  constructor(accountingAccount: IAccountingAccount) {
    this.id = accountingAccount.id;
    this.accountingccount = accountingAccount.accountingccount;
    this.otherData = accountingAccount.otherData ? accountingAccount.otherData : undefined;
    this.children = accountingAccount.children ? accountingAccount.children.map(element => new AccountingAccount(element)) : undefined;
  }

  findById(id: UUID): AccountingAccount | undefined {
    if (this.id === id) {
      return this;
    }

    if (this.children) {
      for (const child of this.children) {
        const result = child.findById(id);
        if (result) {
          return result;
        }
      }
    }

    return undefined;
  }
}
