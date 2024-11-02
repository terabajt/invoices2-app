import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { User, UsersService } from '@invoice2-team/users';
import { of } from 'rxjs';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { UserItemComponent } from './user-item.component';

describe('UserItemComponent', () => {
    let component: UserItemComponent;
    let fixture: ComponentFixture<UserItemComponent>;
    let usersServiceSpy: jasmine.SpyObj<UsersService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const user: User = {
            id: '1',
            name: 'John Doe',
            password: 'password123',
            email: 'john.doe@example.com',
            phone: '123456789',
            address1: 'Address 1',
            address2: 'Address 2',
            zip: '00-000',
            city: 'City',
            country: 'PL',
            taxNumber: '1234567890',
            accountNumber: '12 3456 7890 1234 5678 9012 3456'
        };

        usersServiceSpy = jasmine.createSpyObj('UsersService', ['getCountries', 'observeCurrentUser', 'updateUser', 'initAppSession']);
        usersServiceSpy.observeCurrentUser.and.returnValue(of(user));
        usersServiceSpy.getCountries.and.returnValue([{ id: 'PL', name: 'Polska' }]);
        usersServiceSpy.updateUser.and.returnValue(of(user));
        usersServiceSpy.initAppSession.and.stub();

        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRefSpy.afterClosed.and.returnValue(of(true));

        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        dialogSpy.open.and.returnValue(dialogRefSpy);

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatDialogModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, NoopAnimationsModule],
            declarations: [UserItemComponent],
            providers: [
                FormBuilder,
                { provide: UsersService, useValue: usersServiceSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
        expect(component.form).toBeDefined();
        expect(component.form.get('name')?.value).toBe('John Doe');
        expect(component.form.get('email')?.value).toBe('john.doe@example.com');
        expect(component.form.get('phone')?.value).toBe('123456789');
    });

    it('should open confirmation dialog and save data on onSaveForm', () => {
        const formData = component.form.value;

        component.onSaveForm();

        expect(dialogSpy.open).toHaveBeenCalledWith(DialogComponent, {
            data: {
                message: 'Dane zostaną zaktualizowane. Czy chcesz kontynuować?'
            }
        });

        expect(usersServiceSpy.updateUser).toHaveBeenCalledWith(formData);
        expect(snackBarSpy.open).toHaveBeenCalledWith('Dane zostały zaktualizowane');
    });

    it('should open confirmation dialog and navigate on onCancel', () => {
        component.onCancel();

        expect(dialogSpy.open).toHaveBeenCalledWith(DialogComponent, {
            data: {
                message: 'Wszystkie niezapisane zmiany zostaną utracone. Czy na pewno chcesz anulować?'
            }
        });

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
});
