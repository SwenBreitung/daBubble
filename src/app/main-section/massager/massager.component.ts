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
    
  //  public mainSection:MainSectionComponent,
    public  authService: AuthService,
    public messageService:MessageService,
    private noteService: NoteListService,
    public dialog: MatDialog,
    public dragAndDrop:DragAndDropService,
    // public downloadConfirmDialogComponent :DownloadConfirmDialogComponent 
  ){}
  
  activeEmojiPickerId: string | null = null;
  currentChannelId: string  = '';

  secondMessages:any
  imagePreview:any;
  textareaValue = '';
  // textareaImg = '';
  // showPlaceholder = true;
  searchResults: any[] | undefined;
  // @ViewChild('contentDiv') contentDiv!: ElementRef;
  @ViewChild(MessageInputComponent) messageInputComponent: MessageInputComponent | undefined;

  private messagesSubscription!: Subscription;
  ngOnInit() {

  }
  ngOnDestroy(){
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
  
  trackByFn(index:any, item:any) {
    console.log('index',index, item, 'item')
    return item.id; // oder ein anderes einzigartiges Feld Ihrer Nachrichtenobjekte
  }

loadMassgesFromChannelInSecondChannel(channel:any) {
this.messageService.torgleRightSide = true;
this.messageService.loadMassgesFromChannelInSecondChannel(channel);
}



logMessageUser(messageUser: any, message:string) {
  console.log('Message User:', messageUser, message);
  console.log('Current User:', this.authService.currentUser);
}


toggleEmojiPickerForTextMassage(messageId: string){
 
  if (this.activeEmojiPickerId === messageId) {
   
    this.activeEmojiPickerId = null;
  } else {
  
    this.activeEmojiPickerId = messageId;
  }
}


incrementEmojiCounterAndSaveUid(emoji:string, currentUser:string, message:string, currentChannelId:string){
  console.log('emoji',emoji,'user', currentUser,'massege', message,'channelId', currentChannelId, 'messagerId', )

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

  onEmojiSelect(event: any) {
    // Logik zur Verarbeitung des ausgewählten Emojis
  }

  
toggleEmojiPicker(pickerType:any) {
  if (pickerType === 'main') {
    this.messageService.showMainEmojiPicker = !this.messageService.showMainEmojiPicker;
    console.log(this.messageService.showMainEmojiPicker)
  } else if (pickerType === 'second') {
    this.messageService.showSecondEmojiPicker = !this.messageService.showSecondEmojiPicker;
    console.log( this.messageService.showSecondEmojiPicker)
  }
}


loadmessageaa(){
  console.log('loadmessages',this.messageService.messages)
}
loadDataSecondMessages(){
  console.log('loadmessages',this.messageService.secondMessages)
}

openDialog() {
  const dialogRef = this.dialog.open(UploadDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

async imfpfad(channelID: string) {
  try {
    if (this.dragAndDrop && this.dragAndDrop.selectedFile) {
      const imgPath = await this.dragAndDrop.handleFileDropForChatting(this.dragAndDrop.selectedFile, channelID);
      console.log('Uploaded Image Path:', imgPath);
      return imgPath; // URL des hochgeladenen Bildes
    } else {
      console.error('DragAndDrop oder selectedFile ist nicht definiert');
      return 'defaultImagePath';
    }
  } catch (err) {
    console.error('Fehler beim Hochladen des Bildes', err);
    return 'defaultImagePath'; // Fehlerfall
  }
}

  async downloadImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob(); // Konvertiert die Antwort in einen Blob
      const downloadUrl = window.URL.createObjectURL(blob); // Erstellt eine URL für den Blob
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'downloadedImage.jpg'; // Setzt den Dateinamen für den Download
      document.body.appendChild(a); // Fügt das Anker-Element zum Dokument hinzu
      a.click(); // Simuliert einen Klick auf das Anker-Element
      document.body.removeChild(a); // Entfernt das Anker-Element wieder
      window.URL.revokeObjectURL(downloadUrl); // Gibt die erzeugte Blob-URL frei
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
    }
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
    console.log('Der Dialog wurde geschlossen. Ergebnis:', result,message.id);
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
      console.log('search users', searchTerm, channels);
      this.searchResults = channels;
    })
    .catch(error => {
      console.error('Fehler bei der Suche nach Benutzern:', error);

    });

 }

 handleEmojiInsert(emoji: any) {
  console.log(emoji)
  if(this.messageInputComponent){
    this.messageInputComponent.insertEmoji(emoji);
  }

  // Hier definierst du, was passieren soll, wenn ein Emoji eingefügt wird.
  // Diese Logik kann je nach Elternkomponente variieren.
}
}
