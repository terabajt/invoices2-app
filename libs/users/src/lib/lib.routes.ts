import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { LogoutComponent } from './pages/login/logout/logout.component';

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
