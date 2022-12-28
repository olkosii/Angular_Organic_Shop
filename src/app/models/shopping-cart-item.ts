import { Product } from './product';

export class ShoppingCartItem{
    quantity!: number;
    key!:string;
    title!:string;
    imageUrl!:string;
    price!:number;
    category!:string;

    constructor(init?: Partial<ShoppingCartItem>){
        Object.assign(this,init);
    }
    get totalPrice(){
        return this.price * this.quantity;
    }
}