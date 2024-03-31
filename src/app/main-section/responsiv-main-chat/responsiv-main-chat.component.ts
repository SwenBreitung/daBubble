import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MessageService} from './../../firebase-services/massage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';
import { UserActionsDialogComponent } from '../user-actions-dialog/user-actions-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-responsiv-main-chat',
  templateUrl: './responsiv-main-chat.component.html',
  styleUrl: './responsiv-main-chat.component.scss'
})

export class ResponsivMainChatComponent {
  searchResultsMain: any[]|[] =[];
  selectedChannelId: string | null = null;
  secondMessages:any;
  searchResults: any[] |[] =[];
  @ViewChild('textarea') textarea: ElementRef | undefined;
  private messageSubscription: Subscription | undefined;
  profileImageUrl: string | undefined;

  constructor(
    private route: ActivatedRoute,
    public messageService:MessageService,
    public  authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    ) {}


  ngOnInit() {
    this.initializeChannelState();
    this.unsubscribePreviousSubscription();
    this.loadAndSubscribeToMessages();
    this.subscribeToSecondChannelMessages();
    this.resetSearchResults();
  }
  

  initializeChannelState() {
    const channel = this.messageService.channel;
    this.selectedChannelId = channel.id;
    this.messageService.secondChatHeader = channel.name;
    this.messageService.channelInfos = channel;
  }
  

  unsubscribePreviousSubscription() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  

  loadAndSubscribeToMessages() {
    const channel = this.messageService.channel;
    this.messageService.currentChannelId = channel.id;
    this.messageService.loadMessagesForChannel(this.messageService.sourceType as 'channel' | 'chat', channel.id);
    
    this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
      this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    });
  }
  

  subscribeToSecondChannelMessages() {
    this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(this.messageService.currentChannelId, this.messageService.channel.id).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
      this.secondMessages = secondMessages;
      this.messageService.secondMessagesSource.next(secondMessages);
    });
  }
  
  
  resetSearchResults() {
    this.searchResults = [];
  }


  return(){
    this.router.navigate(['/app-responsive-dashboard'])
  }

  
  openDialogChat() {
    const dialogRef = this.dialog.open(UserActionsDialogComponent, {
      width:'80%',
        position: {
          bottom: '-28px',   
      }, 
      panelClass: 'custom-dialog-container',
    });  
  }

  
}
