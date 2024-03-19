import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ChannelService} from './../firebase-services/channels.service';
import {NoteListService} from './../firebase-services/note-list.service';
import {MessageService} from './../firebase-services/massage.service';
import { User} from '../models/user.class'
import { Subscription} from 'rxjs';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { DragAndDropService } from '../firebase-services/drag-drop.service';
import { UserActionsDialogComponent } from './user-actions-dialog/user-actions-dialog.component';



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
    }
  }
  
  isUserAndCurrentUserNull(user:any){
    return !user && !this.authService.currentUser
  }


  isUserNotNull(user:any){
    return user != null && user.uid !== null;
  }


  loadUserDatas(){
    this.noteService.getUsersData().subscribe(users => {
      this.channelService.users = users;
    });
  }
 

  loadDataFromLocal(){
    const userString = localStorage.getItem('dabuble/username');
    return userString;
  }


  loadUserdata(){
    const authUser = this.authService.getCurrentUser();
  }


  // chatWithUser(userID: string,user: any){
  //   console.log('userID',userID, ':user',user)
  // }
  

  toggleElement(propertyName: string) {
    this.channelService[propertyName] = !this.channelService[propertyName];
  }


  toggleEmojiPicker(pickerType:any) {
    if (pickerType === 'main') {
      this.showMainEmojiPicker = !this.showMainEmojiPicker;
    } else if (pickerType === 'second') {
      this.showSecondEmojiPicker = !this.showSecondEmojiPicker;
    }
  }


  toggleEmojiPickerForTextMassage(messageId: string){
    if (this.activeEmojiPickerId === messageId) {
      this.activeEmojiPickerId = null;
    } else { 
      this.activeEmojiPickerId = messageId;
    }
  }


  onEmojiSelect(event: any) {}
  

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


  // async loadMassgesInTextChannel(sourceType:string,channel: any) {
  //   this.channelService.selectedChannelId = channel.id;
  //   this.messageService.secondChatHeader = channel.name;
  //   this.messageService.channelInfos = channel;
  //   if (this.messageSubscription) {
  //     this.messageSubscription.unsubscribe();
  //   }  
  //   this.messageService.currentChannelId = channel.id;
  //   this.messageService.loadMessagesForChannel(sourceType as 'channel' | 'chat',channel.id);
  //   this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
  //     this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
  //   });
  //   this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(this.messageService.currentChannelId, channel.id).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
  //     this.secondMessages = secondMessages;
  //     this.messageService. secondMessagesSource.next(secondMessages);
  //   });
  //   this.searchResults = []; 
  // }
  async loadMassgesInTextChannel(sourceType: string, channel: any) {
    this.setChannelInformation(channel);
    this.unsubscribeOldMessages();
    this.loadMessagesForCurrentChannel(sourceType, channel.id);
    this.subscribeToChannelMessages();
    this.subscribeToSecondChannelMessages(channel.id);
    this.searchResults = [];
  }

  setChannelInformation(channel: any) {
    this.channelService.selectedChannelId = channel.id;
    this.messageService.secondChatHeader = channel.name;
    this.messageService.channelInfos = channel;
  }

  unsubscribeOldMessages() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  loadMessagesForCurrentChannel(sourceType: string, channelId: string) {
    this.messageService.currentChannelId = channelId;
    this.messageService.loadMessagesForChannel(sourceType as 'channel' | 'chat', channelId);
  }

  subscribeToChannelMessages() {
    this.messageSubscription = this.messageService.currentMessages$.subscribe(messages => {
      this.messageService.messages = messages.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
    });
  }

  subscribeToSecondChannelMessages(channelId: string) {
    this.messageSubscription = this.messageService.getMessagesMessageInSecondChannel(this.messageService.currentChannelId, channelId).subscribe((secondMessages: { createdAt: { seconds: number; } }[]) => {
      this.secondMessages = secondMessages;
      this.messageService.secondMessagesSource.next(secondMessages);
    });
  }


  // loadMassgesInSecondChannel(uid: string, user: string) {
  //   this.channelService.selectedChannelId = uid;
  //   this.messageService.switchSecondChatFunktion = false;
  //   console.log(uid,this.channelService.selectedChannelId);
  //   this.channelService.currentSecondUser = uid;
  //   this.messageService.checkForExistingChannel(uid, this.authService.currentUser.uid).then(channelId => {
  //     this.messageService.currentChannelId = channelId;
  //     this.messageService.loadMessagesForChannel('chat',channelId );
  //   }); 
  // }
 

  // saveSecondMessage(messageText: string) {
  //   if(!this.messageService.switchSecondChatFunktion){
  //     if (this.privateChannelId) {
  //       this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
  //         switchMap(user => {
  //           console.log('testname', user.name); 
  //           return this.messageService.addMessageSecond(this.privateChannelId as string, messageText, user.name);
  //         })
  //       ).subscribe({
  //         next: () => { 
  //         },
  //         error: (error) => console.error('Fehler beim Senden der Nachricht', error)
  //       });
  //     } else {
  //       console.log('Kein Channel ausgewählt');
  //     }
  //   }else if(this.messageService.switchSecondChatFunktion){    
  //     this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
  //       switchMap(user => {
  //         return this.messageService.addMessageSecondFromChannel(this.messageService.currentChannelId as string, messageText, user.name,this.currentSecondChannel);
  //       })
  //     ).subscribe({
  //       next: () => {},
  //       error: (error) => console.error('Fehler beim Senden der Nachricht', error)
  //     });
  //   } 
  // }


  // logMessageUser(messageUser: any, message:string) {
  //   console.log('Message User:', messageUser, message);
  //   console.log('Current User:', this.authService.currentUser);
  // }


  incrementEmojiCounterAndSaveUid(emoji:string, currentUser:string, message:string, currentChannelId:string){
    this.messageService.incrementEmojiCounterAndSaveUid(message, emoji, currentUser,  currentChannelId)
  }


  async onInputChange(event: Event, number:number): Promise<void> {
    if (event.target instanceof HTMLInputElement) {
      const input = event.target;
      const inputValue = input.value;
      if (inputValue.length === 0) {
        if(1== number){
          this.searchResults = []; 
        }else{
          this.searchResultsMain = [];       
        }     
      } else {
         await this.search(inputValue, number);
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
      if(number == 1){
        this.searchResults = channels;
      }else{
        this.searchResultsMain = channels;
      }
    })
    .catch(error => {});
  }


  resetSecondChatHeader(){
    this.messageService.resetSecondChatHeader();
  }


  searchUsers(searchTerm: string,number:number) {
  this.messageService.searchUsers(searchTerm)
    .then(channels => {
      if(number == 1){
        this.searchResults = channels;
      }else{
        this.searchResultsMain = channels;
      }
    })
    .catch(error => {});
  }

  
  async searchText(searchTerm: string) {
    return [];
  }


  toggleLeftWindow(){
    this.channelService.isLeftWindowOpen = !this.channelService.isLeftWindowOpen;
    this.isMenuOpen = !this.isMenuOpen;
  }


  async imfpfad() {
    const chatID =  this.noteService.uid; 
    if (this.dragAndDropService && this.dragAndDropService.fileName) {
      const fileNameParts = this.dragAndDropService.fileName.split('.');
      if (fileNameParts.length > 1) {
        const fileExtension = fileNameParts.pop();
        const imagePath = `${chatID}/this.dragAndDropService.fileName`;
        return imagePath;
      } else {
        return 'defaultImagePath';
      }
    } else {
      return 'defaultImagePath';
    }
  }


  openDialogChat() {
    let dialogConfig;
    if (this.channelService.isScreenWide) {
      dialogConfig = this.getDialogConfig();
    }
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
