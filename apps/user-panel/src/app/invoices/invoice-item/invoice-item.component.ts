import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerName, CustomerService, EntryItem, Invoice, InvoicesService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
    selector: 'app-invoice-item',
    templateUrl: './invoice-item.component.html',
    styles: ``
})
export class InvoiceItemComponent implements OnInit {
    isLoadingResults = false;
    editMode = true;
    form!: FormGroup;
    dueDatePicker: Date | null = null;
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    hideRequiredControl = new FormControl(false);
    invoiceNumber!: string;
    invoiceId!: string;
    netAmountSum = 0;
    grossSum = 0;

    displayNetSum = 0;
    displayGrossSum = 0;

    currYear = new Date().getFullYear();
    currentUserId = '';
    customersName: CustomerName[] = [];
    lastNumberOfInvoice = 0;
    currentCustomer!: Customer;
    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: InvoicesService,
        private route: ActivatedRoute,
        private _toast: MatSnackBar,
        private _dialog: MatDialog,
        private router: Router,
        private customerService: CustomerService,
        private usersService: UsersService
    ) {}
    getFloatLabelValue(): FloatLabelType {
        return this.floatLabelControl.value || 'auto';
    }
    ngOnInit(): void {
        this.isLoadingResults = true;
        this._initUser();
    }
    onPrint() {
        this.router.navigate([`print/${this.invoiceId}`]);
    }

    private _initUser() {
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) this.currentUserId = user.id;
            this.lastNumberOfInvoice = user?.lastNumberOfInvoice || 0;
            this._initCustomersName();
            this._invoiceInit();
        });
    }
    private _invoiceInit() {
        this.route.params.pipe().subscribe((params) => {
            if (params['id']) {
                this.invoiceService.getInvoice(params['id']).subscribe((invoice) => {
                    if (invoice) {
                        this.invoiceNumber = invoice.invoiceNumber || '';
                        this.invoiceId = params['id'];

                        const entryItemsArray = this.formBuilder.array(
                            (invoice.entryItem || []).map((item: EntryItem) => {
                                const formItems = this.formBuilder.group({
                                    id_item: [item._id],
                                    nameEntry: [item.nameEntry || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                                    quantityEntry: [item.quantityEntry || 1, [Validators.required, Validators.maxLength(50), Validators.min(1)]],
                                    taxEntry: [item.taxEntry?.toString() || '0', Validators.required],
                                    netAmountEntry: [item.netAmountEntry || 1, [Validators.required, Validators.maxLength(50), Validators.min(1)]],
                                    grossEntry: [
                                        (item.quantityEntry || 0) * (item.taxEntry || 0) * (item.netAmountEntry || 0) || 1,
                                        [Validators.required, Validators.maxLength(100), Validators.min(1)]
                                    ]
                                });

                                formItems.get('quantityEntry')?.valueChanges.subscribe(() => {
                                    this.updateGrossEntry(formItems);
                                });

                                formItems.get('taxEntry')?.valueChanges.subscribe(() => {
                                    this.updateGrossEntry(formItems);
                                });

                                formItems.get('netAmountEntry')?.valueChanges.subscribe(() => {
                                    this.updateGrossEntry(formItems);
                                });

                                return formItems;
                            })
                        );

                        this.form = this.formBuilder.group({
                            invoiceNumber: [invoice.invoiceNumber || '', Validators.required],
                            invoiceDate: [invoice.invoiceDate ? new Date(invoice.invoiceDate) : new Date(), Validators.required],
                            dueDate: [invoice.dueDate ? new Date(invoice.dueDate) : new Date(), Validators.required],
                            customer: [invoice.customer || '', Validators.required],
                            entryItems: entryItemsArray,
                            netAmountSum: [this.netAmountSum, Validators.required],
                            grossSum: [this.grossSum, Validators.required]
                        });
                        this.isLoadingResults = false;

                        this.updateGrossEntry(this.form);
                    } else {
                        this.editMode = false;
                        this.isLoadingResults = false;
                    }
                });
            } else {
                this.editMode = false;
                const newNumberOfInvoice = this.lastNumberOfInvoice + 1 || 0;
                const invoiceNumber = `FV/${newNumberOfInvoice}/${this.currYear}`;
                this.form = this.formBuilder.group({
                    invoiceNumber: [invoiceNumber, [Validators.required, Validators.pattern(/^FV\/\d{1,3}\/\d{4}$/)]],
                    invoiceDate: [new Date(), Validators.required],
                    dueDate: [new Date(), Validators.required],
                    customer: [this.customersName, Validators.required],
                    entryItems: this.formBuilder.array([]),
                    netAmountSum: [0, Validators.required],
                    grossSum: [0, Validators.required]
                });
            }
            this.isLoadingResults = false;
        });
    }

    private _initCustomersName() {
        this.customerService.getCustomers(this.currentUserId).subscribe((customer) => {
            customer.map((item) => {
                this.customersName.push({ id: item._id, name: item.name });
            });
        });
    }
    isEntryItemsFormArrayNotEmpty(): boolean {
        const entryItems = this.form.get('entryItems') as FormArray;
        return entryItems && entryItems.length > 0;
    }
    getCurrentClient(id: string) {
        this.customerService.getCustomer(id).subscribe((customer) => (this.currentCustomer = customer));
    }

    get entryItemsArray() {
        return this.form.get('entryItems') as FormArray;
    }
    getControls() {
        return (this.form.get('entryItems') as FormArray).controls;
    }
    removeEntryItem(index: number) {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Czy na pewno chcesz usunąć pozycje?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                const entryItems = this.form.get('entryItems') as FormArray;
                const entryItemId = entryItems.controls[index].value.id_item;
                if (entryItemId) this.invoiceService.deleteEntryItem(entryItemId).subscribe();
                entryItems.removeAt(index);
                this.updateSums();
            }
        });
    }
    addEntryItem() {
        const entryItems = this.form.get('entryItems') as FormArray;
        const newEntryItem = this.formBuilder.group({
            nameEntry: ['Nazwa', Validators.required],
            quantityEntry: [1, Validators.required],
            taxEntry: ['23', Validators.required],
            netAmountEntry: [1, Validators.required],
            grossEntry: [1.23, Validators.required]
        });
        entryItems.push(newEntryItem);

        newEntryItem.get('quantityEntry')?.valueChanges.subscribe(() => {
            this.updateGrossEntry(newEntryItem);
        });

        newEntryItem.get('taxEntry')?.valueChanges.subscribe(() => {
            this.updateGrossEntry(newEntryItem);
        });

        newEntryItem.get('netAmountEntry')?.valueChanges.subscribe(() => {
            this.updateGrossEntry(newEntryItem);
        });
        this.updateGrossEntry(newEntryItem);
    }
    private updateGrossEntry(formItems: FormGroup) {
        const quantity = +formItems.get('quantityEntry')?.value || 0;
        const tax = +formItems.get('taxEntry')?.value || 0;
        const netAmount = +formItems.get('netAmountEntry')?.value || 0;

        // Changed for mat-option optimized
        const grossEntry = +(quantity * (1 + tax / 100) * netAmount).toFixed(2);
        formItems.patchValue({ grossEntry }, { emitEvent: false });
        this.updateSums();
    }

    private updateSums() {
        const entryItemsArray = this.form.get('entryItems') as FormArray;
        let netAmountSum = 0;
        let grossSum = 0;
        entryItemsArray.controls.forEach((control) => {
            const quantityEntry = +control.get('quantityEntry')?.value || 0;
            const netAmountEntry = +control.get('netAmountEntry')?.value || 0;
            netAmountSum += quantityEntry * netAmountEntry;
            grossSum += control.get('grossEntry')?.value || 0;
        });
        this.form.patchValue({ netAmountSum: netAmountSum.toFixed(2), grossSum }, { emitEvent: false });
        this.displayNetSum = netAmountSum;
        this.displayGrossSum = grossSum;
    }
    get invoiceForm() {
        return this.form.controls;
    }
    onSaveForm() {
        if (this.form.invalid) {
            return this._toast.open(`Faktura nie jest wypełniona prawidłowo`);
        }
        if (this.editMode) {
            const formData = this.form.value;
            const newInvoice: Invoice = {
                invoiceNumber: formData.invoiceNumber,
                invoiceDate: formData.invoiceDate,
                dueDate: formData.dueDate,
                customer: formData.customer,
                entryItem: formData.entryItem,
                user: this.currentUserId,
                netAmountSum: formData.netAmountSum,
                grossSum: formData.grossSum
            };
            const newEntryItems: EntryItem[] = [];
            this.entryItemsArray.controls.map((item) => {
                const entryItem = {
                    nameEntry: item.value.nameEntry,
                    quantityEntry: item.value.quantityEntry,
                    taxEntry: item.value.taxEntry,
                    netAmountEntry: item.value.netAmountEntry,
                    grossEntry: item.value.grossEntry,
                    _id: item.value.id_item,
                    invoiceId: this.invoiceId
                };
                newEntryItems.push(entryItem);
            });
            this._updateInvoice(newInvoice);
            this._updateItems(newEntryItems);
            return;
        } else {
            const formData = this.form.getRawValue();
            const newInvoice: Invoice = {
                invoiceNumber: formData.invoiceNumber,
                invoiceDate: formData.invoiceDate,
                dueDate: formData.dueDate,
                customer: formData.customer,
                entryItem: formData.entryItems.map((item: EntryItem) => {
                    return {
                        nameEntry: item.nameEntry,
                        quantityEntry: item.quantityEntry,
                        taxEntry: item.taxEntry,
                        netAmountEntry: item.netAmountEntry || 0,
                        grossEntry: item.grossEntry || 0
                    };
                }),
                user: this.currentUserId,
                netAmountSum: formData.netAmountSum,
                grossSum: formData.grossSum
            };
            return this._addInvoice(newInvoice);
        }
    }
    private _updateInvoice(invoice: Invoice) {
        this.invoiceService
            .updateInvoice(invoice, this.invoiceId)
            .pipe()
            .subscribe((invoice: Invoice) => {
                this._toast.open(`Pomyślnie zaktualizowano fakturę ${invoice.invoiceNumber}`);
                this.router.navigate(['/invoices/']);
            });
    }
    private _updateItems(newEntryItems: EntryItem[]) {
        this.invoiceService.updateEntryItem(newEntryItems);
    }
    private _addInvoice(invoice: Invoice) {
        this.invoiceService.addInvoice(invoice).subscribe(
            (invoice: Invoice) => {
                this._toast.open(`Pomyślnie zapisano fakturę ${invoice.invoiceNumber}`);
                this.router.navigate(['/invoices/']);
            },
            (error) => {
                this._toast.open(`Błąd wewnętrzny ${error}`);
            }
        );
    }
    private _addItems(newEntryItems: EntryItem[]) {
        this.invoiceService.updateEntryItem(newEntryItems);
    }
    showDialog(): void {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Wszystkie niezapisane zmiany zostaną utracone. Czy na pewno chcesz anulować?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.router.navigate(['/invoices']);
            }
        });
    }
}
