import { Observable } from 'rxjs';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from './../models/shopping-cart';

@Component({
  selector: 'app-check-out-page',
  templateUrl: './check-out-page.component.html',
  styleUrls: ['./check-out-page.component.scss']
})
export class CheckOutPageComponent implements OnInit{

  cart$!: Observable<ShoppingCart>;
  constructor(private shoppingCartService: ShoppingCartService){}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
  }
}
