import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  categories$;
  product:any = {};
  id:string | null;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private categoryService:CategoryService,
    private productService:ProductService) 
    { 
    this.categories$ = categoryService.getCategories();

    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id)
      
      this.productService.get(this.id).valueChanges().pipe(
        take(1)).subscribe((p:any)=>{
        this.product = p;
      });
  }

  save(product:any){
    if(this.id)
      this.productService.update(this.id,this.product);
    else
      this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  delete(){
    if(confirm('Are you sure you want to delete this product?')){
      if(this.id)
        this.productService.delete(this.id);
        this.router.navigate(['/admin/products']);
    }
  }

  ngOnInit(): void {
  }

}
