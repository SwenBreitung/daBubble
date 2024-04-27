import { EventEmitter, Injectable } from '@angular/core';
import { NoteListService } from './note-list.service';
import { Observable } from 'rxjs';
import { ref, uploadBytesResumable } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})



export class DragAndDropService {
  private maxFileSize = 500000; // 500KB
  
  uid:string='';
  profileFile: File | null = null;
  selectedFile: File | null = null;
  fileName: string = '';
  uploadedImage: File | null = null;
  imagePreviewUrl: EventEmitter<string> = new EventEmitter();

  constructor(public firebaseService: NoteListService) {}


  handleFileDrop(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.size <= this.maxFileSize) {
        this.firebaseService.uploadFile(file).subscribe(
          progressOrUrl => {
            if (typeof progressOrUrl === 'string') { 
              resolve(progressOrUrl);
            } 
          },
          error => {
            reject(error); 
          }
        );
      } else {
        reject('File size exceeds the limit of 500KB');
      }
    });
  }

  
  handleFileDropForChatting(file: File, chatId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (file.size <= this.maxFileSize) {
        this.firebaseService.uploadFileForChatting(file, chatId).subscribe(
          progressOrUrl => {
            if (typeof progressOrUrl === 'string' && !progressOrUrl.endsWith('%')) {
              resolve(progressOrUrl); 
            }
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject('File size exceeds the limit of 500KB');
      }
    });
  }



}