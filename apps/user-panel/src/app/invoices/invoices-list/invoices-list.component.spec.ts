import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InvoicesService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { of } from 'rxjs';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { InvoicesListComponent } from './invoices-list.component';

class MockInvoicesService {
    getInvoices = jasmine.createSpy('getInvoices').and.returnValue(of([]));
    deleteInvoice = jasmine.createSpy('deleteInvoice').and.returnValue(of({}));
}

class MockUsersService {
    observeCurrentUser = jasmine.createSpy('observeCurrentUser').and.returnValue(of({ id: 'user123' }));
    initAppSession = jasmine.createSpy('initAppSession');
}
class MockMatSnackBarRef {
    afterClosed = jasmine.createSpy('afterClosed').and.returnValue(of(true));
}

class MockMatSnackBar {
    open = jasmine.createSpy('open').and.returnValue(new MockMatSnackBarRef() as any);
}

describe('InvoicesListComponent', () => {
    let component: InvoicesListComponent;
    let fixture: ComponentFixture<InvoicesListComponent>;
    let invoiceServiceMock: MockInvoicesService;
    let usersServiceMock: MockUsersService;
    let snackBar: MatSnackBar;
    let dialog: MatDialog;

    beforeEach(async () => {
        invoiceServiceMock = new MockInvoicesService();
        usersServiceMock = new MockUsersService();

        await TestBed.configureTestingModule({
            declarations: [InvoicesListComponent, DialogComponent],
            imports: [
                MatPaginatorModule,
                MatSortModule,
                MatTableModule,
                BrowserAnimationsModule,
                MatCardModule,
                MatFormFieldModule,
                MatSelectModule,
                MatOptionModule,
                MatInputModule
            ],
            providers: [
                { provide: InvoicesService, useValue: invoiceServiceMock },
                { provide: UsersService, useValue: usersServiceMock },
                { provide: MatDialog, useValue: { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }) } },
                { provide: MatSnackBar, useClass: MockMatSnackBar }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InvoicesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize user and set currentUserId', () => {
        component.ngOnInit();
        expect(usersServiceMock.initAppSession).toHaveBeenCalled();
        expect(usersServiceMock.observeCurrentUser).toHaveBeenCalled();
        expect(component.currentUserId).toBe('user123');
    });

    it('should initialize invoices on ngOnInit', () => {
        spyOn<any>(component, '_initInvoices');
        component.ngOnInit();
        fixture.detectChanges();
        expect((component as any)._initInvoices).toHaveBeenCalled();
    });

    it('should set dataSource paginator and sort after view init', () => {
        component.ngAfterViewInit();
        fixture.detectChanges();

        expect(component.dataSource.paginator).toBe(component.paginator);
        expect(component.dataSource.sort).toBe(component.sort);
    });
    it('should call deleteInvoice and show toast on successful delete', () => {
        spyOn(component, 'onDeleteInvoice').and.callThrough();
        const snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
        const snackBarRef = { afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true)) } as any;
        snackBar.open.and.returnValue(snackBarRef);
        component.onDeleteInvoice('invoice-id');
        fixture.detectChanges();
        expect(snackBar.open).toHaveBeenCalledWith('Pomyślnie usunięto fakturę.');
    });

    it('should apply invoice number filter', () => {
        const event = { target: { value: 'FV/1/2024' } } as unknown as Event;
        component.applyFilterNumberOfInvoice(event);
        fixture.detectChanges();

        expect(component.dataSource.filter).toBe('fv/1/2024');
    });

    it('should apply date filter', () => {
        const event = { target: { value: '2024-01-01' } } as unknown as Event;
        component.applyFilterDate(event);
        fixture.detectChanges();

        expect(component.dataSource.filter).toBe('2024-01-01');
    });

    it('should apply month filter', () => {
        const event = { value: '-01-' };
        component.onMonthSelectedFilter(event);
        fixture.detectChanges();

        expect(component.dataSource.filter).toBe('-01-');
    });

    it('should reset month filter if empty', () => {
        const event = { value: 'empty' };
        component.onMonthSelectedFilter(event);
        fixture.detectChanges();

        expect(component.dataSource.filter).toBe('');
    });
});
