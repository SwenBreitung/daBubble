import { Component, ElementRef, ViewChild } from '@angular/core';
import {ChannelService} from '../../service/channels.service';
import {MessageService} from '../../service/massage.service';
import { ChannelInfoDialogComponent } from '../../dialogs/channel-info-dialog/channel-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddChannelDialogComponent } from '../../add-channel-dialog/add-channel-dialog.component';
import { AuthService } from './../../service/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-chat-navigation',
  templateUrl: './chat-navigation.component.html',
  styleUrl: './chat-navigation.component.scss',
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
  ){}

  
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

    dialogRef.afterClosed().subscribe(result => {});
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


  async loadMassgesInTextChannel(sourceType: string, channel: any) {
    this.channelService.selectedChannelId = channel.id;
    this.messageService.secondChatHeader = channel.name;
    this.messageService.channelInfos = channel;
  
    this.unsubscribePreviousMessageSubscription();
    this.messageService.currentChannelId = channel.id;
    await this.loadMessages(sourceType, channel.id);
    this.subscribeToMessages();
    this.subscribeToSecondChannelMessages(this.messageService.currentChannelId, channel.id);
    this.setUIForChannelVisibility();
  }


  loadMassgesInSecondChannel(uid: string, user: string) {
    this.channelService.selectedChannelId = uid;
    this.messageService.switchSecondChatFunktion = false;
    this.channelService.currentSecondUser = uid;
    this.unsubscribePreviousMessageSubscription();
    this.messageService.checkForExistingChannel(uid, this.authService.currentUser.uid).then(channelId => {
      this.messageService.currentChannelId = channelId;
      this.loadMessages('chat', channelId);
    });
    this.setUIForChannelVisibility();
  }


  setUIForChannelVisibility() {
    this.channelService.isSecondaryPanelVisible = false;
    this.channelService.isMainChatVisible = true;
    this.channelService.isSidebarVisible = false;
    console.log(this.channelService.isSecondaryPanelVisible ,this.channelService.isMainChatVisible, this.channelService.isSidebarVisible)
  }


  unsubscribePreviousMessageSubscription() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  

  async loadMessages(sourceType: any, channelId: string) {
    this.messageService.loadMessagesForChannel(sourceType, channelId);
  }
  

  subscribeToMessages() {
    this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
      this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    });
  }
  

  subscribeToSecondChannelMessages(currentChannelId: string, channelId: string) {
    this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(currentChannelId, channelId).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
      this.secondMessages = secondMessages;
      this.messageService.secondMessagesSource.next(secondMessages);
    });
  }


}
