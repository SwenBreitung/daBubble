import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {MainSectionComponent} from './../main-section.component'
import { AuthService } from './../../auth.service';
import { MessageService } from './../../firebase-services/massage.service';
import { NoteListService } from './../../firebase-services/note-list.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UploadDialogComponent } from './../../authentication/register/upload-dialog/upload-dialog.component'
import { DragAndDropService } from './../../firebase-services/drag-drop.service'
import { EditMessageDialogComponent } from './../../edit-message-dialog/edit-message-dialog.component'
import { DownloadConfirmDialogComponent } from './../../download-confirm-dialog/download-confirm-dialog.component'
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { __awaiter } from 'tslib';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-massager',
  templateUrl: './massager.component.html',
  styleUrl: './massager.component.scss'
})
export class MassagerComponent {
  cdRef: any;
 

  constructor(
    public  authService: AuthService,
    public messageService:MessageService,
    private noteService: NoteListService,
    public dialog: MatDialog,
    public dragAndDrop:DragAndDropService,
  ){}
  
  activeEmojiPickerId: string | null = null;
  currentChannelId: string  = '';

  secondMessages:any
  imagePreview:any;
  textareaValue = '';
  searchResults: any[] | undefined;
  @ViewChild(MessageInputComponent) messageInputComponent: MessageInputComponent | undefined;

  private messagesSubscription!: Subscription;
  ngOnInit() {}


  ngOnDestroy(){
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
  

  trackByFn(index:any, item:any) {
    return item.id; 
  }

  loadMassgesFromChannelInSecondChannel(channel:any) {
    this.messageService.torgleRightSide = true;
    this.messageService.loadMassgesFromChannelInSecondChannel(channel);
  }



  toggleEmojiPickerForTextMassage(messageId: string){
    if (this.activeEmojiPickerId === messageId) {
      this.activeEmojiPickerId = null;
    } else {
      this.activeEmojiPickerId = messageId;
    }
  }


  incrementEmojiCounterAndSaveUid(emoji:string, currentUser:string, message:string, currentChannelId:string){
    this.messageService.incrementEmojiCounterAndSaveUid(message, emoji, currentUser,  this.messageService.currentChannelId)
  }
  


  onEmojiClick(event: any, elementId: string) {
    const emoji = event.emoji.native;
    const element = document.getElementById(elementId);
    this.handleEmojiInsert(emoji)
    if (element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value += emoji;
      } else {    
        this.messageService.addEmojiToMessage(elementId,emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);  
      }
    }
  }

  onEmojiSelect(event: any) {}

  
  toggleEmojiPicker(pickerType:any) {
    if (pickerType === 'main') {
      this.messageService.showMainEmojiPicker = !this.messageService.showMainEmojiPicker;
    } else if (pickerType === 'second') {
      this.messageService.showSecondEmojiPicker = !this.messageService.showSecondEmojiPicker;
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent);
    dialogRef.afterClosed().subscribe(result => {});
  }


  async imfpfad(channelID: string) {
    try {
      if (this.dragAndDrop && this.dragAndDrop.selectedFile) {
        const imgPath = await this.dragAndDrop.handleFileDropForChatting(this.dragAndDrop.selectedFile, channelID);
        return imgPath; 
      } else {
        return 'defaultImagePath';
      }
    } catch (err) {
    return 'defaultImagePath'; 
    }
  }


  async downloadImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob(); 
      const downloadUrl = window.URL.createObjectURL(blob); 
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'downloadedImage.jpg'; 
      document.body.appendChild(a); 
      a.click(); 
      document.body.removeChild(a); 
      window.URL.revokeObjectURL(downloadUrl); 
    } catch (error) {}
  }


  closeImg(){
    this.dragAndDrop.uploadedImage = null;
  }


  openDialogChat(message:any) {
    const dialogRef = this.dialog.open(EditMessageDialogComponent, {
      width: '250px',
      data: { messageText: 'Ihr initialer Nachrichtentext' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == null){
        return;
      }
      this.messageService.switchText(this.messageService.currentChannelId,message.id,result)
    });
  }

  addEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.messageService.addEmojiToMessage(messageId,emoji.emoji,currentChannelId, currentUserUid)
  }


  AddStaticEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.messageService.addEmojiToMessage(messageId,emoji,currentChannelId, currentUserUid)
  }



  searchUsers(searchTerm: string): void {
    this.messageService.searchUsers(searchTerm)
      .then(channels => {
        this.searchResults = channels;
      })
    .catch(error => {});
  }


  handleEmojiInsert(emoji: any) {
    if(this.messageInputComponent){
      this.messageInputComponent.insertEmoji(emoji);
    }
  }

  
}
