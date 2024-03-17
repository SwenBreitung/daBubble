import { Component, Input } from '@angular/core';
import { MessageService } from '../../firebase-services/massage.service';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { EditMessageDialogComponent } from '../../edit-message-dialog/edit-message-dialog.component';
import { ChannelService } from '../../firebase-services/channels.service';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.scss'
})
export class MessageCardComponent {
  constructor(
    public messageService:MessageService,
    public  authService: AuthService,
    public dialog: MatDialog,
    public channelService: ChannelService,
  ){}
  activeEmojiPickerId: string | null = null;
  
  @Input() message: any; // Typisieren Sie dies entsprechend Ihrer Nachrichtenstruktur
  @Input() isMainChat: boolean = false;

  AddStaticEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.messageService.addEmojiToMessage(messageId,emoji,currentChannelId, currentUserUid)
  }


  addEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    if(this.isMainChat){

    
    this.messageService.addEmojiToMessage(messageId,emoji.emoji,currentChannelId, currentUserUid)
  }else{
    this.addEmojiToMessageSecond(messageId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid)
  }
  }
  
  addEmojiToMessageSecond(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.messageService.addEmojiToMessageSecond(messageId,emoji,currentChannelId, currentUserUid,this.messageService.currentSecondChannel)
  }

  onEmojiClick(event: any, elementId: string) {
    const emoji = event.emoji.native;
    const element = document.getElementById(elementId);
  
    if (element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        // Zugriff auf die 'value'-Eigenschaft für Input- und Textarea-Elemente
        element.value += emoji;
      } else {
        if (this.isMainChat) {
          // isMain ist true, führe addEmojiToMessage aus
          this.messageService.addEmojiToMessage(elementId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);
        } else {
          // isMain ist false, führe eine andere Funktion aus
          // Ersetze "andereFunktion" mit dem tatsächlichen Funktionsnamen und füge die notwendigen Parameter hinzu
          this.addEmojiToMessageSecond(elementId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid)
        }
      }
    }
  }


  onEmojiSelect(event: any) {
    // Logik zur Verarbeitung des ausgewählten Emojis
  }


  toggleEmojiPickerForTextMassage(messageId: string){
    if (this.activeEmojiPickerId === messageId) {
      // Wenn der gleiche Emoji-Picker erneut geklickt wird, schließen Sie ihn
      this.activeEmojiPickerId = null;
    } else {
      // Aktualisieren Sie die aktive ID, um den neuen Emoji-Picker anzuzeigen
      this.activeEmojiPickerId = messageId;
    }
  }
  openDialogChat(message:any) {
  const dialogRef = this.dialog.open(EditMessageDialogComponent, {
    width: '380px',
    data: { messageText: 'Ihr initialer Nachrichtentext' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result == null){
      return;
    }
    console.log('Der Dialog wurde geschlossen. Ergebnis:', result,message.id);
    if(this.isMainChat){
      this.messageService.switchText(this.messageService.currentChannelId,message.id,result)
    }else{
      this.messageService.switchTextSecond(this.messageService.currentChannelId,message.id,result,this.messageService.currentSecondChannel)
    }
   
   });
}


loadMassgesFromChannelInSecondChannel(channel:any) {
  // channel.id;
 
this.messageService.torgleRightSide = true;

console.log('torgleRightSide',this.messageService.torgleRightSide);
  // this.messageService.secondChatHeader = channel.name;
  this.channelService.isSidebarVisible = false;
  this.channelService.isMainChatVisible = false;
  this.channelService.isSecondaryPanelVisible =true;
  this.messageService.loadMassgesFromChannelInSecondChannel(channel);

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

}
