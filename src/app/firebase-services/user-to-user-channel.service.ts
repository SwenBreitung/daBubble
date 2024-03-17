import { Injectable } from '@angular/core';
import { Firestore, collection, doc,serverTimestamp , collectionData,onSnapshot, addDoc,updateDoc,deleteDoc,docData  } from '@angular/fire/firestore';
import { getDocs, query,Query, DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';