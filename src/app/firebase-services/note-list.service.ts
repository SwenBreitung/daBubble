import { Injectable,inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData,onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class NoteListService {
  tashNotes:Note[]=[]
  normalNotes:Note[]=[]

  firestore: Firestore = inject(Firestore);

   items$: Observable<Note[]>;
   items;


  unsubList;
  unsubSingle;


  constructor() { 
    this.unsubList = onSnapshot(this.getNodeshRef(), (list)=>{
      list.forEach(element =>{
        console.log('foreach',element)
      })
    });
    
    
    this.unsubSingle = onSnapshot(this.getSingleDoc("node","id38934834"), (element)=>{
    });
    
    
    this.items$ = collectionData(this.getNodeshRef(), { idField: 'id' }) as Observable<Note[]>;
    this.items$.subscribe(data => {
      console.log('Daten aus Firebase:', data);
    });
    this.items = this.items$.subscribe((list)=>{
      list.forEach(element =>{
        console.log('foreach',element)
      })
    }); 
    this.items.unsubscribe();
  }

  ngOnDestroy(){
    this.unsubList;
    // this.unsubSingle;

  }


  getNodeshRef(){
    return   collection(this.firestore, 'nodes');
  }


  getTrashRef(){
    return collection(this.firestore, 'trash');
  }
    
  
  getSingleDoc(colID:string,docID:string){
    return  doc(collection(this.firestore,colID),docID);
  } 

async addNote(item:{}){
  await addDoc(this.getNodeshRef(),item ).catch(
    (err)=>{console.error(err)}
  ).then(
    (docRef)=>{console.log("Document written with ID: ", docRef?.id)}
  )
}

}
