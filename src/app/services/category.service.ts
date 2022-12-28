import { Category } from './../models/categories';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db:AngularFireDatabase) { }

  getCategories(){
    return this.db.list('/categories',fun=>fun.orderByChild('name'))
    .snapshotChanges().pipe(
      map( c => 
        c.map(p => {
        const value = <any>Object.assign({}, p.payload.val());
        value.key = p.key;
        return <Category>value;
      }))
    )
  }
}
