import { Component, Input } from '@angular/core';
import { MessageService } from '../../service/massage.service';
import { AuthService } from './../../service/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditMessageDialogComponent } from '../../dialogs/edit-message-dialog/edit-message-dialog.component';
import { ChannelService } from '../../service/channels.service';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { EmojiBarService } from "../../service/emoji-bar.service";
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
    public emojiBarService:EmojiBarService,
  ){}
  activeEmojiPickerId: string | null = null;
  
  @Input() message: any; 
  @Input() isMainChat: boolean = false;

  AddStaticEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.emojiBarService.addEmojiToMessage(messageId,emoji,currentChannelId, currentUserUid)
  }


  addEmojiToMessage(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    if(this.isMainChat){
      this.emojiBarService.addEmojiToMessage(messageId,emoji.emoji,currentChannelId, currentUserUid)
    }else{
      this.addEmojiToMessageSecond(messageId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid)
    }
  }
  

  addEmojiToMessageSecond(messageId:string,emoji:any, currentChannelId:string, currentUserUid:string){
    this.emojiBarService.addEmojiToMessageSecond(messageId,emoji,currentChannelId, currentUserUid,this.messageService.currentSecondChannel)
  }


  onEmojiClick(event: any, elementId: string) {
    const emoji = event.emoji.native;
    const element = document.getElementById(elementId);
    if (element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value += emoji;
      } else {
        if (this.isMainChat) {
          this.emojiBarService.addEmojiToMessage(elementId, emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);
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
    } catch (error) {}
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
  
}
