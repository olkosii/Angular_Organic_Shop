import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService:UserService,private auth:AuthService, router:Router){
    auth.user$.subscribe(user=>{
      if(!user) return;

      this.userService.save(user);

      let returnUrl = localStorage.getItem('returnUrl');
      if(!returnUrl) return;

      localStorage.removeItem('returnUrl')
      router.navigate([returnUrl]);
      
    })
  }
}
