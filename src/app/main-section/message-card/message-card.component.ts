import { Component, Input } from '@angular/core';
import { MessageService } from '../../firebase-services/massage.service';
import { AuthService } from '../../auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditMessageDialogComponent } from '../../edit-message-dialog/edit-message-dialog.component';
import { ChannelService } from '../../firebase-services/channels.service';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

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
        element.value += emoji;
      } else {
        if (this.isMainChat) {
          this.messageService.addEmojiToMessage(elementId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);
        } else {
          this.addEmojiToMessageSecond(elementId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid)
        }
      }
    }
  }


  onEmojiSelect(event: any) {}


  toggleEmojiPickerForTextMassage(messageId: string){
    if (this.activeEmojiPickerId === messageId) {
      this.activeEmojiPickerId = null;
    } else {
      this.activeEmojiPickerId = messageId;
    }
  }


  // openDialogChat(message:any) {
  // const dialogRef = this.dialog.open(EditMessageDialogComponent, {
  //     width: '380px',
  //     data: { messageText: 'Ihr initialer Nachrichtentext' }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result == null){
  //       return;
  //     }  
  //     if(this.isMainChat){
  //       this.messageService.switchText(this.messageService.currentChannelId,message.id,result)
  //     }else{
  //       this.messageService.switchTextSecond(this.messageService.currentChannelId,message.id,result,this.messageService.currentSecondChannel)
  //     }
  //   });
  // }
  openDialogChat(message: any): void {
    const dialogRef = this.openEditMessageDialog('Ihr initialer Nachrichtentext');
    
    dialogRef.afterClosed().subscribe(result => {
      this.handleDialogResult(result, message);
    });
  }
  
 
  openEditMessageDialog(messageText: string): MatDialogRef<EditMessageDialogComponent, any> {
    return this.dialog.open(EditMessageDialogComponent, {
      width: '380px',
      data: { messageText }
    });
  }
  
 
  handleDialogResult(result: any, message: any): void {
    if(result == null){
      return;
    }  
    if(this.isMainChat){
      this.messageService.switchText(this.messageService.currentChannelId, message.id, result);
    }else{
      this.messageService.switchTextSecond(this.messageService.currentChannelId, message.id, result, this.messageService.currentSecondChannel);
    }
  }



  loadMassgesFromChannelInSecondChannel(channel:any) {
    this.messageService.torgleRightSide = true;
    this.channelService.isSidebarVisible = false;
    this.channelService.isMainChatVisible = false;
    this.channelService.isSecondaryPanelVisible =true;
    this.messageService.loadMassgesFromChannelInSecondChannel(channel);
  }


  async downloadImage(imageUrl: string): Promise<void> {
    try {
      const blob = await this.fetchImageAsBlob(imageUrl);
      const filename = this.extractFilename(imageUrl);
      const link = this.createDownloadLink(blob, filename);
      this.triggerDownload(link);
    } catch (error) {
      console.error('Fehler beim Herunterladen des Bildes:', error);
    }
  }

  private async fetchImageAsBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    return response.blob();
  }

  private extractFilename(imageUrl: string): string {
    const basePath = imageUrl.split('?')[0];
    const filename = basePath.split('/').pop();
    return filename || 'downloadedFile';
  }

  private createDownloadLink(blob: Blob, filename: string): HTMLAnchorElement {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    return link;
  }

  private triggerDownload(link: HTMLAnchorElement): void {
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
  // async downloadImage(imageUrl: string) {
  //   try {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob(); // Konvertiert die Antwort in einen Blob
  //     const downloadUrl = window.URL.createObjectURL(blob); // Erstellt eine URL für den Blob
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     const basePath = imageUrl.split('?')[0];
  //     const extension = basePath.split('.').pop();
  //     a.download = 'downloadedImage.' + extension;
  //     document.body.appendChild(a); 
  //     a.click(); 
  //     document.body.removeChild(a); 
  //     window.URL.revokeObjectURL(downloadUrl); 
  //   } catch (error) {
  //     console.error('Fehler beim Herunterladen des Bildes:', error);
  //   }
  // }


  // async downloadImage(imageUrl: string) {
  //   try {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob(); // Konvertiert die Antwort in einen Blob
  //     const downloadUrl = window.URL.createObjectURL(blob); // Erstellt eine URL für den Blob
  //     const a = document.createElement('a');
  //     a.href = downloadUrl;
  //     a.download = 'downloadedImage.jpg'; // Setzt den Dateinamen für den Download
  //     document.body.appendChild(a); // Fügt das Anker-Element zum Dokument hinzu
  //     a.click(); // Simuliert einen Klick auf das Anker-Element
  //     document.body.removeChild(a); // Entfernt das Anker-Element wieder
  //     window.URL.revokeObjectURL(downloadUrl); // Gibt die erzeugte Blob-URL frei
  //   } catch (error) {
  //     console.error('Fehler beim Herunterladen des Bildes:', error);
  //   }
  // }
  // async downloadImage(imagePath: string) {
  //   const storage = getStorage(); // Zugriff auf den Firebase Storage
  //   const imageRef = ref(storage, imagePath); // Erstellen einer Referenz zum Bildpfad
  
  //   try {   
  //     const storage = getStorage();
  //   getDownloadURL(ref(storage, 'https://firebasestorage.googleapis.com/v0/b/dabubble-7d65b.appspot.com/o/ydGNfqJEnQklQna4g380%2Fleft_menu_icon_close.svg?alt=media&token=0609dfd4-e564-4012-87b6-9169afe99a14'))
  //     .then((url) => {
  //   // `url` is the download URL for 'images/stars.jpg'
  //   // This can be downloaded directly:
  //      const xhr = new XMLHttpRequest();
  //     xhr.responseType = 'blob';
  //     xhr.onload = (event) => {
  //       const blob = xhr.response;
  //     };
  //     xhr.open('GET', url);
  //     xhr.send();
  //   // Or inserted into an <img> element
  //     const img = document.getElementById('myimg');
  //     if(img){
  //       img.setAttribute('src', url);
  //     }
  //   })
  //   .catch((error) => {
  // console.log(error)
  // });


      // const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/dabubble-7d65b.appspot.com/o/ydGNfqJEnQklQna4g380%2Fleft_menu_icon_close.svg?alt=media&token=0609dfd4-e564-4012-87b6-9169afe99a14';
      // const a = document.createElement('a');
      // a.href = imageUrl;
      // a.download = 'left_menu_icon_close.svg'; // Setzen Sie den gewünschten Dateinamen für den Download
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);

      // const url = await getDownloadURL(imageRef); // URL zum direkten Herunterladen des Bildes
      // // Sie können nun die URL verwenden, um das Bild in einem <img> Tag anzuzeigen oder herunterzuladen
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'downloadedImage.jpg'; // Optional: Setzen Sie einen Dateinamen für den Download
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
  //   } catch (error) {
  //     console.error('Fehler beim Herunterladen des Bildes:', error);
  //   }
  // }
}
