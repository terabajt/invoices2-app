import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.services';
import { environment } from '@invoice2-team/users';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private localStorage: LocalstorageService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.localStorage.getToken();
        const isAPIUrl = request.url.startsWith(environment.apiURL);

        if (token && isAPIUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }
}
