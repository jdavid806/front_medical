import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseInvoiceFormComponent } from './purchase-order-form.component';

describe('SalesInvoiceFormComponent', () => {
  let component: PurchaseInvoiceFormComponent;
  let fixture: ComponentFixture<PurchaseInvoiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseInvoiceFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PurchaseInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
