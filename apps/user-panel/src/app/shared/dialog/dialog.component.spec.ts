import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [DialogComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MatDialog, useValue: { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }) } },
                { provide: MAT_DIALOG_DATA, useValue: { message: 'Test message' } }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the provided message', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Test message');
    });

    it('should close the dialog with false when onCancelClick is called', () => {
        component.onCancelClick();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('should close the dialog with true when onOkClick is called', () => {
        component.onOkClick();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });
});
