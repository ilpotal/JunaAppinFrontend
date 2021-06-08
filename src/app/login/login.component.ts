// Tässä on katsottu mallia Tommi Tuikan pitämän kurssin koodista.

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegsService } from '../regs.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  error = '';
  // otetaan router, authService sekä _regservice käyttöön. IT
  constructor(
    private router: Router,
    private authService: AuthService,
    public _regservice: RegsService
  ) {}

  ngOnInit() {
    // Aina kun login-komponentti ladataan, poistetaan token. IT
    this.authService.logout();
    this._regservice.regtext = false; // Tässä asetetaan regtextin arvo falseksi, jotta Nyt voit kirjautua tästä -teksti poistuu. IT
  }

  // lomakkeen lähetys

  onSubmit(formData) {
    this.authService
      .login(formData.tunnus, formData.salasana)
      .subscribe((result) => {
        if (result === true) {
          this.router.navigate(['/kartta']); // IT
        } else {
          this.error = this.authService.loginerror; // haetaan virheviesti, jotta se voidaan esittää käytäjälle templaatissa. IT
        }
      });
  }
}
