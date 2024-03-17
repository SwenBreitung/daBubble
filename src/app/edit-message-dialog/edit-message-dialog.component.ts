import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-message-dialog',
  templateUrl: './edit-message-dialog.component.html',
  styleUrl: './edit-message-dialog.component.scss'
})
export class EditMessageDialogComponent {
  messageText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.messageText = data.messageText;
  }
}
