import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
    currentUser$ = this.store.pipe(select(UsersSelectors.getUser));
    isAuthenticated$ = this.store.pipe(select(UsersSelectors.getUser));
    constructor(private store: Store) {}
    buildUserSession() {
        this.store.dispatch(UsersActions.buildUserSession());
    }
}
