// Tässä on katsottu mallia Tommi Tuikan pitämän kurssin koodista.

import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { RegsService } from '../regs.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnDestroy {
  login: boolean;
  subscription: Subscription; // Subscription -tyyppiseen olioon voidaan tallentaa observablen tilaus.

  constructor(
    public authService: AuthService,
    public canshow: AuthService, // tämä kertoo, onko käyttäjä hakenut jo sijaintitiedot.
    public _regservice: RegsService // otetaan käyttöön RegsService, jotta templaattiin voidaan hakea regtext-arvo.
  ) {
    // Tilataan viesti ja tallennetaan tulos this.login -muuttujaan
    this.subscription = this.authService.loginTrue().subscribe((message) => {
      this.login = message;
    });

    const atoken = sessionStorage.getItem('accesstoken');
    if (atoken) {
      this.login = true;
    } else {
      this.login = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  doLogout() {
    this.login = false; // päivitetään login-muuttujan arvo falseksi Logoutin yhteydessä. Tätä hyödynnettään mm. Navbarissa
    this.authService.logout(); // tyhjennetään Logoutin yhteydessä sessionStorage (token pois)
  }
}
