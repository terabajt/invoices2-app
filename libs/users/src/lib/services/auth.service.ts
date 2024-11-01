import { Injectable } from '@angular/core';
// import { enviroment } from '@env/enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { User } from '../models/user';
import { LocalstorageService } from './localstorage.services';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    apiURLUsers = environment.apiURL + 'users';

    constructor(
        private http: HttpClient,
        private token: LocalstorageService,
        private router: Router
    ) {}

    login(email: string, password: string): Observable<User> {
        return this.http.post<User>(`${this.apiURLUsers}/login`, { email, password });
    }

    logout() {
        this.token.removeToken();
        this.router.navigate(['/login']);
    }
}
