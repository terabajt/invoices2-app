import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.services';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private localStorageToken: LocalstorageService
    ) {}

    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const token = this.localStorageToken.getToken();
        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));
            //isAdmin check
            if (tokenDecode.isAdmin && this._tokenExpired(tokenDecode.exp)) {
                return true;
            }

            //user check
            if (this._tokenExpired(tokenDecode.exp)) {
                return true;
            }
        }

        this.router.navigate(['/login']);
        return false;
    }
    private _tokenExpired(expiration: number): boolean {
        return Math.floor(new Date().getTime() / 1000) <= expiration;
    }
}
