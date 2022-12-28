import { ShoppingCart } from './..//models/shopping-cart';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from './..//models/order';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss']
})
export class ShippingFormComponent implements OnInit,OnDestroy {
  @Input('cart') cart!: ShoppingCart;
  shipping = <any>{};
  userId!: string | undefined;
  userSubscription!: Subscription;

  constructor(private router: Router,
    private authService:AuthService,
    private orderService:OrderService){}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user?.uid);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart)
    let result = await this.orderService.storeOrder(order);
    this.router.navigate(['/order-success', result.key])
  }  
}
