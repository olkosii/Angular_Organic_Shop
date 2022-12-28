import { Product } from './../../models/product';
import { ProductService } from 'src/app/services/product.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnDestroy {
  products:Product[] = [];
  filteredProducts:any[] = [];
  subscription: Subscription; 
  displayedColumns: string[] = ['title', 'price', 'edit'];
  dataSource = new MatTableDataSource<any[]>(this.filteredProducts);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private productService: ProductService) {
    this.subscription =  this.productService.getAll<Product>()
      .subscribe(products=>{
        this.filteredProducts = this.products = products;
        this.dataSource = new MatTableDataSource<any[]>(this.filteredProducts);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }); 
  } 

  filter(query:string){
    this.filteredProducts = (query) ?
      this.products.filter(product => product.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;

      this.dataSource = new MatTableDataSource<any[]>(this.filteredProducts);
      this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
