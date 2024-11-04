import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { User } from '../../models/user';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'invoice2-team-logged-user-info',
    templateUrl: './logged-user-info.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoggedUserInfoComponent implements OnInit {
    user: User | null = null;
    isLoading = true;

    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this._initUser();
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
