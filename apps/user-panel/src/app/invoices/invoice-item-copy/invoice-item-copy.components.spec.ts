import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService, InvoicesService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { of } from 'rxjs';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { ButtonAddNewClientComponent } from '../invoice-item/button-add-new-client/button-add-new-client.component';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';

class MockInvoicesService {
    getInvoice = jasmine.createSpy('getInvoice').and.returnValue(
        of({
            invoiceNumber: 'FV/1/2024',
            invoiceDate: new Date(),
            dueDate: new Date(),
            customer: 'Customer1',
            entryItem: [],
            netAmountSum: 0,
            grossSum: 0
        })
    );
    updateInvoice = jasmine.createSpy('updateInvoice').and.returnValue(of({}));
    addInvoice = jasmine.createSpy('addInvoice').and.returnValue(of({}));
    deleteEntryItem = jasmine.createSpy('deleteEntryItem').and.returnValue(of({}));
    updateEntryItem = jasmine.createSpy('updateEntryItem').and.returnValue(of({}));
}

class MockCustomerService {
    getCustomers = jasmine.createSpy('getCustomers').and.returnValue(of([{ _id: 'cust1', name: 'Customer1' }]));
    getCustomer = jasmine.createSpy('getCustomer').and.returnValue(of({ _id: 'cust1', name: 'Customer1' }));
}
class MockActivatedRoute {
    params = of({ id: '1' });
}

class MockUsersService {
    observeCurrentUser = jasmine.createSpy('observeCurrentUser').and.returnValue(of({ id: 'user123', lastNumberOfInvoice: 1 }));
}
class MockRouter {
    navigate = jasmine.createSpy('navigate');
}

describe('InvoiceItemComponent', () => {
    let component: InvoiceItemComponent;
    let fixture: ComponentFixture<InvoiceItemComponent>;
    let invoiceServiceMock: MockInvoicesService;
    let customerServiceMock: MockCustomerService;
    let usersServiceMock: MockUsersService;
    let snackBar: MatSnackBar;
    let dialog: MatDialog;
    let router: MockRouter;

    beforeEach(async () => {
        invoiceServiceMock = new MockInvoicesService();
        customerServiceMock = new MockCustomerService();
        usersServiceMock = new MockUsersService();
        router = new MockRouter();

        await TestBed.configureTestingModule({
            declarations: [InvoiceItemComponent, DialogComponent, ButtonAddNewClientComponent],
            imports: [
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatDatepickerModule,
                MatInputModule,
                MatNativeDateModule,
                MatIconModule,
                MatSelectModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: InvoicesService, useValue: invoiceServiceMock },
                { provide: CustomerService, useValue: customerServiceMock },
                { provide: UsersService, useValue: usersServiceMock },
                { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
                { provide: MatDialog, useValue: { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }) } },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                FormBuilder
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InvoiceItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user and set currentUserId', () => {
        component.ngOnInit();
        expect(usersServiceMock.observeCurrentUser).toHaveBeenCalled();
        expect(component.currentUserId).toBe('user123');
    });

    it('should initialize invoice form in edit mode', () => {
        invoiceServiceMock.getInvoice.and.returnValue(
            of({
                invoiceNumber: 'FV/1/2024',
                invoiceDate: new Date(),
                dueDate: new Date(),
                customer: 'Customer1',
                entryItem: [],
                netAmountSum: 0,
                grossSum: 0
            })
        );
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.form.get('invoiceNumber')?.value).toBe('FV/1/2024');
    });

    it('should initialize invoice form in add mode', () => {
        invoiceServiceMock.getInvoice.and.returnValue(of(null));
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.form.get('invoiceNumber')?.value).toMatch(/^FV\/\d+\/\d{4}$/);
    });

    it('should add entry item to the form', () => {
        component.addEntryItem();
        fixture.detectChanges();

        const entryItemsArray = component.entryItemsArray;
        expect(entryItemsArray.length).toBe(1);
        expect(entryItemsArray.at(0).get('nameEntry')?.value).toBe('Nazwa');
    });

    it('should remove entry item from the form', () => {
        component.addEntryItem();
        component.removeEntryItem(0);
        fixture.detectChanges();

        const entryItemsArray = component.entryItemsArray;
        expect(entryItemsArray.length).toBe(0);
    });

    it('should update gross entry on value change', () => {
        component.addEntryItem();
        const entryItemsArray = component.entryItemsArray;
        const formGroup = entryItemsArray.at(0) as FormGroup;

        formGroup.get('quantityEntry')?.setValue(2);
        fixture.detectChanges();

        expect(formGroup.get('grossEntry')?.value).toBe(2.46);
    });

    it('should calculate and display sums correctly', () => {
        component.addEntryItem();
        const entryItemsArray = component.entryItemsArray;
        const formGroup = entryItemsArray.at(0) as FormGroup;
        formGroup.get('quantityEntry')?.setValue(2);
        formGroup.get('netAmountEntry')?.setValue(10);
        fixture.detectChanges();

        expect(component.displayNetSum).toBe(20);
        expect(component.displayGrossSum).toBe(24.6);
    });

    it('should save invoice successfully in edit mode', () => {
        component.editMode = true;
        component.form.setValue({
            invoiceNumber: 'FV/1/2024',
            invoiceDate: new Date(),
            dueDate: new Date(),
            customer: 'Customer1',
            entryItems: [],
            netAmountSum: 0,
            grossSum: 0
        });
        component.onSaveForm();
        fixture.detectChanges();

        expect(invoiceServiceMock.updateInvoice).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/invoices/']);
    });

    it('should save invoice successfully in add mode', () => {
        component.editMode = false;
        component.form.setValue({
            invoiceNumber: 'FV/1/2024',
            invoiceDate: new Date(),
            dueDate: new Date(),
            customer: 'Customer1',
            entryItems: [],
            netAmountSum: 0,
            grossSum: 0
        });
        component.onSaveForm();
        fixture.detectChanges();

        expect(invoiceServiceMock.addInvoice).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/invoices/']);
    });
});
