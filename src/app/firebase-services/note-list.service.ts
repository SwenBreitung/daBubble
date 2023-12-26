import { Injectable,inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData,onSnapshot } from '@angular/fire/firestore';
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

    
}

ngOnDestroy(){
  this.unsubList;
  this.unsubSingle;
  this.items.unsubscribe();
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


}
