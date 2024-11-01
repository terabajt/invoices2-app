import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice, InvoicesService, MonthToSorted } from '@invoice2-team/invoices';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '@invoice2-team/users';

@Component({
    selector: 'app-invoices-list',
    templateUrl: './invoices-list.component.html',
    styles: ``
})
export class InvoicesListComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true })
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort!: MatSort;
    isLoadingResults = false;
    invoices: Invoice[] = [];
    currentUserId = '';
    months: MonthToSorted[] = [
        { month: 'brak', monthNumber: 'empty' },
        { month: 'styczeń', monthNumber: '-01-' },
        { month: 'luty', monthNumber: '-02-' },
        { month: 'marzec', monthNumber: '-03-' },
        { month: 'kwiecień', monthNumber: '-04-' },
        { month: 'maj', monthNumber: '-05-' },
        { month: 'czerwiec', monthNumber: '-06-' },
        { month: 'lipiec', monthNumber: '-07-' },
        { month: 'sierpień', monthNumber: '-08-' },
        { month: 'wrzesień', monthNumber: '-09-' },
        { month: 'październik', monthNumber: '-10-' },
        { month: 'listopad', monthNumber: '-11-' },
        { month: 'grudzień', monthNumber: '-12-' }
    ];

    constructor(
        private invoiceService: InvoicesService,
        private usersService: UsersService,
        private _dialog: MatDialog,
        private _toast: MatSnackBar
    ) {}

    ngOnInit() {
        this.usersService.initAppSession();
        this.paginator._intl.itemsPerPageLabel = 'Ilość faktur na stronie';
        this._initUser();
    }
    private _initUser() {
        this.isLoadingResults = true;
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) this.currentUserId = user.id;
            this._initInvoices();
            this.isLoadingResults = false;
        });
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    private _initInvoices() {
        this.invoiceService.getInvoices(this.currentUserId).subscribe((invoices) => {
            this.dataSource.data = invoices;
        });
    }

    displayedColumns: string[] = ['invoiceNumber', 'invoiceDate', 'customer', 'grossSum', 'options'];
    dataSource = new MatTableDataSource(this.invoices);

    onDeleteInvoice(invoiceID: string) {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Czy na pewno chcesz usunąć fakturę?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.invoiceService.deleteInvoice(invoiceID).subscribe(
                    () => {
                        this._toast.open(`Pomyślnie usunięto fakturę.`);
                        this._initInvoices();
                    },
                    (err) => {
                        this._toast.open(`Wystąpił błąd podczas usuwania faktury: ${err}`);
                    }
                );
            }
        });
    }

    applyFilterNumberOfInvoice(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterDate(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
        if (!filterValue) {
            this.dataSource.filter = '';
            return;
        }
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const formattedDate = (data.invoiceDate || '').toLowerCase();
            return formattedDate.includes(filter);
        };
        this.dataSource.filter = filterValue;
    }
    onMonthSelectedFilter(event: any): void {
        if (event && event.value) {
            const filterValue = event.value;

            if (!filterValue) {
                this.dataSource.filter = '';
                return;
            }
            if (filterValue === 'empty') {
                this.dataSource.filter = '';
                return;
            }
            this.dataSource.filterPredicate = (data: any, filter: string) => {
                const formattedDate = (data.invoiceDate || '').toLowerCase();
                return formattedDate.includes(filter);
            };
            this.dataSource.filter = filterValue;
        }
    }
}
