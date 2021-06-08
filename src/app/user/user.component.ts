// Tämä on kokonaan omaa koodiani.

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { freeApiService } from '../services/freeapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  respond: any;
  constructor(
    public _authservice: AuthService,
    public _freeapiservices: freeApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  delete(username) {
    this._authservice.deleteUser(username).subscribe((data) => {
      this.respond = data;

      if ((this.respond.ok = '1')) {
        // jos poisto onnistuu mennään if-silmukkaan.

        this._authservice.logout(); // poistetaan mm. token.
        this._authservice.loginFalse(); // navbaar muuttuu ei-sisäänkirjautumis-tilaan.
        // this._authservice.deluser = true; // muuttujan arvo alustetaan trueksi, jotta navbar-näkymä saadaan oikeaksi.
        this.router.navigate(['./kartta']); // käyttäjä siirretään aloitussivulle.
      } else {
        console.log('Tunnuksen poistaminen epäonnistui'); // Jos tunnuksen poistaminen epäonnistuu, kirjoitetaan konsoleen virheviesti.
      }
    });
  }
}
