import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { of } from 'rxjs';
import { CustomerItemComponent } from './customer-item.component';

const activatedRouteMock = {
    params: of({ id: '123' })
};

const routes: Routes = [{ path: 'customers', component: CustomerItemComponent }];

describe('CustomerItemComponent', () => {
    let component: CustomerItemComponent;
    let fixture: ComponentFixture<CustomerItemComponent>;
    let customerServiceMock: any;
    let usersServiceMock: any;

    beforeEach(async () => {
        customerServiceMock = {
            getCustomer: jasmine.createSpy('getCustomer').and.returnValue(of({ _id: '123', name: 'Test Customer' })),
            updateCustomer: jasmine.createSpy('updateCustomer').and.returnValue(of({})),
            addCustomer: jasmine.createSpy('addCustomer').and.returnValue(of({}))
        };

        usersServiceMock = {
            observeCurrentUser: jasmine.createSpy('observeCurrentUser').and.returnValue(of({ id: 'user123' }))
        };

        await TestBed.configureTestingModule({
            declarations: [CustomerItemComponent],
            imports: [ReactiveFormsModule, MatSnackBarModule, MatDialogModule, RouterTestingModule.withRoutes(routes), BrowserAnimationsModule],
            providers: [
                { provide: CustomerService, useValue: customerServiceMock },
                { provide: UsersService, useValue: usersServiceMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user and set currentUserId', () => {
        component['_initUser']();
        expect(usersServiceMock.observeCurrentUser).toHaveBeenCalled();
        expect(component.currentUserId).toBe('user123');
    });

    it('should initialize customer form in edit mode', async () => {
        component.editMode = true;
        component.ngOnInit();
        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();
        const nameControl = component.form.get('name');
        expect(nameControl?.value).toBe('Test Customer');
    });

    it('should validate NIP correctly', () => {
        const control = { value: '1234563218' } as AbstractControl;
        const result = component.validateNIP(control);
        expect(result).toBeNull();
    });

    it('should invalidate incorrect NIP', () => {
        const control = { value: '1234567890' } as AbstractControl;
        const result = component.validateNIP(control);
        expect(result).toEqual({ invalidNIP: true, message: 'Nieprawidłowa suma kontrolna.' });
    });

    it('should call updateCustomer on save in edit mode', () => {
        component.editMode = true;
        component.form = component['formBuilder'].group({
            name: ['Test Customer'],
            taxNumber: ['1234563218'],
            address1: ['Test Address'],
            address2: [''],
            zip: ['12-345'],
            email: ['test@example.com'],
            phone: ['123456789'],
            city: ['Test City']
        });
        component.onSaveForm();
        expect(customerServiceMock.updateCustomer).toHaveBeenCalled();
    });

    it('should call addCustomer on save in add mode', () => {
        component.editMode = false;
        component.form = component['formBuilder'].group({
            name: ['Test Customer'],
            taxNumber: ['1234563218'],
            address1: ['Test Address'],
            address2: [''],
            zip: ['12-345'],
            email: ['test@example.com'],
            phone: ['123456789'],
            city: ['Test City']
        });
        component.onSaveForm();
        expect(customerServiceMock.addCustomer).toHaveBeenCalled();
    });

    it('should disable save button if form is invalid', () => {
        component.form = component['formBuilder'].group({
            name: ['', [Validators.required]],
            taxNumber: ['', [Validators.required]],
            address1: ['', [Validators.required]],
            address2: [''],
            zip: ['', [Validators.required]],
            email: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            city: ['', [Validators.required]]
        });
        fixture.detectChanges();
        const saveButton = fixture.nativeElement.querySelector('button[color="primary"]');
        expect(saveButton.disabled).toBeTruthy();
    });

    it('should enable save button if form is valid', () => {
        component.form = component['formBuilder'].group({
            name: ['Test Customer', [Validators.required]],
            taxNumber: ['1234563218', [Validators.required]],
            address1: ['Test Address', [Validators.required]],
            address2: [''],
            zip: ['12-345', [Validators.required]],
            email: ['test@example.com', [Validators.required]],
            phone: ['123456789', [Validators.required]],
            city: ['Test City', [Validators.required]]
        });
        fixture.detectChanges();
        const saveButton = fixture.nativeElement.querySelector('button[color="primary"]');
        expect(saveButton.disabled).toBeFalsy();
    });
});
