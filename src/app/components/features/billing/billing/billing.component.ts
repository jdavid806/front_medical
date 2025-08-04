import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollPanel } from 'primeng/scrollpanel';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { PanelSubmenuComponent } from 'src/app/components/shared/panel-submenu/panel-submenu.component';

@Component({
  selector: 'app-billing',
  imports: [RouterOutlet, PanelSubmenuComponent, ScrollPanel],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.sass',
})
export class BillingComponent implements OnInit {
  menuItems: MenuItem[] | undefined;

  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.menuItems = [
      {
        title: this.translate.instant('SALES_INVOICE'),
        value: 0,
        icon: 'pi pi-file-plus',
        link: 'sales',
      },
      {
        title: this.translate.instant('ENTITIES_INVOICE'),
        value: 1,
        icon: 'pi pi-file-check',
        link: 'entities',
      },
      {
        title: this.translate.instant('RECURRING_INVOICE'),
        value: 2,
        icon: 'pi pi-file-import',
        link: 'recurring',
      },
      {
        title: 'Notas débit/crédito',
        value: 2,
        icon: 'pi pi-credit-card',
        link: 'debit-credit',
      },
      {
        title: 'Facturación compras',
        value: 4,
        icon: 'pi pi-cart-arrow-down',
        link: 'purchase',
      },
      {
        title: 'Documento soporte',
        value: 5,
        icon: 'pi pi-paperclip',
        link: 'support',
      },
      {
        title: 'Cotizaciones',
        value: 6,
        icon: 'pi pi-wallet',
        link: 'quotes',
      },
      {
        title: 'Remisiones',
        value: 7,
        icon: 'pi pi-bookmark',
        link: 'referrals',
      },

      {
        title: 'Orden de compra',
        value: 8,
        icon: 'pi pi-shopping-bag',
        link: 'purchase-orders',
      },
    ];
  }
}
