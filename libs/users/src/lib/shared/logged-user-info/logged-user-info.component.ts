import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'invoice2-team-logged-user-info',
    templateUrl: './logged-user-info.component.html',
    styles: []
})
export class LoggedUserInfoComponent implements OnInit {
    user: User | null = null;
    isLoading = true;
    private destroy$: Subject<void> = new Subject<void>();

    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this._initUser();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private _initUser() {
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) {
                this.user = user;
                this.isLoading = false;
            }
        });
    }

    refreshUser() {
        this.isLoading = true;
        this._initUser();
    }
}
