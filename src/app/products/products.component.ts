import { ShoppingCartService } from './../services/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from './../models/product';
import { switchMap, Subscription, Observable } from 'rxjs';
import { ShoppingCart } from './../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string | null = '';
  cart$!: Observable<ShoppingCart>;

  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    private shoppingCartService:ShoppingCartService 
    ) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private populateProducts(){
    this.productService
    .getAll<Product>()
    .pipe(
      switchMap(products => {
        this.products = products;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
    })
  }

  private applyFilter(){
    this.filteredProducts = this.category ?
        this.products.filter(product => product.category === this.category) : this.products;
  }
}
