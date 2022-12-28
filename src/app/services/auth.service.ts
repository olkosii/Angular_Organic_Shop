import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
 
import firebase from 'firebase/compat/app';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from './../models/app-user';
import { map,switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;
  
  constructor(private afAuth:AngularFireAuth,private route:ActivatedRoute,private userService:UserService ) {
    this.user$ = afAuth.authState;
  }

  login(){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl',returnUrl);

    this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
  }

  logout(){
    this.afAuth.signOut();
  }

  get appUser$(): Observable<AppUser>{
    return this.user$.pipe(
      switchMap(user => {
        if(user)
          return this.userService.get((<any>user).uid).valueChanges()

        return of(null);
      })).pipe(
      map(user=> <AppUser>user)
    )
  }
}
