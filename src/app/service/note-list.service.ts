import { Injectable,inject, } from '@angular/core';
import { Firestore, collection, doc, collectionData,onSnapshot, addDoc,updateDoc,deleteDoc,docData, setDoc, getDocs, increment  } from '@angular/fire/firestore';
import { Observable,catchError,firstValueFrom, of, pipe } from 'rxjs';
import { User} from '../models/user.class'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString, StorageReference, uploadBytes } from 'firebase/storage';


@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  getUid() {
    throw new Error('Method not implemented.');
  }

  users:User[]=[];
  uid:string='';

  firestore: Firestore = inject(Firestore);


  items$: Observable<User[]>;
  items;
  unsubList;
  unsubSingle;
  public storage = getStorage();
  constructor() { 
    this.unsubList = onSnapshot(this.getNodeshRef(), (list)=>{
      list.forEach(element =>{
      })
    });



    this.unsubSingle = onSnapshot(this.getSingleDoc("user","id38934834"), (element)=>{
    });

    this.items$ = collectionData(this.getNodeshRef(), { idField: 'id' }) as Observable<User[]>;

    this.items$.subscribe(data => {});

    this.items = this.items$.subscribe((list)=>{
      list.forEach(element =>{})
    }); 
    this.items.unsubscribe();
  }

  
  async addUser(userData: any, uid: string,) {
    try {
      const userDocRef = doc(this.getNodeshRef(), uid);
      await setDoc(userDocRef, userData); 
    } catch (error) {
      throw error;
    }
  }
  

  ngOnDestroy() {
    this.unsubList();
    this.unsubSingle();
  }


  getUsersData() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  
  getColIdFromNote(note:User){
     if (note.type == 'user') {
      return 'nodes';
    }else{
      return 'trash';
    }
  }

   
  getNodeshRef(){
    return   collection(this.firestore, 'users');
  }
   
     
  getSingleDoc(colID:string,docID:string){
    return  doc(collection(this.firestore,colID),docID);
  } 


  getUserDetails(userId: string): Observable<User> {
    const docRef = this.getSingleDoc('users', userId);
    return docData(docRef) as Observable<User>;
  }


  uploadFileAndGetURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadObservable = this.uploadFileForChatting(file, 'IhrChatIdHier');
      const subscription = uploadObservable.subscribe({
        next: (progressOrUrl) => {
          if (typeof progressOrUrl === 'string') { 
            resolve(progressOrUrl); 
            subscription.unsubscribe(); 
          } else {}
        },
        error: (error) => {
          reject(error); 
          subscription.unsubscribe(); 
        }
      });
    });
  }

  uploadFile(file: File): Observable<string> {
    const fileExtension = file.name.split('.').pop();
    const filePath = `${this.uid}/profilImg.${fileExtension}`;
    const storageRef = ref(this.storage, filePath); 
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Observable(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {}, 
        (error) => {
          observer.error(error); 
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            observer.next(downloadURL);
            observer.complete(); 
          });
        }
      );
    }); 
  }


  async updateObjectField( uid: string, fieldName: string, newValue: string,channelName:string): Promise<void> {
    const objektRef = doc(this.firestore, `${channelName}/${uid}`);
    try {
      await updateDoc(objektRef, {
        [fieldName]: newValue 
      });
    } catch (error) {
    }
  }


  uploadFileForChatting(file: File, chatId: string): Observable<string> {
    const filePath = `${chatId}/${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Observable(observer => {
      uploadTask.on('state_changed',
       (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(`${progress.toFixed(2)}%`);
        }, 
        (error) => {
          observer.error(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            observer.next(downloadURL); // Download-URL zurückgeben
            observer.complete();
          });
        }
      );
    });
  }


  async getProfileImageUrl(uid: string): Promise<string> {
    const storage = getStorage();
    const user = await firstValueFrom(this.getUserDetails(uid));
    let imagePath: string;
    if (typeof user.img === 'string' && user.img.trim() !== '') {
      imagePath = user.img; 
    } else {
      imagePath = 'path/to/default/profilImg.svg';
    }
    const storageRef = ref(storage, imagePath);
    return getDownloadURL(storageRef);
  }


  async uploadImage() {
    try {
      const storage = getStorage(); 
      const imageRef = ref(storage, 'profilImg.svg'); 
      const response = await fetch('./../../assets/user_avatars/neutral-avatar.svg');
      const blob = await response.blob();
      const result = await uploadBytes(imageRef, blob);
    } catch (error) {
    }
  }
  
}
