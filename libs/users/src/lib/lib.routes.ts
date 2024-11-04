import { Route } from '@angular/router';

import { ActivationComponent } from './pages/activation/activation.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/login/logout/logout.component';
import { RegisterComponent } from './pages/login/register/register.component';

export const usersRoutes: Route[] = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'activation/:token',
        component: ActivationComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    }
];
