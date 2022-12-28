import { ShoppingCart } from './../models/shopping-cart';
import { Product } from './../models/product';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { map,Observable,take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) 
  { }

  async getCart(): Promise<Observable<ShoppingCart>>{
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).snapshotChanges().pipe(
      map((result:any) => {
        let key = result.key;
        let items = key ? result.payload.val().items : {}; 
        return new ShoppingCart(items);
      }));
  }

  async removeFromCart(product: Product){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$.snapshotChanges().pipe(take(1)).subscribe((item:any) => {
      let quantity = item.payload.val().quantity - 1;
      if(quantity === 0)
        item$.remove();
      else{
        if(item.payload.val())
          item$.update({ quantity: quantity })
      }
    })
  }

  async addToCart(product: Product){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$.snapshotChanges().pipe(take(1)).subscribe((item:any) => {
      if(item.payload.val())
        item$.update({ quantity:item.payload.val().quantity + 1 })
      else
        item$.set({ 
          title:product.title, 
          price:product.price,
          imageUrl:product.imageUrl,
          quantity:1
        })
    })
  }

  async clearCart(){
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  private getItem(cartId: string, productId: string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(){
    let cartId = localStorage.getItem('cartId');

    if(cartId)
      return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key ? result.key : '');
    return result.key ? result.key : '';
  }
}
