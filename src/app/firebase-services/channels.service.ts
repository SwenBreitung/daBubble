

import { Injectable,inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, } from '@angular/fire/firestore';
import {  onSnapshot, updateDoc,docData  } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Channel} from './../models/channel.class';



@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channel:Channel[]=[]
  private firestore: Firestore = inject(Firestore);
  private itemsSubject = new BehaviorSubject<Channel[]>([]);
  items$: Observable<Channel[]> = this.itemsSubject.asObservable();
  items:any;
  [key: string]: any;
  showChannels = true;
  isLeftWindowOpen:boolean = true;
  selectedChannelId: string | null = null;
  channels: Channel[] = [];
  currentSecondUser ='';
  users: any[] = [];
  showUsers = true;
  
  isScreenWide: boolean = true;
  isSidebarVisible = true;
  isMainChatVisible = false;
  isSecondaryPanelVisible = false;
  unsubList;
  constructor() {
    this.loadInitialData();
    this.unsubList = onSnapshot(this.getNodeshRef(), (list)=>{
      list.forEach(element =>{})
    });  
  }


  private loadInitialData() {
    const channelsRef = collection(this.firestore, 'channel');
    collectionData(channelsRef, { idField: 'id' }).pipe(
      map(channels => channels as Channel[])
    ).subscribe(channels => {
      this.itemsSubject.next(channels);
    });
    this.items$ = collectionData(this.getNodeshRef(), { idField: 'id' }) as Observable<Channel[]>;
    this.items$.subscribe(data => {
    });
    this.items = this.items$.subscribe((list)=>{
      list.forEach(element =>{
      })
    }); 
    this.items.unsubscribe();
  }


  async addChannel(userData: any) {
    try {
      const docRef = await addDoc(this.getNodeshRef(), userData);
    } catch (error) {
      throw error;
    }
  }


  getNodeshRef(){
    return   collection(this.firestore, 'channel');
  }

  

  getChannelNames(): Observable<string[]> {
    return this.items$.pipe(
      map(channels => channels.map(channel => channel.name))
    );
  }

 
  getChannelsRef() {
    return collection(this.firestore, 'channels');
  }


  async deleteChannel(channelId: string) {
    try {
      await deleteDoc(doc(this.firestore, 'channels', channelId));
      this.loadInitialData();
    } catch (error) {
      throw error;
    }
  }


  getChannelsName() {
    const usersRef = collection(this.firestore, 'channel');
    return collectionData(usersRef, { idField: 'id' }) as Observable<Channel[]>;
  }

 
  getChannels(): Observable<Channel[]> {
  return this.items$.pipe(
    map(channels => channels as Channel[])
  );} 


  updateChannelProperties(channelId: string, fieldName: string, newValue: string) {
    const channelRef = doc(collection(this.firestore, 'channel'), channelId);
    const updates = { [fieldName]: newValue };
    updateDoc(channelRef, updates)
      .then(() => {})
      .catch((error) => {});
  }
}