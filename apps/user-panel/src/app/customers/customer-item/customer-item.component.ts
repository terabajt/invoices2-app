import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { DialogComponent } from '../../shared/dialog/dialog.component';

@Component({
    selector: 'app-customer-item',
    templateUrl: './customer-item.component.html',
    styles: ``
})
export class CustomerItemComponent implements OnInit {
    isLoadingResults = false;
    editMode = true;
    form!: FormGroup;
    clientName = '';
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    currentUserId = '';
    customerId = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private _toast: MatSnackBar,
        private _dialog: MatDialog,
        private router: Router,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this._initUser();
    }

    //CHECK MY NIP
    validateNIP(control: AbstractControl) {
        const inputValue = control.value;

        if (inputValue === null || inputValue === undefined) {
            return null;
        }

        const nip = inputValue.replace(/[- ]/g, ''); // Usuwanie myślników i spacji

        if (nip.length !== 10) {
            return { invalidNIP: true, message: 'NIP musi mieć 10 cyfr.' };
        }

        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += parseInt(nip.charAt(i), 10) * weights[i];
        }

        const checksum = sum % 11;
        const controlDigit = parseInt(nip.charAt(9), 10);

        if (checksum !== controlDigit) {
            return { invalidNIP: true, message: 'Nieprawidłowa suma kontrolna.' };
        }

        return null; // NIP jest poprawny
    }

    private _initUser() {
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) this.currentUserId = user.id;
            this._initCustomerForm();
        });
    }

    private _initCustomerForm() {
        this.route.params.pipe().subscribe((params) => {
            if (params['id']) {
                this.editMode = true;
                this.customerService.getCustomer(params['id']).subscribe((customer: Customer) => {
                    this.customerId = customer._id || '';
                    this.clientName = customer.name || '';
                    this.form = this.formBuilder.group({
                        name: [customer.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                        taxNumber: [customer.taxNumber, [Validators.required, this.validateNIP.bind(this)]],
                        address1: [
                            customer.address1,
                            [
                                Validators.required,
                                Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\d\s./-]+$/),
                                Validators.minLength(3),
                                Validators.maxLength(100)
                            ]
                        ],
                        address2: [customer.address2],
                        zip: [customer.zip, [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
                        email: [customer.email, [Validators.required, Validators.email]],
                        phone: [customer.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
                        city: [
                            customer.city,
                            [Validators.required, Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s.-]+$/), Validators.minLength(3), Validators.maxLength(100)]
                        ]
                    });
                });
            } else {
                this.editMode = false;
                this.form = this.formBuilder.group({
                    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                    taxNumber: ['', [Validators.required, this.validateNIP.bind(this)]],
                    address1: [
                        '',
                        [Validators.required, Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\d\s./-]+$/), Validators.minLength(3), Validators.maxLength(100)]
                    ],
                    address2: [''],
                    zip: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
                    email: ['', [Validators.required, Validators.email]],
                    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
                    city: [
                        '',
                        [Validators.required, Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s.-]+$/), Validators.minLength(3), Validators.maxLength(100)]
                    ]
                });
            }
        });
    }

    getFloatLabelValue(): FloatLabelType {
        return this.floatLabelControl.value || 'auto';
    }

    onSaveForm() {
        if (this.editMode) {
            const formData = this.form.value;
            const newCustomer: Customer = {
                name: formData.name,
                taxNumber: formData.taxNumber,
                address1: formData.address1,
                address2: formData.address2,
                zip: formData.zip,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                userId: this.currentUserId,
                _id: this.customerId
            };
            this.customerService.updateCustomer(newCustomer).subscribe(
                () => {
                    this._toast.open(`Dane klienta zostały zaktualizowane.`);
                    this.router.navigate(['/customers']);
                },
                (err) => {
                    this._toast.open('Wystąpił błąd podczas aktualizacji danych klienta: ', err);
                }
            );
        } else if (!this.editMode) {
            const formData = this.form.value;
            const newCustomer: Customer = {
                name: formData.name,
                taxNumber: formData.taxNumber,
                address1: formData.address1,
                address2: formData.address2,
                zip: formData.zip,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                userId: this.currentUserId,
                _id: this.customerId
            };
            this.customerService.addCustomer(newCustomer).subscribe(
                () => {
                    this._toast.open(`Nowy klient został dodany.`);
                    this.router.navigate(['/customers']);
                },
                () => {
                    this._toast.open('Wystąpił błąd podczas dodawania klienta: ');
                }
            );
        }
    }

    onCancel() {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Wszystkie niezapisane zmiany zostaną utracone. Czy na pewno chcesz anulować?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.router.navigate(['/customers']);
            }
        });
    }
}
