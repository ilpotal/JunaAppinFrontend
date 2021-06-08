import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/*
Jos canActivate -metodi palauttaa truen, pääsee reitille.

*/

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  // tieto siitä, onko käyttäjä hakenut sijaintinsa Map-komponentissa, jonka jälkeen käyttäjä voidaan päästää Juna-komponenttiin.

  constructor(private canshow: AuthService, private router: Router) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.maybeCanShow();
  }

  private maybeCanShow(): boolean {
    if (this.canshow.canshow) {
      // Onko käyttäjä hakenut jo sijantinsa.
      // voiko päästää Juna-komponenttiin
      return true;
    } else {
      this.router.navigate(['./kartta']); // Ei ole hakenut vielä sijanitiaan, joten palataan aloitussivulle.
      //console.log('arvo ' + this.canshow.canshow);
      return false;
    }
  }
}
