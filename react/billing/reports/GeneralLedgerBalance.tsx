import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableExpandedRows, DataTableRowEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { AccountingEntry, useAccountingEntries } from "./hooks/useAccountingEntries";

interface AccountGroup {
  account_code: string;
  account_name: string;
  account_type: string;
  balance: number;
  entries: AccountingEntry[];
}

export const GeneralLedgerBalance = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | any>(null);
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const toast = useRef<Toast>(null);
  const { accountingEntries: data } = useAccountingEntries();

  // Procesar datos iniciales
  useEffect(() => {
    if (data && data.data.length > 0) {
      processAccountData(data.data);
    }
  }, [data]);

  // Procesar datos y agrupar por cuenta contable
  const processAccountData = (entries: AccountingEntry[]) => {
    const accountsMap = new Map<string, AccountGroup>();

    entries.forEach(entry => {
      const account = entry.accounting_account;
      if (!accountsMap.has(account.account_code)) {
        accountsMap.set(account.account_code, {
          account_code: account.account_code,
          account_name: account.account_name,
          account_type: account.account_type,
          balance: parseFloat(account.balance),
          entries: []
        });
      }

      accountsMap.get(account.account_code)?.entries.push(entry);
    });

    setAccountGroups(Array.from(accountsMap.values()));
  };

  // Formatear saldo
  const formatBalance = (balance: number) => {
    return Math.abs(balance).toFixed(2);
  };

  // Plantilla de expansión de fila
  const rowExpansionTemplate = (account: AccountGroup) => {
    return (
      <div className="p-3">
        <h5>Movimientos de {account.account_name}</h5>
        <DataTable value={account.entries} size="small">
          <Column field="entry_date" header="Fecha" body={(rowData) => new Date(rowData.entry_date).toLocaleDateString()} />
          <Column field="description" header="Descripción" />
          <Column
            header="Débito"
            body={(rowData) => rowData.type === "debit" ? parseFloat(rowData.amount).toFixed(2) : "-"}
          />
          <Column
            header="Crédito"
            body={(rowData) => rowData.type === "credit" ? parseFloat(rowData.amount).toFixed(2) : "-"}
          />
        </DataTable>
      </div>
    );
  };

  // Determinar si una fila puede expandirse
  const allowExpansion = (rowData: AccountGroup) => {
    return rowData.entries.length > 0;
  };

  return (
    <div className="container-fluid mt-4">
      <Toast ref={toast} />

      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header="Libro Mayor">
          <Card>
            <DataTable
              value={accountGroups}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="account_code"
              tableStyle={{ minWidth: '60rem' }}
            >
              <Column expander={allowExpansion} style={{ width: '3rem' }} />
              <Column field="account_code" header="Código" sortable />
              <Column field="account_name" header="Nombre de Cuenta" sortable />
              <Column
                header="Tipo"
                body={(rowData) => {
                  switch (rowData.account_type) {
                    case "asset": return "Activo";
                    case "liability": return "Pasivo";
                    case "income": return "Ingreso";
                    case "expense": return "Gasto";
                    default: return rowData.account_type;
                  }
                }}
                sortable
              />
              <Column
                header="Saldo"
                body={(rowData) => formatBalance(rowData.balance)}
                sortable
              />
            </DataTable>
          </Card>
        </TabPanel>
        <TabPanel header="Balance">
          <Card>
            <DataTable
              value={accountGroups}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              className="p-datatable-striped"
              emptyMessage="No se encontraron cuentas"
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="account_code" header="Código" />
              <Column field="account_name" header="Nombre de Cuenta" />
              <Column
                header="Tipo"
                body={(rowData) => {
                  switch (rowData.account_type) {
                    case "asset": return "Activo";
                    case "liability": return "Pasivo";
                    case "income": return "Ingreso";
                    case "expense": return "Gasto";
                    default: return rowData.account_type;
                  }
                }}
              />
              <Column
                header="Saldo"
                body={(rowData) => formatBalance(rowData.balance)}
              />
            </DataTable>
          </Card>
        </TabPanel>
      </TabView>
    </div>
  );
};