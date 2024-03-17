import { Component, ElementRef, ViewChild } from '@angular/core';
import {ChannelService} from './../../firebase-services/channels.service';
import {MessageService} from './../../firebase-services/massage.service';
import { ChannelInfoDialogComponent } from '../channel-info-dialog/channel-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddChannelDialogComponent } from '../../add-channel-dialog/add-channel-dialog.component';
import { AuthService } from './../../auth.service';
@Component({
  selector: 'app-chat-navigation',
  templateUrl: './chat-navigation.component.html',
  styleUrl: './chat-navigation.component.scss'
})
export class ChatNavigationComponent {

@ViewChild('textarea') textarea: ElementRef | undefined;
private messageSubscription: Subscription | undefined;
@ViewChild('scondTextarea') scondTextarea: ElementRef | undefined;
private scondMessageSubscription: Subscription | undefined;
secondMessages:any;
searchResults: any[] |[]=[];

constructor(
  public channelService: ChannelService,
  public messageService:MessageService,
  public dialog: MatDialog,
  public  authService: AuthService,
){
 
}

resetSecondChatHeader(){
  this.messageService.resetSecondChatHeader();
}


openDialogEditChannel(){
  const dialogRef = this.dialog.open(ChannelInfoDialogComponent, {
    width: '40vw',
  });
}
openDialog() {
  const dialogRef = this.dialog.open(AddChannelDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}
toggleElement(propertyName: string) {
  this.channelService[propertyName] = !this.channelService[propertyName];
}
ngOnDestroy() {
  if (this.messageSubscription) {
    this.messageSubscription.unsubscribe();
  }
  if (this.scondMessageSubscription) {
    this.scondMessageSubscription.unsubscribe();
  }
}
async loadMassgesInTextChannel(sourceType:string,channel: any) {
  this.channelService.selectedChannelId = channel.id;
  this.messageService.secondChatHeader = channel.name;
  this.messageService.channelInfos = channel;
  console.log(channel.name)
  if (this.messageSubscription) {
    this.messageSubscription.unsubscribe();
  }
  
  this.messageService.currentChannelId = channel.id;
  this.messageService.loadMessagesForChannel(sourceType as 'channel' | 'chat',channel.id);

  this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
    console.log('new messages testing',messages);
    this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    console.log('service testing',this.messageService.messages)
  });

  this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(this.messageService.currentChannelId, channel.id).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
    this.secondMessages = secondMessages;
    this.messageService. secondMessagesSource.next(secondMessages);
    console.log('load from funktion loadMessages', this.secondMessages.length); // Zeigt die Anzahl der Nachrichten an
  });
  this.searchResults = [];
  this.channelService.isSecondaryPanelVisible = false;
  this.channelService.isMainChatVisible = true;
  this.channelService.isSidebarVisible = false;
}

loadMassgesInSecondChannel(uid: string, user: string) {
  this.channelService.selectedChannelId = uid;
  this.messageService.switchSecondChatFunktion = false;
  console.log(uid,this.channelService.selectedChannelId);
  this.channelService.currentSecondUser = uid;

  this.messageService.checkForExistingChannel(uid, this.authService.currentUser.uid).then(channelId => {
    this.messageService.currentChannelId = channelId;
    this.messageService.loadMessagesForChannel('chat',channelId );
  });
  this.channelService.isSecondaryPanelVisible = false;
  this.channelService.isMainChatVisible = true;
  this.channelService.isSidebarVisible = false;
}

}
