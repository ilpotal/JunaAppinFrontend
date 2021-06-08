// Tässä on katsottu mallia Tommi Tuikan pitämän kurssin koodista.

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegsService } from '../regs.service';

@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css'],
})
export class RegComponent implements OnInit {
  error = '';

  constructor(private _regsService: RegsService, private router: Router) {}

  ngOnInit(): void {
    this._regsService.removereg();
  }
  onSubmit(formData) {
    this._regsService
      .register(formData.tunnus, formData.salasana)
      .subscribe((result) => {
        if (result === true) {
          this.router.navigate(['/kartta']); // IT
        } else {
          this.error = this._regsService.regerror; // haetaan virheviesti, jotta se voidaan esittää templaatissa käyttäjälle. IT
        }
      });
  }
}
