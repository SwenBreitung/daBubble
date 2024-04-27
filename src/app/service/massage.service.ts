import { Injectable } from '@angular/core';
import { Firestore, collection, doc,serverTimestamp , collectionData,onSnapshot, addDoc,updateDoc,deleteDoc,docData  } from '@angular/fire/firestore';
import { getDocs, query,Query, DocumentData, where, getFirestore, FieldValue, setDoc, getDoc, increment, DocumentReference } from 'firebase/firestore';
import { BehaviorSubject, Observable, Subject, Subscription, from, map, switchMap, take, takeUntil } from 'rxjs';
import { User } from '../models/user.class';
import { AuthService } from './auth.service';
import {NoteListService} from './note-list.service';


@Injectable({
  providedIn: 'root'
})

export class MessageService {
  public isPrivateChatMode = false;
  public secondMessages$: Observable<any[]>; 
  public  messages: any[] = [];
  public secondMessages: any[] = [];
  private currentMessagesSource = new BehaviorSubject<any[]>([]);
  currentMessages$ = this.currentMessagesSource.asObservable();
  public showPlaceholder = true;
  public secondMessagesSource = new BehaviorSubject<any[]>([]);
  currentsecondMessages$ = this.secondMessagesSource.asObservable();
  currentSecondChannel:string = '';
  currentChannelId: string  ='';
  switchSecondChatFunktion=true;
  torgleRightSide =false;
  secondChatHeader = '';

  channelInfos:any;
  sourceType:string='';
  channel:any='';
  messageSubscription: any;  
  private subscription = new Subscription();

  constructor(
    public firestore: Firestore,
    public noteService: NoteListService,
    public authService:AuthService,
  ) {
    this.secondMessages$ = this.getSecondMessagesObservable();
  }
    

  ngOnDestroy() {
    this.subscription.unsubscribe();  
  }


  public getSecondMessagesObservable(): Observable<any[]> {
    const secondMessagesCollection = collection(this.firestore, 'secondMessages'); // oder eine Abfrage
    return collectionData(secondMessagesCollection, { idField: 'id' }) as Observable<any[]>;
  }


  async getDocumentsFromQuery(q: Query<DocumentData>) {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  }


  getMessages(...pathSegments: string[]): Observable<any[]> {
  const messagesQuery = query(collection(this.firestore, pathSegments.join('/')));
  return collectionData(messagesQuery, { idField: 'id' });
  }

  getMessagesForSecondMessage(channelId: string): Observable<any[]> {
    return this.getMessages('privateChannel', channelId, 'messages');
  }


  getMessagesForSecondTextMessage(channelId: string): Observable<any[]> {
    return this.getMessages('channel', channelId, 'messages', 'secondtextchannel');
    
  }

  
  getMessagesMessageInSecondChannel(mainChannelId:string,secondChannelId: string): Observable<any[]> {
    return this.getMessages('channel', mainChannelId, 'messages', secondChannelId, 'secondMessages');
  }


  getMessagesFromUser(uid: string): Observable<any[]> {
    return this.getMessages('users', uid, 'messages');
  }


  async checkForExistingChannel(currentUser: string, otherUserId: string) {
    const channelsRef = doc(this.firestore, 'users', currentUser);
    const messageRef = collection(channelsRef, 'privateMessage');
    const q = query(messageRef, where('participantIds', 'array-contains', currentUser));
    const querySnapshot = await getDocs(q); 
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const participantIds = data['participantIds'];
      if (participantIds && participantIds.includes(otherUserId)) {
        return doc.id;
      }
    }
    return this.createChannel(currentUser, otherUserId);
  }
  

  getCurrentTimestampAsString(): string {
    const now = new Date(); 
    return now.toISOString();
  }


  async createChannelDocument(user1Id: string, user2Id: string): Promise<string> {
    const channelData = {
      userIds: [user1Id, user2Id],
      createdAt: serverTimestamp(),
      name: '',
      information: '',
      type: 'private'
    };
    const channelRef = await addDoc(collection(this.firestore, 'PrivateChannels'), channelData);
    return channelRef.id;
  }


  async updateUserDocument( userId: string, channelId: string, participantIds: string[]): Promise<void> {
    const messageData = {
      channelId: channelId,
      participantIds: participantIds
    };
    const userRef = doc(this.firestore, 'users', userId, 'privateMessage', channelId);
    await setDoc(userRef, messageData);
  }


  async createChannel(user1Id: string, user2Id: string): Promise<string> {
    const firestore = getFirestore();
    const channelId = await this.createChannelDocument( user1Id, user2Id);
    await this.updateUserDocument( user1Id, channelId, [user1Id, user2Id]);
    await this.updateUserDocument( user2Id, channelId, [user1Id, user2Id]);
    return channelId;
  }


  async addMessage(channelId: string, messageText: string, userName:string, imagePath:string, userUid:string, userImg:string | File): Promise<void> {
    try {
      const messagesRef = collection(this.firestore, `channel/${channelId}/messages`);
      await addDoc(messagesRef, {
        userName:userName,
        text: messageText,
        createdAt: serverTimestamp(), 
        type:'channel',
        img: imagePath,
        secondMessageCounter:0,
        userUid: userUid,
        userImg:userImg
      });
    }catch{}
  }


  async addMessageSecond(channelId: string, messageText: string, userName:string): Promise<void> {
    try {
      const messagesRef = collection(this.firestore, `privateChannel/${channelId}/messages`);
      await addDoc(messagesRef, {
        userName:userName,
        text: messageText,
        createdAt: serverTimestamp(),
        type:'privateMassage' 
      });
    }catch{}
  }


  async addMessageSecondFromChannel(channelId: string, messageText: string, userName:string,secondChannel:string): Promise<void> {
    try {
    const messagesRef = collection(this.firestore, `channel/${channelId}/messages/${secondChannel}/secondMessages`);
    await addDoc(messagesRef, {
      userName:userName,
      text: messageText,
      createdAt: serverTimestamp(),
      type:'channelSecondMessage' 
    });
    }catch{}
  }
  

  searchUserByName(name: string): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('name', '==', name));
    return from(getDocs(q).then(querySnapshot => {
      return querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as unknown as User;
      });
    }));
  }

  
  getDocumentReference(firestore:Firestore, pfad:string) {
    return doc(firestore, pfad);
  }



  async searchChannels(searchTerm: string) {
    const channelsRef = collection(this.firestore, 'channel'); 
    const searchQuery = query(channelsRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    try {
      const querySnapshot = await getDocs(searchQuery);
      const channels: { id: string; }[] = [];
      querySnapshot.forEach((doc) => {
        channels.push({ id: doc.id, ...doc.data() });
      });
      return channels; 
    } catch (error) {
      throw error;
    }
  }


  async searchUsers(searchTerm: string) {
    const channelsRef = collection(this.firestore, 'users'); // Angenommen, Ihre Channels sind in der Sammlung 'channels' gespeichert
    const searchQuery = query(channelsRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    try {
      const querySnapshot = await getDocs(searchQuery);
      const channels: { id: string; }[] = [];
      querySnapshot.forEach((doc) => {
      channels.push({ id: doc.id, ...doc.data() });
    });
    return channels; 
    } catch (error) {
        throw error;
    }
  }


  async getAllChannelIds() {
    const channelsRef = collection(this.firestore, 'channel');
    const snapshot = await getDocs(channelsRef);
    return snapshot.docs.map(doc => doc.id);
  }


  async searchMessagesInChannel(channelId:string, searchTerm:string) {
    const messagesRef = collection(this.firestore, `channel/${channelId}/messages`);
    const messagesQuery = query(messagesRef, where('text', '>=', searchTerm), where('text', '<=', searchTerm + '\uf8ff'));
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }


  async searchMessagesInAllChannels(searchTerm:string) {
    const allMessages = [];
    const channelIds = await this.getAllChannelIds();
    for (const channelId of channelIds) {
      const messages = await this.searchMessagesInChannel(channelId, searchTerm);
      if (messages.length > 0) {
        allMessages.push({ channelId, messages });
      }
    }
    return allMessages;
  }


  sendChannelMessage(messageText: string, switchSecondChatFunktion: boolean, currentSecondChannel: string): void {
    if (switchSecondChatFunktion) {
      this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
        take(1),
        switchMap(user => {
          return this.addMessageSecondFromChannel(this.currentChannelId, messageText, user.name, currentSecondChannel);
        }),
        switchMap(() => {
          return this.incrementSecondMessageCount(this.currentChannelId, currentSecondChannel);
        })
      )
      .subscribe({
        next: () => {},
      });
    }
  }


  sendPrivateMessage(messageText: string, privateChannelId: string): void {
    this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
      take(1),
      switchMap(user => {  
      return this.addMessageSecond(privateChannelId, messageText, user.name);
    }),
      switchMap(() => {
        return this.incrementSecondMessageCount(this.currentChannelId, privateChannelId);
      })
  )
  .subscribe({
      next: () => {},
    });
  }


  saveMessage(messageText: string,currentChannelId:string, imfPfad:string) {
    if( !this.isPrivateChatMode){
      this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
        take(1),
        switchMap(user => {
        return this.addMessage(currentChannelId as string, messageText, user.name,imfPfad,user.uid,user.img);
      })
    )
    .subscribe({
      next: () => {},
    });  
  }
  else if(this.isPrivateChatMode){
    this.noteService.getUserDetails(this.authService.currentUser.uid).pipe(
      take(1),
      switchMap(user => {
        return this.addMessageSecond(currentChannelId as string, messageText, user.name);
      })
      ).subscribe({
          next: () => {},
      });
    }    
  }
  

  loadMessagesForChannel(sourceType: 'channel' | 'chat', sourceId: string) {
    let basePath = '';
    if (sourceType === 'channel') {
        this.isPrivateChatMode = false;
        basePath = `channel/${sourceId}/messages`;
    } else if (sourceType === 'chat') {
        this.isPrivateChatMode = true;
        basePath = `privateChannel/${sourceId}/messages`;
    }
    const messagesRef = collection(this.firestore, basePath);
    collectionData(messagesRef, { idField: 'id' }).pipe(
      map(messages => messages.sort((a: any, b: any) => {
        const dateA = a.createdAt && a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000).getTime() : 0;
        const dateB = b.createdAt && b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000).getTime() : 0;
        return dateA - dateB;
      }))
    ).subscribe(
      sortedMessages => {
        try {
          this.currentMessagesSource.next(sortedMessages);
        } catch (error) {
          console.error('Fehler beim Weiterleiten der sortierten Nachrichten:', error);
          this.currentMessagesSource.next([]); // Senden einer leeren Liste als Fallback
        }
      },
      error => {
        console.error('Fehler beim Laden der Nachrichten:', error);
        this.currentMessagesSource.next([]); // Senden einer leeren Liste als Fallback
      }
    );
  }


  loadMassgesFromChannelInSecondChannel(channel:any,) {
    this.currentSecondChannel = channel.id;
    this.switchSecondChatFunktion = true;
    this.messageSubscription = this.getMessagesMessageInSecondChannel(this.currentChannelId,channel.id).subscribe((secondMessages: { createdAt: { seconds: number; } | { seconds: number; }; }[]) => {
      const sortedMessages = secondMessages.sort((a, b) => {
        const secondsA = a.createdAt?.seconds ?? 0;
        const secondsB = b.createdAt?.seconds ?? 0;
        return secondsA - secondsB;
      });
    this.secondMessages = secondMessages;
    this.secondMessagesSource.next(secondMessages);
    });
  }


  async incrementSecondMessageCount(channelId: string, messageId: string): Promise<void> {
    const messageRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
    try {
      await updateDoc(messageRef, {
        secondMessageCounter: increment(1)
      });
    } catch (error) {
      throw new Error('Failed to increment second message counter.');
    }
  }


  async switchText(channelId: string, messageId: string,switchText:string): Promise<void> {
    const messageRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
    try {
      await updateDoc(messageRef, {
        text: switchText
      });
    } catch (error) {
      throw new Error('Failed to increment second message counter.');
    }
  }


  async switchTextSecond(channelId: string, secondChannelID: string, switchText: string,messageId: string): Promise<void> {
    const messageRefTarget = doc(this.firestore, `channel/${channelId}/messages/${messageId}/secondMessages/${secondChannelID}`);
    try {
      await updateDoc(messageRefTarget, {
        text: switchText
      });
    } catch (error) {
      throw new Error('Fehler beim Aktualisieren der Nachricht.');
    }
  }


  resetSecondChatHeader(){
    this.secondChatHeader ='';
    this.messages =[];
    this.secondMessages =[];
    this.torgleRightSide = false;
  }

}
