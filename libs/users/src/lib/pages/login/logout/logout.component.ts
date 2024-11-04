import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'invoice2-team-logout',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this._logout();
        this._redirectToLogin();
    }
    private _logout() {
        this.auth.logout();
    }
    private _redirectToLogin() {
        this.router.navigate(['/login']);
    }
}
