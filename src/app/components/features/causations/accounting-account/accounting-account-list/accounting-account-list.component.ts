import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { AccountingAccount, IAccountingAccount } from 'src/app/models/accountingAccount';
import { SelectItem } from 'primeng/api';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-accounting-account-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TreeModule,
    CheckboxModule,
    DropdownModule,
    TableModule,
    TagModule,
    InputTextModule
  ],
  templateUrl: './accounting-account-list.component.html',
  styleUrls: ['./accounting-account-list.component.scss']
})
export class AccountinAccountListComponent {
  @Input() isModalProductsClose = false;
  @ViewChild('dt') dt: Table | undefined;

  data: TreeNode[] = [];
  flattenedData: any[] = [];
  causationsData: AccountingAccount[] = [];
  selectedNode: any = null;
  expandedNodes: Set<string> = new Set();

  // Dropdown options
  levelOptions: SelectItem[] = [
    { label: 'Todos', value: null },
    { label: 'Clase', value: 'class' },
    { label: 'Grupo', value: 'group' },
    { label: 'Cuenta', value: 'account' },
    { label: 'Subcuenta', value: 'subaccount' },
    { label: 'Auxiliar', value: 'assistant' }
  ];

  relatedOptions: SelectItem[] = [
    { label: 'Activos', value: 'assets' },
    { label: 'Pasivos', value: 'liabilities' },
    { label: 'Patrimonio', value: 'equity' },
    { label: 'Ingresos', value: 'income' },
    { label: 'Gastos', value: 'expenses' }
  ];

  categoryOptions: SelectItem[] = [
    { label: 'Corriente', value: 'current' },
    { label: 'No corriente', value: 'non_current' },
    { label: 'Diferido', value: 'deferred' }
  ];

  detailOptions: SelectItem[] = [
    { label: 'Sí', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Automático', value: 'auto' }
  ];

  currentFormData: any = {
    classCode: '',
    className: '',
    groupCode: '',
    groupName: '',
    accountCode: '',
    accountName: '',
    subAccountCode: '',
    subAccountName: '',
    assistantCode: '',
    assistantName: '',
    active: true
  };

  codes: { [key: string]: string } = {
    '2': 'Pasivo',
    '21': 'Pasivo financiero',
    '05': 'Bancos nacionales',
    '10': 'Pagares',
    '01': 'Colpatria costo amortizado',
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    let fakeData: IAccountingAccount[] = [
      {
        id: '2',
        accountingccount: 'Pasivo',
        children: [{
          id: '21',
          accountingccount: 'Pasivos financieros',
          children: [{
            id: '2105',
            accountingccount: 'Bancos nacionales',
            children: [{
              id: '210510',
              accountingccount: 'Pagares',
              children: [{
                id: '21051001',
                accountingccount: 'Colpatria costo amortizado',
                otherData: {
                  classCode: '2',
                  groupCode: '21',
                  accountCode: '05',
                  subAccountCode: '10',
                  assistantCode: '01',
                  category: '',
                  detail: '',
                  niif: false,
                  status: false,
                }
              }]
            }]
          }]
        }]
      },
    ];

    this.causationsData = fakeData.map(element => new AccountingAccount(element));
    this.data = this.parseDataToTreeNode(this.causationsData);
    this.flattenedData = this.flattenTreeData(this.data);
    this.resetFormData();

    // Initialize with root node selected and expanded
    this.expandedNodes.add('2');
    this.currentFormData.classCode = '2';
    this.currentFormData.className = 'Pasivo';
    this.data = this.parseDataToTreeNode(this.causationsData);
    this.flattenedData = this.flattenTreeData(this.data);
  }

  parseDataToTreeNode(data: AccountingAccount[]): TreeNode[] {
    return data.map(element => {
      const nodeId = element.id;
      const isExpanded = this.expandedNodes.has(nodeId);
      const hasChildren = !!element.children && element.children.length > 0;

      const node: TreeNode = {
        data: {
          code: nodeId,
          name: element.accountingccount,
          hasChildren: hasChildren,
          level: this.determineNodeLevel(nodeId)
        },
        label: element.accountingccount,
        selectable: true,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        icon: hasChildren ? undefined : 'pi pi-file',
        expanded: isExpanded,
        children: element.children ? this.parseDataToTreeNode(element.children) : undefined
      };
      return node;
    });
  }

  toggleNodeExpansion(node: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const nodeId = node.code;
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }

    // Rebuild data to reflect changes
    this.data = this.parseDataToTreeNode(this.causationsData);
    this.flattenedData = this.flattenTreeData(this.data);

    // Force table update
    if (this.dt) {
      this.dt.reset();
    }
  }

  onNodeSelect(event: any) {
    const nodeData = event.data;
    if (nodeData.hasChildren) {
      this.toggleNodeExpansion(nodeData);
    }
    this.updateFormData(nodeData.code);
  }

  flattenTreeData(nodes: TreeNode[], level: number = 0, parentCode: string = ''): any[] {
    let result: any[] = [];

    nodes.forEach(node => {
      const nodeData = node.data;
      const nodeLevel = this.determineNodeLevel(nodeData.code);
      const indent = this.getIndentForLevel(nodeLevel);
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = this.expandedNodes.has(nodeData.code);

      result.push({
        code: nodeData.code,
        name: nodeData.name,
        level: nodeLevel,
        indent: indent,
        node: node,
        hasChildren: hasChildren,
        isExpanded: isExpanded
      });

      // Only add children if node is expanded
      if (isExpanded && node.children) {
        result = result.concat(this.flattenTreeData(node.children, level + 1, nodeData.code));
      }
    });

    return result;
  }

  getIndentForLevel(level: string): string {
    switch(level) {
      case 'class': return '';
      case 'group': return 'pl-2';
      case 'account': return 'pl-4';
      case 'subaccount': return 'pl-6';
      case 'assistant': return 'pl-8';
      default: return '';
    }
  }

  onNewSelected() {
    this.router.navigate(['causations/movements/new']);
  }

  resetFormData() {
    this.currentFormData = {
      classCode: '',
      className: '',
      groupCode: '',
      groupName: '',
      accountCode: '',
      accountName: '',
      subAccountCode: '',
      subAccountName: '',
      assistantCode: '',
      assistantName: '',
      active: true
    };
  }

  updateFormData(nodeId: string) {
    this.resetFormData();

    if (!nodeId) return;

    for (const account of this.causationsData) {
      const foundAccount = account.findById(nodeId);
      if (foundAccount) {
        this.updateFormWithAccount(foundAccount);
        break;
      }
    }
  }

  updateFormWithAccount(account: AccountingAccount) {
    const id = account.id;
    const level = this.determineNodeLevel(id);

    switch(level) {
      case 'class':
        this.currentFormData.classCode = id;
        this.currentFormData.className = account.accountingccount;
        break;

      case 'group':
        this.currentFormData.classCode = id.charAt(0);
        this.currentFormData.className = this.getCodeString(id.charAt(0));
        this.currentFormData.groupCode = id;
        this.currentFormData.groupName = account.accountingccount;
        break;

      case 'account':
        this.currentFormData.classCode = id.charAt(0);
        this.currentFormData.className = this.getCodeString(id.charAt(0));
        this.currentFormData.groupCode = id.substring(0, 2);
        this.currentFormData.groupName = this.getCodeString(id.substring(0, 2));
        this.currentFormData.accountCode = id.substring(2);
        this.currentFormData.accountName = account.accountingccount;
        break;

      case 'subaccount':
        this.currentFormData.classCode = id.charAt(0);
        this.currentFormData.className = this.getCodeString(id.charAt(0));
        this.currentFormData.groupCode = id.substring(0, 2);
        this.currentFormData.groupName = this.getCodeString(id.substring(0, 2));
        this.currentFormData.accountCode = id.substring(2, 4);
        this.currentFormData.accountName = this.getCodeString(id.substring(2, 4));
        this.currentFormData.subAccountCode = id.substring(4);
        this.currentFormData.subAccountName = account.accountingccount;
        break;

      case 'assistant':
        if (account.otherData) {
          this.currentFormData.classCode = account.otherData.classCode;
          this.currentFormData.className = this.getCodeString(account.otherData.classCode);
          this.currentFormData.groupCode = account.otherData.groupCode;
          this.currentFormData.groupName = this.getCodeString(account.otherData.groupCode);
          this.currentFormData.accountCode = account.otherData.accountCode;
          this.currentFormData.accountName = this.getCodeString(account.otherData.accountCode);
          this.currentFormData.subAccountCode = account.otherData.subAccountCode;
          this.currentFormData.subAccountName = this.getCodeString(account.otherData.subAccountCode);
          this.currentFormData.assistantCode = account.otherData.assistantCode;
          this.currentFormData.assistantName = account.accountingccount;
        }
        break;
    }
  }

  determineNodeLevel(id: string): string {
    if (id.length === 1) return 'class';
    if (id.length === 2) return 'group';
    if (id.length === 4) return 'account';
    if (id.length === 6) return 'subaccount';
    return 'assistant';
  }

  getCodeString(value: string | undefined): string {
    if (value) {
      return this.codes[value] || value;
    }
    return '';
  }

  getSeverity(level: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch(level) {
      case 'class': return 'contrast';
      case 'group': return 'success';
      case 'account': return 'info';
      case 'subaccount': return 'warn';
      case 'assistant': return 'danger';
      default: return undefined;
    }
  }

  filterByLevel(level: string | null) {
    if (!level) {
      this.dt?.filter(null, 'level', 'equals');
    } else {
      this.dt?.filter(level, 'level', 'equals');
    }
  }

  onGlobalFilter(event: Event): void {
    if (this.dt) {
      const input = event.target as HTMLInputElement;
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  onCodeFilter(event: Event): void {
    if (this.dt) {
      const input = event.target as HTMLInputElement;
      this.dt.filter(input.value, 'code', 'contains');
    }
  }

  onNameFilter(event: Event): void {
    if (this.dt) {
      const input = event.target as HTMLInputElement;
      this.dt.filter(input.value, 'name', 'contains');
    }
  }

  customSort(event: SortEvent) {
    event.data?.sort((data1, data2) => {
      const value1 = data1[event.field as keyof typeof data1];
      const value2 = data2[event.field as keyof typeof data2];

      if (event.field === 'code') {
        return event.order! * value1.localeCompare(value2);
      } else {
        return event.order! * (value1 < value2 ? -1 : value1 > value2 ? 1 : 0);
      }
    });
  }
}
