import { Component, ElementRef, ViewChild } from '@angular/core';
import {MessageService} from './../../firebase-services/massage.service';
import { ChannelInfoDialogComponent } from '../channel-info-dialog/channel-info-dialog.component';
import { AddChannelDialogComponent } from '../../add-channel-dialog/add-channel-dialog.component';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import {NoteListService} from './../../firebase-services/note-list.service';
import {ChannelService} from './../../firebase-services/channels.service';
import { UserActionsDialogComponent } from '../user-actions-dialog/user-actions-dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-responsive-dashboard',
  templateUrl: './responsive-dashboard.component.html',
  styleUrl: './responsive-dashboard.component.scss'
})
export class ResponsiveDashboardComponent {
  
  showChannels = true;
  showUsers = true;
  isMenuOpen =true;
  selectedChannelId: string | null = null;
  channels: any[] = [];
  secondMessages:any;
  searchResults: any[] |[];
  searchResultsMain: any[]|[] ;
  currentSecondUser:string='';
  users: any[] = [];
  profileImageUrl: string | undefined;
  [key: string]: any;

  @ViewChild('textarea') textarea: ElementRef | undefined;
  private messageSubscription: Subscription | undefined;
  @ViewChild('scondTextarea') scondTextarea: ElementRef | undefined;
  private scondMessageSubscription: Subscription | undefined;



constructor(
 public messageService:MessageService,
 public  authService: AuthService,
 public noteService: NoteListService,
 public channelService: ChannelService,
 public dialog: MatDialog,
 private router: Router,
){
  this.searchResults=[];
  this.searchResultsMain=[] ;  
}


 async ngOnInit(){
    this.loadUserDatas();
    this.logUsersData();
    this.logChannelData();
    const userId = this.authService.currentUser.uid; // Benutzer-ID hier
    this.profileImageUrl = await this.noteService.getProfileImageUrl(userId);
  }
  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.scondMessageSubscription) {
      this.scondMessageSubscription.unsubscribe();
    }
  }
  resetSecondChatHeader(){
    this.messageService.secondChatHeader ='';
    this.messageService.messages =[];
    this.messageService.secondMessages =[];
    this.messageService.torgleRightSide = false;
  }

  openDialogEditChannel(){
    const dialogRef = this.dialog.open(ChannelInfoDialogComponent, {
      width: '40vw',
    });
  }
  toggleElement(propertyName: string) {
    this[propertyName] = !this[propertyName];
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddChannelDialogComponent);

  }

  async loadMassgesInTextChannel(sourceType:string,channel: any) {
    this.messageService.sourceType =sourceType;
    this.messageService.channel =channel;
    // let param1 = sourceType;
    // let param2AsString = JSON.stringify(channel);
      //  this.router.navigate(['/app-responsiv-main-chat', param1, param2AsString]);
   this.router.navigate(['/app-responsiv-main-chat'])
    // this.selectedChannelId = channel.id;
    // this.messageService.secondChatHeader = channel.name;
    // this.messageService.channelInfos = channel;
    // console.log(channel.name)
    // if (this.messageSubscription) {
    //   this.messageSubscription.unsubscribe();
    // }
    
    // this.messageService.currentChannelId = channel.id;
    // this.messageService.loadMessagesForChannel(sourceType as 'channel' | 'chat',channel.id);

    // this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
    //   console.log('new messages testing',messages);
    //   this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    //   console.log('service testing',this.messageService.messages)
    // });

    // this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(this.messageService.currentChannelId, channel.id).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
    //   this.secondMessages = secondMessages;
    //   this.messageService. secondMessagesSource.next(secondMessages);
    //   console.log('load from funktion loadMessages', this.secondMessages.length); // Zeigt die Anzahl der Nachrichten an
    // });
    // this.searchResults = [];
  }
  loadMassgesInSecondChannel(uid: string, user: string) {
    this.selectedChannelId = uid;
    this.messageService.switchSecondChatFunktion = false;
    console.log(uid,this.selectedChannelId);
    this.currentSecondUser = uid;

    this.messageService.checkForExistingChannel(uid, this.authService.currentUser.uid).then(channelId => {
      this.messageService.currentChannelId = channelId;
      this.messageService.loadMessagesForChannel('chat',channelId );
    });
  }
  loadUserDatas(){
    this.noteService.getUsersData().subscribe(users => {
      this.users = users;
      console.log('Benutzerdaten1:','users', this.users,'currenuser',this.authService.currentUser);
    });
  }
  loadDataFromLocal(){
    const userString = localStorage.getItem('dabuble/username');
    return userString;
  }
  async logUsersData() {
    let userJsonString = this.loadDataFromLocal();
    let user;
    if (userJsonString) {
      user = JSON.parse(userJsonString);
    }
    
     if (this.isUserAndCurrentUserNull(user)) {
    this.router.navigate(['/login']);
    }
    if(this.isUserNotNull(user)){
      this.authService.currentUser = user; 
      console.log(this.authService.currentUser)
    }
  }
  isUserAndCurrentUserNull(user:any){
    return !user && !this.authService.currentUser
  }
  isUserNotNull(user:any){
    console.log(user)
    return user != null && user.uid !== null;
  }

  logChannelData() {
    this.channelService.getChannels().subscribe(channels => {
      this.channels = channels;
      console.log('Channel-Daten:', this.channels);
    });
  }


  
  async onInputChange(event: Event, number:number): Promise<void> {

    if (event.target instanceof HTMLInputElement) {
      const input = event.target;
      const inputValue = input.value;
      console.log(inputValue);
      if (inputValue.length === 0) {
        if(1== number){
          this.searchResults = []; 
        }else{
          this.searchResultsMain = [];       
        }
       
      } else {
         await this.search(inputValue, number);
        console.log(this.searchResults); 
      }
    }
  }

  async search(query: string, number:number) {
    if (query.startsWith('#')) {
      return this.searchChannels(query.substring(1), number);
    } else if (query.startsWith('@')) {
      return this.searchUsers(query.substring(1), number);
    } else {
      return this.searchText(query);
    }
  }

  
searchChannels(searchTerm: string,number:number) {
  this.messageService.searchChannels(searchTerm)
    .then(channels => {
      console.log('search Channels', searchTerm, channels);

      if(number == 1){
        this.searchResults = channels;
      }else{
        this.searchResultsMain = channels;
      }
    })
    .catch(error => {
      console.error('Fehler bei der Suche nach Channels:', error);

    });
}

searchUsers(searchTerm: string,number:number) {
  this.messageService.searchUsers(searchTerm)
    .then(channels => {
      console.log('search users', searchTerm, channels);
      if(number == 1){
        this.searchResults = channels;
      }else{
        this.searchResultsMain = channels;
      }
 
    })
    .catch(error => {
      console.error('Fehler bei der Suche nach Channels:', error);
 
    });
}

async searchText(searchTerm: string) {
  console.log('search Text', searchTerm)
  return [];
}


  openDialogChat() {
    const dialogRef = this.dialog.open(UserActionsDialogComponent, {
     
      width:'80%',
        position: {
          bottom: '-28px',
        
      }, 
      panelClass: 'custom-dialog-container',
    });
    
    //  dialogRef.close('OptionalResult');
  }

  // async onInputChange(event: Event, number:number): Promise<void> {
  //   if (event.target instanceof HTMLInputElement) {
  //       const input=event.target;
  //       const inputValue=input.value;
  //       console.log(inputValue);
  //       if (inputValue.length===0) {
  //           if(1==number) {
  //               this.searchResults=[];
  //           }
  //           else {
  //               this.searchResultsMain=[];
  //           }
  //       }
  //       else {
  //           await this.search(inputValue, number);
  //           console.log(this.searchResults);
  //       }
  //   }
}




