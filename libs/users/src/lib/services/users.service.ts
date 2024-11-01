import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UsersFacade } from '../state/users.facade';
import * as countriesLib from 'i18n-iso-countries';
declare const require: (arg0: string) => countriesLib.LocaleData;
// import { UsersFacade } from '../state/users.facade';

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

    getUsersCount(): Observable<number> {
        return this.http.get<number>(`${this.apiURLUsers}/get/count`).pipe(map((res: any) => res.userCount));
    }
    observeCurrentUser() {
        return this.usersFacade.currentUser$;
    }

    isCurrentUserAuth() {
        return this.usersFacade.isAuthenticated$;
    }
    activateUser(token: string) {
        return this.http.get(`${this.apiURLActivation}?token=${token}`);
    }
}
