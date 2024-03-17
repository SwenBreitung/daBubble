import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {MainSectionComponent} from './../main-section.component'
import { MessageService } from '../../firebase-services/massage.service';
import { DragAndDropService } from '../../firebase-services/drag-drop.service';
import { MatDialog } from '@angular/material/dialog';
import { EditMessageDialogComponent } from '../../edit-message-dialog/edit-message-dialog.component';
import { UploadDialogComponent } from '../../authentication/register/upload-dialog/upload-dialog.component';
@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {

  constructor(
    public dragAndDropService:DragAndDropService,
    public messageService:MessageService,
    public dialog: MatDialog,
  ){
}
textareaValue = '';
textareaImg = '';
searchResults: any[] | undefined;
showPlaceholder = true;
privateChannelId:string='';

@Input() functionKey!: 'funktionA' | 'funktionB';

@ViewChild('contentDiv') contentDiv!: ElementRef;
@Output() emojiInsert: EventEmitter<string> = new EventEmitter<string>();

ngAfterViewInit() {
  console.log('ngAfterViewInit ausgeführt');
  console.log('contentDiv', this.contentDiv.nativeElement.textContent);
}


sendMessage() {
  if (this.functionKey === 'funktionA') {
    this.saveMessage() ;
  } else if (this.functionKey === 'funktionB') {
    this.saveSecondMessage();
  }
}


async saveMessage() {
  if (this.messageService.currentChannelId) {
    const messageContent = this.contentDiv.nativeElement.textContent; // oder innerHTML für HTML-Inhalt
    console.log(messageContent, 'sending');
  let imgPfad:string = await this.imfpfad(this.messageService.currentChannelId) 
 await this.messageService.saveMessage(messageContent, this.messageService.currentChannelId, imgPfad || ''); 
 this.resetImageInputUI();
 
}
}


saveSecondMessage() {
  const messageContent = this.contentDiv.nativeElement.textContent; // oder innerHTML für HTML-Inhalt
    console.log(messageContent);
  if (!this.messageService.switchSecondChatFunktion && this.privateChannelId) {
    this.messageService.sendPrivateMessage(messageContent, this.privateChannelId);
  } else if (this.messageService.switchSecondChatFunktion) {
    this.messageService.sendChannelMessage(messageContent, this.messageService.switchSecondChatFunktion, this.messageService.currentSecondChannel);
  } 
this.resetImageInputUI();
}


resetImageInputUI(){
  this.closeImg();
  this.textareaImg = '';
  this.contentDiv.nativeElement.textContent = '';
  this.showPlaceholder = true;
  return
}


async imfpfad(channelID: string) {
  try {
    if (this.dragAndDropService && this.dragAndDropService.selectedFile) {
      const imgPath = await this.dragAndDropService.handleFileDropForChatting(this.dragAndDropService.selectedFile, channelID);
      console.log('Uploaded Image Path:', imgPath);
      return imgPath;
    } else {
      return 'defaultImagePath';
    }
  } catch (err) {
    console.error('Fehler beim Hochladen des Bildes', err);
    return 'defaultImagePath'; // Fehlerfall
  }
}


closeImg(){
  this.dragAndDropService.uploadedImage = null;
}


onInput(event: any): void {
  this.showPlaceholder = event.target.textContent.trim() === '';
  setTimeout(() => {
    const element = this.contentDiv.nativeElement;
    const text = element.innerText;
    const regex = /@([^ ]*)$/;
    const matches = text.match(regex);

    if (matches && matches[1]) {
      this.searchUsers(matches[1]);
    }  else { 
      this.searchResults = undefined;
    }

    const highlightedText = text.replace(regex, `<span style="color:blue">$&</span>`);
    if (element.innerHTML !== highlightedText) {
      element.innerHTML = highlightedText;
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(element);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, 0);
}

focusContent(): void {
  this.contentDiv.nativeElement.focus();
}

insertSelectedUserName(selectedUserName: string): void {
  const element = this.contentDiv.nativeElement;
  let content = element.innerText; 
  const regex = /@(\w*)$/;
  const match = content.match(regex);

  if (match) { 
    const htmlContent = element.innerHTML;
    const matchIndex = htmlContent.lastIndexOf(match[0]);

    if (matchIndex !== -1) {  
      const beforeMatch = htmlContent.substring(0, matchIndex);
      const afterMatch = htmlContent.substring(matchIndex + match[0].length);
      element.innerHTML = `${beforeMatch}<span style="color:blue">@${selectedUserName}</span> ${afterMatch}`;
    }
    this.setCursorPosition(element);
  }
}


setCursorPosition(element:any): void {
  const range = document.createRange();
  const sel = window.getSelection();
  if (sel) {
    range.selectNodeContents(element);
    range.collapse(false); 
    sel.removeAllRanges();
    sel.addRange(range);
  }
}


openDialog() {
  const dialogRef = this.dialog.open(UploadDialogComponent, {
    data: { key: 'selectedFile' } 
  });


  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
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


insertAtSymbol(): void {
  const el = this.contentDiv.nativeElement;
  el.focus(); 
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = document.createRange();
    selection.deleteFromDocument();
    range.selectNodeContents(el);
    range.collapse(false);

    const textNode = document.createTextNode("@");
    range.insertNode(textNode);


    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    selection.removeAllRanges(); 
    selection.addRange(range);
    this.showPlaceholder = false;
  }
}


toggleEmojiPicker(pickerType:any) {
  if (this.functionKey === 'funktionA') {
    this.messageService.showMainEmojiPicker = !this.messageService.showMainEmojiPicker;
    console.log(this.messageService.showMainEmojiPicker)
  } else if (this.functionKey === 'funktionB') {
    this.messageService.showSecondEmojiPicker = !this.messageService.showSecondEmojiPicker;
    console.log( this.messageService.showSecondEmojiPicker)
  }
  // if (pickerType === 'main') {
    
  // } else if (pickerType === 'second') {
  
  // }
}



moveCursorToEnd(div:any) {
  const selection = window.getSelection();
  if (selection) { // Überprüft, ob selection einen Wert hat
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(div);
    range.collapse(false); // Bewegt den Cursor ans Ende
    selection.addRange(range);
  }
}

insertEmoji(emoji: string) {
  const div = this.contentDiv.nativeElement;
  this.moveCursorToEnd(div); // Setzt den Cursor zuerst ans Ende
  this.showPlaceholder = false;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);

    // Bewegt den Cursor unmittelbar nach dem eingefügten Emoji
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // Dieser Fall sollte nun weniger häufig auftreten, da der Cursor bereits ans Ende gesetzt wurde
    div.appendChild(document.createTextNode(emoji));
  }
}

}
