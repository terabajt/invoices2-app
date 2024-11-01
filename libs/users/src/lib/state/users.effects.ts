import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, of, concatMap, map } from 'rxjs';
import * as UsersActions from './users.actions';
import { LocalstorageService } from '../services/localstorage.services';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {
    buildUsersSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.buildUserSession),
            concatMap(() => {
                if (this.localstorageService.isValidToken()) {
                    const userId = this.localstorageService.getUserIdFromToken();
                    if (userId) {
                        return this.usersService.getUser(userId).pipe(
                            map((user) => {
                                return UsersActions.buildUserSessionSuccess({ user: user });
                            }),
                            catchError(() => of(UsersActions.buildUserSessionFailed()))
                        );
                    } else {
                        return of(UsersActions.buildUserSessionFailed());
                    }
                } else {
                    return of(UsersActions.buildUserSessionFailed());
                }
            })
        )
    );
    constructor(
        private actions$: Actions,
        private localstorageService: LocalstorageService,
        private usersService: UsersService
    ) {}
}
