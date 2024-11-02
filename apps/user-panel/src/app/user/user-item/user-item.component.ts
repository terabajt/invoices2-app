import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UsersService } from '@invoice2-team/users';
import { take } from 'rxjs';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styles: ``
})
export class UserItemComponent implements OnInit {
    isLoadingResults = false;
    form!: FormGroup;
    floatLabelControl = new FormControl('auto' as FloatLabelType);

    countries!: { id: string; name: string }[];

    constructor(
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private _toast: MatSnackBar,
        private _dialog: MatDialog,
        private router: Router
    ) {}

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    validateNIP(control: AbstractControl) {
        const inputValue = control.value;

        if (!inputValue) {
            return null;
        }

        const nip = inputValue.replace(/[- ]/g, ''); // Remove dashes and spaces

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

        return null; // NIP is valid
    }

    ngOnInit(): void {
        this._getCountries();
        this._initUserForm();
    }
    private _initUserForm() {
        this.usersService
            .observeCurrentUser()
            .pipe(take(1))
            .subscribe((user) => {
                if (user && user.id) {
                    const currentUserId = user?.id;
                    this.form = this.formBuilder.group({
                        name: [user?.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                        password: [user?.password],
                        email: [user?.email, [Validators.required, Validators.email]],
                        phone: [user?.phone, [Validators.required, Validators.pattern(/^\d{9}$/)]],
                        address1: [
                            user?.address1,
                            [
                                Validators.required,
                                Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\d\s./-]+$/),
                                Validators.minLength(3),
                                Validators.maxLength(100)
                            ]
                        ],
                        address2: [user?.address2],
                        zip: [user?.zip, [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
                        city: [
                            user?.city,
                            [
                                Validators.required,
                                Validators.pattern(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\d\s./-]+$/),
                                Validators.minLength(3),
                                Validators.maxLength(100)
                            ]
                        ],
                        country: [user?.country || this.countries.find((c) => c.name === 'Polska')?.id, Validators.required],
                        taxNumber: [user?.taxNumber, [Validators.required, this.validateNIP.bind(this)]],
                        accountNumber: [user?.accountNumber, [Validators.required, Validators.pattern(/\d{2} \d{4} \d{4} \d{4} \d{4} \d{4} \d{4}/)]],
                        id: [currentUserId]
                    });
                }
            });
        this.usersService.initAppSession();
    }

    onSaveForm() {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Dane zostaną zaktualizowane. Czy chcesz kontynuować?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                const formData = this.form.value;
                const newUserData: User = {
                    name: formData.name,
                    password: formData.password,
                    email: formData.email,
                    phone: formData.phone,
                    address1: formData.address1,
                    address2: formData.address2,
                    zip: formData.zip,
                    city: formData.city,
                    country: formData.country,
                    taxNumber: formData.taxNumber,
                    accountNumber: formData.accountNumber,
                    id: formData.id
                };
                this.usersService.updateUser(newUserData).subscribe(
                    () => {
                        this._toast.open(`Dane zostały zaktualizowane`);
                    },
                    (err) => {
                        this._toast.open('Wystąpił błąd podczas aktualizacji danych', err);
                    }
                );
            }
        });
    }

    onCancel() {
        const dialogRef = this._dialog.open(DialogComponent, {
            data: {
                message: 'Wszystkie niezapisane zmiany zostaną utracone. Czy na pewno chcesz anulować?'
            }
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.router.navigate(['/dashboard']);
            }
        });
    }

    getFloatLabelValue(): FloatLabelType {
        return this.floatLabelControl.value || 'auto';
    }
}
