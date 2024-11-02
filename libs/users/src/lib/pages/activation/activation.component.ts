import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BackendJSONResponse } from '@invoice2-team/shared';

@Component({
    selector: 'invoice2-team-activation',
    templateUrl: './activation.component.html',
    styles: []
})
export class ActivationComponent implements OnInit {
    footerYear!: number;
    errorMessage!: string;
    isError!: boolean;
    isInfo!: boolean;
    infoMessage!: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UsersService
    ) {}

    ngOnInit(): void {
        this._getCurrentYear();
        this._activateMe();
    }

    private _getCurrentYear() {
        this.footerYear = new Date().getFullYear();
    }
    private _activateMe() {
        this.route.params.pipe().subscribe((params) => {
            if (params['token']) {
                this.userService.activateUser(params['token']).subscribe({
                    next: (response: BackendJSONResponse) => {
                        this.isInfo = true;
                        if (response.message === 'User activated successfully') this.infoMessage = 'Użytkownik został aktywowany prawidłowo.';
                        setTimeout(() => {
                            this.router.navigate(['/']);
                        }, 3000);
                    },

                    error: (error: HttpErrorResponse) => {
                        if (error.status == 404) {
                            this.isError = true;
                            if (error.error.message === 'User not found') {
                                this.errorMessage = 'Token jest nieprawidłowy bądź wygasł.';
                            } else if (error.error.message === 'The user is already activated') {
                                this.errorMessage = 'Ten token został już wykorzystany. Użytkownik jest aktywny.';
                            }
                            setTimeout(() => {
                                this.router.navigate(['/']);
                            }, 3000);
                        }
                        if (error.status == 400) {
                            this.isError = true;
                            if (error.error.message === 'The user is already activated') {
                                this.errorMessage = 'Ten token został już wykorzystany. Użytkownik jest aktywny.';
                            }
                            setTimeout(() => {
                                this.router.navigate(['/']);
                            }, 3000);
                        }
                    }
                });
            }
        });
    }
}
