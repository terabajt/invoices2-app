import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerName, CustomerService, EntryItem, Invoice, InvoicesService } from '@invoice2-team/invoices';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { UsersService } from '@invoice2-team/users';

@Component({
    selector: 'app-invoice-item-copy',
    templateUrl: './invoice-item-copy.component.html',
    styles: ``
})
export class InvoiceItemCopyComponent implements OnInit {
    isLoadingResults = false;
    form!: FormGroup;
    dueDatePicker: Date | null = null;
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    hideRequiredControl = new FormControl(false);
    invoiceId!: string;
    netAmountSum = 0;
    grossSum = 0;
    currYear = new Date().getFullYear();
    currentUserId = '';
    customersName: CustomerName[] = [];
    lastNumberOfInvoice = 0;

    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: InvoicesService,
        private route: ActivatedRoute,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
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
                    const newNumberOfInvoice = this.lastNumberOfInvoice + 1 || 0;
                    const invoiceNumber = `FV/${newNumberOfInvoice}/${this.currYear}`;
                    this.invoiceId = params['id'];
                    if (invoice.entryItem) {
                        const entryItemsArray = this.formBuilder.array(
                            invoice.entryItem.map((item: EntryItem) => {
                                const formItems = this.formBuilder.group({
                                    id_item: [item._id],
                                    nameEntry: [item.nameEntry, Validators.required],
                                    quantityEntry: [item.quantityEntry, Validators.required],
                                    taxEntry: [item.taxEntry?.toString(), Validators.required],
                                    netAmountEntry: [item.netAmountEntry, Validators.required],
                                    grossEntry: [(item.quantityEntry || 0) * (item.taxEntry || 0) * (item.netAmountEntry || 0), Validators.required]
                                });

                                // Sbuscribe changes in form constrols for recalculate gross entry
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
                            }) || []
                        );
                        entryItemsArray.controls.forEach((control) => {
                            const formItems = control as FormGroup;

                            // Subuscribe changes in form constrols for recalculate gross entry for new added items
                            formItems.get('quantityEntry')?.valueChanges.subscribe(() => {
                                this.updateGrossEntry(formItems);
                            });

                            formItems.get('taxEntry')?.valueChanges.subscribe(() => {
                                this.updateGrossEntry(formItems);
                            });

                            formItems.get('netAmountEntry')?.valueChanges.subscribe(() => {
                                this.updateGrossEntry(formItems);
                            });
                        });

                        this.form = this.formBuilder.group({
                            invoiceNumber: [invoiceNumber, Validators.required],
                            invoiceDate: [new Date(), Validators.required],
                            dueDate: [new Date(), Validators.required],
                            customer: [invoice.customer, Validators.required],
                            entryItems: entryItemsArray,
                            netAmountSum: [this.netAmountSum, Validators.required],
                            grossSum: [this.grossSum, Validators.required]
                        });
                        this.isLoadingResults = false;

                        this.updateGrossEntry(this.form);
                    } else {
                        this.isLoadingResults = false;
                    }
                });
            }
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
            nameEntry: ['', Validators.required],
            quantityEntry: [0, Validators.required],
            taxEntry: ['23', Validators.required],
            netAmountEntry: [0, Validators.required],
            grossEntry: [0, Validators.required]
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
    }
    get invoiceForm() {
        return this.form.controls;
    }
    onSaveForm() {
        if (this.form.invalid) {
            return this._toast.open(`Faktura nie jest wypełniona prawidłowo`);
        }
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
