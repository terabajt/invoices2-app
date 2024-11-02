import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'invoice2-team-dialog',
    templateUrl: './dialog.component.html'
})
export class DialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { message: string }
    ) {}

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

    onOkClick(): void {
        this.dialogRef.close(true);
    }
}
