import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.services';
import { FloatLabelType } from '@angular/material/form-field';
import { UsersService } from '../../services/users.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'invoice2-team-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
    floatLabelControl = new FormControl('auto' as FloatLabelType);
    loginFormGroup: FormGroup = new FormGroup({});
    endsubs$: Subject<{ email: string, password: string }> = new Subject();
    authError = false;
    errorMessage = 'E-mail albo hasło jest nieprawidłowe';
    footerYear!: number;

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private localstorageService: LocalstorageService,
        private router: Router,
        private usersService: UsersService,
        private cdRef: ChangeDetectorRef
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

    onSubmit() {
        const loginData = {
            email: this.loginForm['email'].value,
            password: this.loginForm['password'].value
        };

        this.auth
            .login(loginData.email, loginData.password)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (user) => {
                    this.authError = false;
                    if (user.token) {
                        this.localstorageService.setToken(user.token);
                    }
                    this.router.navigate(['/dashboard']);
                },
                (error: HttpErrorResponse) => {
                    this.authError = true;
                    if (error.status == 404) {
                        if (error.error === 'User not activated') {
                            this.errorMessage =
                                'Wystąpił błąd: Konto nie jest aktywne. Sprawdź swój mail w poszukiwaniu kodu aktywacyjnego bądź skontaktuj się z nami.';
                            this.cdRef.detectChanges();
                        } else if (error.error === 'Password is wrong') {
                            this.errorMessage = 'Wystąpił błąd: Hasło nie jest poprawne';
                            this.cdRef.detectChanges();
                        } else {
                            this.errorMessage = `Wystąpił błąd: ${error.error}`;
                            this.cdRef.detectChanges();
                        }
                    }
                }
            );
    }

    ngOnDestroy(): void {
        this.endsubs$.complete();
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
                this.router.navigate(['/']);
            },
            (error: HttpErrorResponse) => {
                this.authError = true;
                if (error.status == 400) {
                    this.errorMessage = `Wystąpił błąd: ${error.error}`;
                }
            }
        );
    }
    demo() {
        this.loginFormGroup = this.formBuilder.group({
            email: ['demo@demo.pl', [Validators.required, Validators.email]],
            password: ['123456', Validators.required]
        });
    }
}
