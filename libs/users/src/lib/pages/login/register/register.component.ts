import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { LocalstorageService } from '../../../services/localstorage.services';
import { UsersService } from '../../../services/users.service';

@Component({
    selector: 'invoice2-team-register',
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    loginFormGroup: FormGroup = new FormGroup({});
    authError = false;
    errorMessage = 'E-mail albo hasło jest nieprawidłowe';
    footerYear: number = 0;
    infoMessage!: string;
    ifInfo!: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private localstorageService: LocalstorageService,
        private router: Router,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this._initLoginForms();
        this._getCurrentYear();
    }
    private _getCurrentYear() {
        this.footerYear = new Date().getFullYear();
    }
    private _initLoginForms() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    get loginForm() {
        return this.loginFormGroup.controls;
    }
    getFloatLabelValue(): FloatLabelType {
        return this.floatLabelControl.value || 'auto';
    }
    onRegister() {
        const loginData = {
            email: this.loginForm['email'].value,
            password: this.loginForm['password'].value
        };
        this.usersService.createUser(loginData).subscribe(
            (user) => {
                this.authError = false;
                if (user.token) this.localstorageService.setToken(user.token);
                this.ifInfo = true;
                this.infoMessage = 'Na twój mail wysłaliśmy link aktywacyjny. Sprawdź swoją skrzynkę i aktywuj swoje konto.';
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 3000);
            },
            (error: HttpErrorResponse) => {
                this.authError = true;
                if (error.status == 400) {
                    this.errorMessage = `Wystąpił błąd: ${error.error}`;
                }
            }
        );
    }
}
