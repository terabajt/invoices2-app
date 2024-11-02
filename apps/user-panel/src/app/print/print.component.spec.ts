import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerService, Invoice, InvoicesService } from '@invoice2-team/invoices';
import { User, UsersService } from '@invoice2-team/users';
import { of } from 'rxjs';
import { PrintComponent } from './print.component';

describe('PrintComponent', () => {
    let component: PrintComponent;
    let fixture: ComponentFixture<PrintComponent>;
    let usersServiceSpy: jasmine.SpyObj<UsersService>;
    let invoicesServiceSpy: jasmine.SpyObj<InvoicesService>;
    let customerServiceSpy: jasmine.SpyObj<CustomerService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

    beforeEach(async () => {
        const user: User = {
            id: '1',
            name: 'John Doe',
            address1: 'Address 1',
            address2: 'Address 2',
            zip: '00000',
            city: 'City',
            country: 'Country',
            phone: '1234567890',
            taxNumber: '123456789',
            accountNumber: '123456789'
        };

        const invoice: Invoice = {
            invoiceNumber: 'FV/1/2024',
            invoiceDate: new Date(),
            dueDate: new Date(),
            customer: 'cust1',
            entryItem: [],
            netAmountSum: 100,
            grossSum: 123
        };

        const customer: Customer = {
            _id: 'cust1',
            name: 'Customer Name',
            address1: 'Address 1',
            address2: 'Address 2',
            zip: '00000',
            city: 'City',
            phone: '0987654321',
            taxNumber: '987654321'
        };

        usersServiceSpy = jasmine.createSpyObj('UsersService', ['observeCurrentUser']);
        usersServiceSpy.observeCurrentUser.and.returnValue(of(user));

        invoicesServiceSpy = jasmine.createSpyObj('InvoicesService', ['getInvoice']);
        invoicesServiceSpy.getInvoice.and.returnValue(of(invoice));

        customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomer']);
        customerServiceSpy.getCustomer.and.returnValue(of(customer));

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
        activatedRouteSpy.params = of({ id: '1' });

        await TestBed.configureTestingModule({
            declarations: [PrintComponent],
            providers: [
                { provide: UsersService, useValue: usersServiceSpy },
                { provide: InvoicesService, useValue: invoicesServiceSpy },
                { provide: CustomerService, useValue: customerServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PrintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user and invoice on ngOnInit', () => {
        fixture.detectChanges();
        expect(component.user).toBeDefined();
        expect(component.invoice).toBeDefined();
        expect(component.customer).toBeDefined();
    });

    it('should navigate to /invoices on onCancel', () => {
        component.onCancel();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/invoices']);
    });

    it('should print the page on onPrint', () => {
        spyOn(window, 'print');
        component.onPrint();
        expect(window.print).toHaveBeenCalled();
    });
});
