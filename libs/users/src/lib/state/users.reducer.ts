import { Action, createReducer, on } from '@ngrx/store';

import { User } from '../models/user';

import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
    user: User | null;
    isAuthenticated: boolean;
}
export interface UsersPartialState {
    readonly [USERS_FEATURE_KEY]: UsersState;
}
export const initialUsersState: UsersState = {
    user: null,
    isAuthenticated: false
};
const usersReducer = createReducer(
    initialUsersState,
    on(UsersActions.buildUserSession, (state) => ({ ...state })),
    on(UsersActions.buildUserSessionSuccess, (state, action) => ({ ...state, user: action.user, isAuthenticated: true })),
    on(UsersActions.buildUserSessionFailed, (state) => ({ ...state, user: null, isAuthenticated: false }))
);
export function reducer(state: UsersState | undefined, action: Action) {
    return usersReducer(state, action);
}
