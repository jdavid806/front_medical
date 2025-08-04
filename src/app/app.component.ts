import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '@services';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeNode } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    TranslateModule,
    HeaderComponent,
    DrawerModule,
    ButtonModule,
    RippleModule,
    AvatarModule,
    StyleClassModule,
    ScrollPanelModule,
    ToastModule,
    TreeSelectModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  @ViewChild('sidebarRef') drawerRef!: Drawer;
  title = 'medical-front';
  sidebarVisible: boolean = false;
  isReportsExpanded: boolean = false;

  selectedRoute: TreeNode | null = null;
  routeOptions: TreeNode[] = [
    {
      key: '/billing',
      label: 'Facturación',
      icon: 'pi pi-dollar',
      data: { route: '/billing' }
    },
    {
      key: '/causations',
      label: 'Causaciones',
      icon: 'pi pi-calculator',
      data: { route: '/causations' }
    },
    {
      key: '/reports',
      label: 'Reportes',
      icon: 'pi pi-briefcase',
      children: [
        {
          key: '/reports/sales',
          label: 'Reportes en Ventas',
          icon: 'pi pi-chart-bar',
          data: { route: '/reports/sales' }
        }
      ]
    },
    {
      key: '/suppliers',
      label: 'Proveedores',
      icon: 'pi pi-users',
      data: { route: '/suppliers' }
    },
    {
      key: '/config',
      label: 'Configuración',
      icon: 'pi pi-cog',
      data: { route: '/config' }
    }
  ];

  constructor(
    public router: Router,
    private translate: TranslateService,
    private sidebarService: SidebarService
  ) {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit(): void {
    this.sidebarService.sidebarVisible$.subscribe((visible: boolean) => {
      this.sidebarVisible = visible;
    });

    this.router.events.subscribe(() => {
      this.checkActiveRoutes();
      this.setSelectedRouteFromUrl();
    });
  }

  isReportsActive(): boolean {
    return this.router.isActive('/reports', false) ||
           this.router.isActive('/reports/sales', true);
  }

  private checkActiveRoutes(): void {
    this.isReportsExpanded = this.isReportsActive();
  }

  private setSelectedRouteFromUrl(): void {
    const currentUrl = this.router.url;
    this.selectedRoute = this.findNodeByRoute(currentUrl, this.routeOptions);
  }

  private findNodeByRoute(route: string, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.data?.route === route) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeByRoute(route, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  closeSidebar(): void {
    this.sidebarService.hideSidebar();
  }

  onSidebarHide(): void {
    this.closeSidebar();
  }

  toggleReports(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isReportsExpanded = !this.isReportsExpanded;
    if (!this.isReportsActive()) {
      this.router.navigate(['/reports']);
    }
  }

  onRouteSelect(event: { node: TreeNode }): void {
    if (event.node?.data?.route) {
      this.router.navigate([event.node.data.route]);
      this.closeSidebar();
    }
  }
}
