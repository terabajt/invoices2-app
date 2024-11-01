import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '@invoice2-team/users';
import { UsersFacade } from '../state/users.facade';
import * as countriesLib from 'i18n-iso-countries';
import { ActivationResponse } from '../models/types';
declare const require: (arg0: string) => countriesLib.LocaleData;


@Injectable({
    providedIn: 'root'
})
export class UsersService {

    initAppSession() {
        this.usersFacade.buildUserSession();
    }
    apiURLUsers = environment.apiURL + 'users';
    apiURLActivation = environment.apiURL + 'activation';

    constructor(
        private usersFacade: UsersFacade,
        private http: HttpClient
    ) {
        countriesLib.registerLocale(require('i18n-iso-countries/langs/pl.json'));
    }

    getCountries(): { id: string; name: string }[] {
        return Object.entries(countriesLib.getNames('pl', { select: 'official' })).map((entry) => {
            return {
                id: entry[0],
                name: entry[1]
            };
        });
    }

    getCountry(code: string) {
        return countriesLib.getName(code, 'en', { select: 'official' });
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiURLUsers}`);
    }
    getUser(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
    }
    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiURLUsers}/register`, user);
    }
    deleteUser(userId: string) {
        return this.http.delete(`${this.apiURLUsers}/${userId}`);
    }
    updateUser(user: User) {
        return this.http.put<User>(`${this.apiURLUsers}/${user.id}`, user);
    }

    observeCurrentUser() {
        return this.usersFacade.currentUser$;
    }

    isCurrentUserAuth() {
        return this.usersFacade.isAuthenticated$;
    }
  activateUser(token: string): Observable<ActivationResponse> {
    return this.http.get<ActivationResponse>(`${this.apiURLActivation}?token=${token}`);
  }

}
