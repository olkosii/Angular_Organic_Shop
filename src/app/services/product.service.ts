import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { map} from 'rxjs';
import { Product } from './../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db:AngularFireDatabase) { }

  create(product:any){
    return this.db.list('/products').push(product);
  }

  getAll<T>() {
    return this.db.list<T>('/products').snapshotChanges().pipe(
      map(a =>
        a.map( p => {
            const value = <any>Object.assign({}, p.payload.val());
            value.key = p.key;
            return <T>value;
          }
      ))
    );
  } 

  get(productId : string){
    return this.db.object('/products/' + productId);
  }

  update(productId:string, product:any){
    return this.db.object('/products/'+productId).update(product);
  }

  delete(productId: string){
    return this.db.object('/products/' + productId).remove();
  }
}
