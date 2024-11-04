import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ActivationComponent } from './pages/activation/activation.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { UsersEffects } from './state/users.effects';
import { UsersFacade } from './state/users.facade';
import * as fromUsers from './state/users.reducer';
import { usersRoutes } from './lib.routes';

const MATERIAL_MODULE = [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(usersRoutes),
        ...MATERIAL_MODULE,
        StoreModule.forFeature(fromUsers.USERS_FEATURE_KEY, fromUsers.reducer),
        EffectsModule.forFeature([UsersEffects])
    ],
    declarations: [LoginComponent, RegisterComponent, ActivationComponent],
    providers: [UsersFacade]
})
export class UsersModule {}
