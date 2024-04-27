import { Injectable } from '@angular/core';
import { Firestore, collection, doc,serverTimestamp , collectionData,onSnapshot, addDoc,updateDoc,deleteDoc,docData  } from '@angular/fire/firestore';
import { getDocs, query,Query, DocumentData, where, getFirestore, FieldValue, setDoc, getDoc, increment, DocumentReference } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class EmojiBarService {

  constructor(
    public firestore: Firestore,
  ) { }

  showMainEmojiPicker = false;
  showSecondEmojiPicker = false;

    
  async updateMessageEmojis(messageRef:DocumentReference, emoji:any,  uid:string){
    try {
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        const messageData = messageSnap.data();
        let emojis = messageData['emojis'] || [];
        let emojiExists = emojis.find((e: { emoji: string; }) => e.emoji === emoji.emoji);
        if (emojiExists) {
          let updatedUids = emojiExists.uids.includes(uid) 
              ? emojiExists.uids.filter((u: string) => u !== uid) 
              : [...emojiExists.uids, uid];
  
          if (updatedUids.length === 0) {
            emojis = emojis.filter((e: { emoji: string; }) => e.emoji !== emoji.emoji);
          } else {
            emojiExists.uids = updatedUids;
            emojiExists.counter = updatedUids.length;
          }
        } else {
          const emojiId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          emojis.push({
            emoji: emoji,
            uids: [uid],
            counter: 1,
            id:emojiId
          });
        }
        await updateDoc(messageRef, { emojis: emojis }); 
      } else {}
    } catch (error) {}
  }



  async incrementEmojiCounterAndSaveUid(messageId: string, emojiId: string, userId: string, channelId: string) {
    const messageRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
    try {
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        const messageData = messageSnap.data();
        let emojis = messageData['emojis'] || [];
        let emojiIndex = emojis.findIndex((e: { id: string; }) => e.id === emojiId);
        if (emojiIndex !== -1) {
          let emojiData = emojis[emojiIndex];
          let uids = emojiData['uids'] || [];
          let counter = emojiData['counter'] || 0;
  
          if (uids.includes(userId)) {
            uids = uids.filter((uid: string) => uid !== userId);
            counter = Math.max(counter - 1, 0);
            if (counter === 0) {
              emojis.splice(emojiIndex, 1);
            } else {
              emojis[emojiIndex] = { ...emojiData, uids, counter };
            }
          } else {
            uids.push(userId);
            counter += 1;
            emojis[emojiIndex] = { ...emojiData, uids, counter };
          }
          await updateDoc(messageRef, { emojis: emojis });
        } else {}
      } else {}
    } catch (error) {}
  }

  // async incrementEmojiCounterAndSaveUid(messageId: string, emojiId: string, userId: string, channelId: string) {
  //   const messageRef = doc(this.firestore, `channel/${channelId}/messages/${messageId}`);
  //   try {
  //     const messageSnap = await getDoc(messageRef);
  //     if (messageSnap.exists()) {
  //       const messageData = messageSnap.data();
  //       let emojis = messageData['emojis'] || [];
  //       emojis = this.updateEmojiData(emojis, emojiId, userId); // Verwendung der Hilfsfunktion
  //       await updateDoc(messageRef, { emojis: emojis });
  //     }
  //   } catch (error) {}
  // }


  updateEmojiData(emojis: any[], emojiId: string, userId: string): any[] {
    let emojiIndex = emojis.findIndex((e: { id: string; }) => e.id === emojiId);
    if (emojiIndex !== -1) {
      let emojiData = emojis[emojiIndex];
      let uids = emojiData['uids'] || [];
      let counter = emojiData['counter'] || 0;

      if (uids.includes(userId)) {
        uids = uids.filter((uid: string) => uid !== userId);
        counter = Math.max(counter - 1, 0);
        emojiData = counter === 0 ? null : { ...emojiData, uids, counter };
      } else {
        uids.push(userId);
        counter += 1;
        emojiData = { ...emojiData, uids, counter };
      } 
      if (emojiData) {
        emojis[emojiIndex] = emojiData;
      } else {
        emojis.splice(emojiIndex, 1);
      }
    }
    return emojis;
  }   
  // updateEmojiData(emojis: any[], emojiId: string, userId: string): any[] {
  //   let emojiIndex = emojis.findIndex((e: { id: string; }) => e.id === emojiId);
  //   if (emojiIndex !== -1) {
  //     let emojiData = emojis[emojiIndex];
  //     let uids = emojiData['uids'] || [];

  //     if (uids.includes(userId)) {
  //       emojis = this.removeUserIdFromEmojis(emojis, emojiIndex, userId);
  //     } else {
  //       emojis = this.addUserIdToEmojis(emojis, emojiIndex, userId);
  //     }
  //   }
  //   return emojis;
  // }


  private removeUserIdFromEmojis(emojis: any[], emojiIndex: number, userId: string): any[] {
    let emojiData = emojis[emojiIndex];
    let uids = emojis[emojiIndex]['uids'] || [];
    let counter = emojis[emojiIndex]['counter'] || 0;
    uids = uids.filter((uid: string) => uid !== userId);
    counter = Math.max(counter - 1, 0);
    if (counter === 0) {
      emojis.splice(emojiIndex, 1);
    } else {
      emojis[emojiIndex] = { ...emojiData, uids, counter };
    }
    return emojis;
  }


  private addUserIdToEmojis(emojis: any[], emojiIndex: number, userId: string): any[] {
    let emojiData = emojis[emojiIndex];
    let uids = emojiData['uids'] || [];
    let counter = emojiData['counter'] || 0;
    uids.push(userId);
    counter += 1;
    emojis[emojiIndex] = { ...emojiData, uids, counter };
    return emojis;
  }


  async addEmojiToMessage(messageId: string, emoji: string, channelID: string, uid: string) {
    const messageRef = doc(this.firestore, `channel/${channelID}/messages/${messageId}`); 
    try {
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        const messageData = messageSnap.data();
        let emojis = messageData['emojis'] || [];
        let emojiExists = emojis.find((e: { emoji: string; }) => e.emoji === emoji);
        if (emojiExists) {
          let updatedUids = emojiExists.uids.includes(uid) 
              ? emojiExists.uids.filter((u: string) => u !== uid) 
              : [...emojiExists.uids, uid];
  
          if (updatedUids.length === 0) {
            emojis = emojis.filter((e: { emoji: string; }) => e.emoji !== emoji);
          } else {
            emojiExists.uids = updatedUids;
            emojiExists.counter = updatedUids.length;
          }
        } else {
          const emojiId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          emojis.push({
            emoji: emoji,
            uids: [uid],
            counter: 1,
            id:emojiId
          });
        } 
        await updateDoc(messageRef, { emojis: emojis });
      } else {}
    } catch (error) {
    }
  }


  async addEmojiToMessageSecond(secondChannelID: string, emoji: any, channelID: string, uid: string,messageId:string) {
    const messageRef = doc(this.firestore, `channel/${channelID}/messages/${messageId}/secondMessages/${secondChannelID}`); 
    try {
      const messageSnap = await getDoc(messageRef);
      if (messageSnap.exists()) {
        const messageData = messageSnap.data();
        let emojis = messageData['emojis'] || [];
        let emojiExists = emojis.find((e: { emoji: string; }) => e.emoji === emoji.emoji);
        if (emojiExists) {
          let updatedUids = emojiExists.uids.includes(uid) 
              ? emojiExists.uids.filter((u: string) => u !== uid) 
              : [...emojiExists.uids, uid];
  
          if (updatedUids.length === 0) {
            emojis = emojis.filter((e: { emoji: string; }) => e.emoji !== emoji.emoji);
          } else {
            emojiExists.uids = updatedUids;
            emojiExists.counter = updatedUids.length;
          }
        } else {
          const emojiId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          emojis.push({
            emoji: emoji,
            uids: [uid],
            counter: 1,
            id:emojiId
          });
        } 
        await updateDoc(messageRef, { emojis: emojis });
      } else {}
    } catch (error) {
    }
  }
}
