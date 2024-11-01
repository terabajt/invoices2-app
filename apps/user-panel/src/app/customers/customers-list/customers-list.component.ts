import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer, CustomerService } from '@invoice2-team/invoices';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '@invoice2-team/users';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-customers-list',
    templateUrl: './customers-list.component.html',
    styles: ``
})
export class CustomersListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true })
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort!: MatSort;
    currentUserId = '';
    dataSource: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);

    constructor(
        private customerService: CustomerService,
        private _dialog: MatDialog,
        private _toast: MatSnackBar,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.paginator._intl.itemsPerPageLabel = 'Ilość klientów na stronie';
        this._initUser();
        this._initCustomers();
    }

    private _initUser() {
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) {
                this.currentUserId = user.id;
            }
        });
    }

    ngAfterViewInit() {
        merge(this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    return this._initCustomers();
                })
            )
            .subscribe();
    }

    displayedColumns: string[] = ['name', 'taxNumber', 'email', 'phone', 'options'];

    private _initCustomers(): Observable<any> {
        return this.customerService.getCustomers(this.currentUserId).pipe(
            map((data) => {
                this.dataSource = new MatTableDataSource<Customer>(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }),
            catchError(() => {
                return observableOf([]);
            })
        );
    }

    onDeleteCustomer(customerId: string) {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Czy na pewno chcesz usunąć kontrahenta?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.customerService.deleteCustomer(customerId).subscribe(
                    () => {
                        this._toast.open(`Klient został usunięty.`);
                        this._initCustomers();
                    },
                    (err) => {
                        this._toast.open('Błąd podczas usuwania klienta: ', err);
                    }
                );
            }
        });
    }
}
