import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {RegisterComponent} from '../register.component'
import {DragAndDropService} from '../../../service/drag-drop.service'

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.scss'
})
export class UploadDialogComponent {
  message: string = '';
  hovered = false;
  storageTarget:string = '';
  
  constructor(
    private dialogRef: MatDialogRef<RegisterComponent>,
    public dragAndDropService: DragAndDropService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.storageTarget = data.key;
  }

  
  closeDialog(){   
    this.dialogRef.close();
  }


  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
  

  onDragEnter(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.hovered = true; 
  }
  

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.hovered = false;
  }


  onDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      if(this.storageTarget =='profileImg'){
        this.dragAndDropService.profileFile = file;
      }else if(this.storageTarget =='selectedFile'){
        this.dragAndDropService.selectedFile = file;
      }
    
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.dragAndDropService.profileFile = e.target.result;
        this.dragAndDropService.uploadedImage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.hovered = false;
    }
  }
}
