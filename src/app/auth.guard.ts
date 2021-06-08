import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    // Jos löytyy token , käyttäjä on kirjautunut.
    if (sessionStorage.getItem('accesstoken')) {
      return true;
    }

    // Ei Tokenia jolloin palataan aloitussivulle.
    this.router.navigate(['/kartta']);
    return false;
  }
}
