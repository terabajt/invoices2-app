import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { of, throwError } from 'rxjs';
import { CustomersListComponent } from './customers-list.component';

describe('CustomersListComponent', () => {
    let component: CustomersListComponent;
    let fixture: ComponentFixture<CustomersListComponent>;
    let customerServiceMock: any;
    let usersServiceMock: any;
    let dialogMock: any;
    let snackBarMock: any;
    let paginator: MatPaginator;
    let sort: MatSort;

    beforeEach(async () => {
        customerServiceMock = {
            getCustomers: jasmine
                .createSpy('getCustomers')
                .and.returnValue(of([{ _id: '1', name: 'Customer 1', taxNumber: '1234567890', email: 'customer1@example.com', phone: '123456789' }])),
            deleteCustomer: jasmine.createSpy('deleteCustomer').and.returnValue(of({}))
        };

        usersServiceMock = {
            observeCurrentUser: jasmine.createSpy('observeCurrentUser').and.returnValue(of({ id: 'user123' }))
        };

        dialogMock = {
            open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) })
        };

        snackBarMock = {
            open: jasmine.createSpy('open')
        };

        await TestBed.configureTestingModule({
            declarations: [CustomersListComponent],
            imports: [MatTableModule, MatPaginatorModule, MatSortModule, BrowserAnimationsModule],
            providers: [
                { provide: CustomerService, useValue: customerServiceMock },
                { provide: UsersService, useValue: usersServiceMock },
                { provide: MatDialog, useValue: dialogMock },
                { provide: MatSnackBar, useValue: snackBarMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        paginator = fixture.debugElement.query(By.directive(MatPaginator))?.componentInstance;
        sort = fixture.debugElement.query(By.directive(MatSort))?.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user and fetch customers on ngOnInit', () => {
        expect(usersServiceMock.observeCurrentUser).toHaveBeenCalled();
        expect(customerServiceMock.getCustomers).toHaveBeenCalledWith('user123');
    });

    it('should initialize dataSource with customer data', () => {
        const dataSource = component.dataSource;
        expect(dataSource.data.length).toBe(1);
        expect(dataSource.data[0].name).toBe('Customer 1');
    });

    it('should handle paginator and sort after view init', () => {
        spyOn(component['paginator'].page, 'emit');
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component['paginator']).toBeTruthy();
        expect(component['sort']).toBeTruthy();
        expect(component.dataSource.paginator).toBe(component['paginator']);
        expect(component.dataSource.sort).toBe(component['sort']);
    });

    it('should call deleteCustomer and refresh customer list on successful delete', () => {
        component.onDeleteCustomer('1');
        fixture.detectChanges();

        expect(dialogMock.open).toHaveBeenCalled();
        expect(customerServiceMock.deleteCustomer).toHaveBeenCalledWith('1');
        expect(snackBarMock.open).toHaveBeenCalledWith('Klient został usunięty.');
        expect(customerServiceMock.getCustomers).toHaveBeenCalledWith('user123');
    });

    it('should handle deleteCustomer error', () => {
        customerServiceMock.deleteCustomer.and.returnValue(throwError('Error'));
        component.onDeleteCustomer('1');
        fixture.detectChanges();

        expect(dialogMock.open).toHaveBeenCalled();
        expect(customerServiceMock.deleteCustomer).toHaveBeenCalledWith('1');
        expect(snackBarMock.open).toHaveBeenCalledWith('Błąd podczas usuwania klienta: ', 'Error');
    });
});
