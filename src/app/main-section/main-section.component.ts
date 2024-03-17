import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AddChannelDialogComponent } from './../add-channel-dialog/add-channel-dialog.component';
import {Channel} from './../models/channel.class';
import {ChannelService} from './../firebase-services/channels.service';
import {NoteListService} from './../firebase-services/note-list.service';
import {MessageService} from './../firebase-services/massage.service';
import { User} from '../models/user.class'
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { DragAndDropService } from '../firebase-services/drag-drop.service';
import { UserActionsDialogComponent } from './user-actions-dialog/user-actions-dialog.component';
import {ChannelInfoDialogComponent} from './channel-info-dialog/channel-info-dialog.component';


@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
   template:`<app-massager [messages]="messages"></app-massager>`,
   

})


export class MainSectionComponent  {
  
  privateChannelId:string='';
  isMenuOpen =true;
 
  user: User = new User();
  // channels: any[] = [];
  // users: any[] = [];
 
 
  showEmojiPicker: boolean = false;
  profileImageUrl: string | undefined;
  showMainEmojiPicker = false;
  showSecondEmojiPicker = false;
  currentSecondChannel:string = '';
  activeEmojiPickerId: string | null = null;
  searchResults: any[] |[];
  searchResultsMain: any[]|[] ;
  secondMessages:any;

  

  @ViewChild('textarea') textarea: ElementRef | undefined;
  private messageSubscription: Subscription | undefined;
  @ViewChild('scondTextarea') scondTextarea: ElementRef | undefined;
  private scondMessageSubscription: Subscription | undefined;

  
  constructor(
    public dialog: MatDialog,
    public channelService: ChannelService,
    public noteService: NoteListService,
    public messageService:MessageService,
    public  authService: AuthService,
    private dragAndDropService:DragAndDropService,
    private router: Router ,
    
    ) {
      this.checkScreenSize();
      this.searchResults=[];
      this.searchResultsMain=[] ;  
      this.dragAndDropService.uploadedImage =null;
      console.log('%cconstructor', 'color: orange;', this.authService.currentUser);
      console.log('%cconstructor', 'color: orange;', this.user);
  }

  
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.channelService.isScreenWide = window.innerWidth > 700;
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

  


  logChannelData() {
    this.channelService.getChannels().subscribe(channels => {
      this.channelService.channels = channels;
      console.log('Channel-Daten:', this.channelService.channels);
    });
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

  loadUserDatas(){
    this.noteService.getUsersData().subscribe(users => {
      this.channelService.users = users;
      console.log('Benutzerdaten1:','users', this.channelService.users,'currenuser',this.authService.currentUser);
    });
  }
 

  loadDataFromLocal(){
    const userString = localStorage.getItem('dabuble/username');
    return userString;
  }


  loadUserdata(){
    const authUser = this.authService.getCurrentUser();
    console.log(authUser); 
    console.log(this.user)
  }


  chatWithUser(userID: string,user: any){
    console.log('userID',userID, ':user',user)
  }
  

  // toggleElement(propertyName: string) {
  //   this[propertyName] = !this[propertyName];
  // }

  toggleElement(propertyName: string) {
    this.channelService[propertyName] = !this.channelService[propertyName];
  }
toggleEmojiPicker(pickerType:any) {
  if (pickerType === 'main') {
    this.showMainEmojiPicker = !this.showMainEmojiPicker;
    console.log(this.showMainEmojiPicker)
  } else if (pickerType === 'second') {
    this.showSecondEmojiPicker = !this.showSecondEmojiPicker;
    console.log( this.showSecondEmojiPicker)
  }
}
toggleEmojiPickerForTextMassage(messageId: string){
 
    if (this.activeEmojiPickerId === messageId) {
      this.activeEmojiPickerId = null;
    } else { 
      this.activeEmojiPickerId = messageId;
    }
}

  onEmojiSelect(event: any) {
    // Logik zur Verarbeitung des ausgewählten Emojis
  }


  

  onEmojiClick(event: any, elementId: string) {
    const emoji = event.emoji.native;
    const element = document.getElementById(elementId);
  
    if (element) {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        element.value += emoji;
      } else {
        this.messageService.addEmojiToMessage(elementId,emoji, this.messageService.currentChannelId, this.authService.currentUser.uid);    
      }
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
  
  }
 

  saveSecondMessage(messageText: string) {
    if(!this.messageService.switchSecondChatFunktion){
      if (this.privateChannelId) {
        this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
          switchMap(user => {
            console.log('testname', user.name); 
            return this.messageService.addMessageSecond(this.privateChannelId as string, messageText, user.name);
          })
        ).subscribe({
          next: () => {
       
          },
          error: (error) => console.error('Fehler beim Senden der Nachricht', error)
        });
      } else {
        console.log('Kein Channel ausgewählt');
      }
    }else if(this.messageService.switchSecondChatFunktion){
      
      this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
        switchMap(user => {
          console.log('testname', user.name, user.uid); // Zugriff auf den Namen des Benutzers
          // Rufen Sie die nächste Funktion innerhalb des switchMap auf
          return this.messageService.addMessageSecondFromChannel(this.messageService.currentChannelId as string, messageText, user.name,this.currentSecondChannel);
        })
      ).subscribe({
        next: () => {
         
        },
        error: (error) => console.error('Fehler beim Senden der Nachricht', error)
      });


    } 
  }


  logMessageUser(messageUser: any, message:string) {
    console.log('Message User:', messageUser, message);
    console.log('Current User:', this.authService.currentUser);
  }

  incrementEmojiCounterAndSaveUid(emoji:string, currentUser:string, message:string, currentChannelId:string){
this.messageService.incrementEmojiCounterAndSaveUid(message, emoji, currentUser,  currentChannelId)
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


resetSecondChatHeader(){
  this.messageService.resetSecondChatHeader();
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

toggleLeftWindow(){
  this.channelService.isLeftWindowOpen = !this.channelService.isLeftWindowOpen;
  console.log('isleftWindowOpen',this.channelService.isLeftWindowOpen)
  this.isMenuOpen = !this.isMenuOpen;
}


async imfpfad() {

    const chatID =  this.noteService.uid; 
    if (this.dragAndDropService && this.dragAndDropService.fileName) {
      console.log('forImg', this.dragAndDropService.fileName);

      const fileNameParts = this.dragAndDropService.fileName.split('.');
      if (fileNameParts.length > 1) {
        const fileExtension = fileNameParts.pop();
        const imagePath = `${chatID}/this.dragAndDropService.fileName`;
        console.log('Generated Image Path:', imagePath);

        return imagePath;
      } else {
        console.error('Dateiendung konnte nicht aus fileName extrahiert werden');
        return 'defaultImagePath';
      }
    } else {
      console.error('drandAndDrop oder fileName ist nicht definiert');
      return 'defaultImagePath';
    }

}

// openDialogChat() {

//     const dialogRef = this.dialog.open(UserActionsDialogComponent, {
//       width: '160px',
//       height: '160px',
      
//       panelClass: 'padding16px', // Füge hier deine Klasse für padding hinzu
//       position: {
//         top: '100px',
//         right: '26px'
//       },
   
   

//   });
//      if(this.channelService.isScreenWide){
//         width:'80%',
//         position: {
//           bottom: '-28px',
        
//       }, 
//       panelClass: 'custom-dialog-container',
    
//     });
//   }
//   // dialogRef.close('OptionalResult');
// }
  openDialogChat() {
 
    let dialogConfig;
    if (this.channelService.isScreenWide) {
      dialogConfig = this.getDialogConfig();
    }
    // Überprüfe die Bedingung und rufe eine Funktion auf, um die Konfiguration zu ändern
    if (!this.channelService.isScreenWide) {
      dialogConfig = this.getWideScreenDialogConfig();
    }
    const dialogRef = this.dialog.open(UserActionsDialogComponent, dialogConfig);
  }


  getDialogConfig() {
    return {
      width: '160px',
      height: '160px',
      panelClass: 'padding16px',
      position: {
        top: '100px',
        right: '26px'
      }
    };
  }


  getWideScreenDialogConfig() {
    return {
      width: '80%',
      position: {
        bottom: '-28px'
      },
      panelClass: 'custom-dialog-container'
    };
  }

  return(){
    this.channelService.isSecondaryPanelVisible =false ;
    this.channelService.isMainChatVisible = false;
    this.channelService.isSidebarVisible = true;
  }

}
