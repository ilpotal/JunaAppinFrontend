import { Component, OnInit } from '@angular/core';
import { freeApiService } from '../services/freeapi.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tietokanta',
  templateUrl: './tietokanta.component.html',
  styleUrls: ['./tietokanta.component.css'],
})
export class TietokantaComponent implements OnInit {
  tietokanta: string[] = [];
  respond: any;
  trainnumber: any;

  constructor(
    private _freeApiService: freeApiService,
    public _authService: AuthService
  ) {}

  ngOnInit(): void {
    //this.haeTietokanta();
  }

  haeTietokanta() {
    this._freeApiService.haeTietokanta().subscribe((data) => {
      this.tietokanta = data;
      console.log(this.tietokanta);
    });
  }

  delete(id) {
    console.log(id);
    this._freeApiService.poistaTietokannasta(id).subscribe((data) => {
      this.respond = data;
      console.log(this.respond);
      this.haeTietokanta();
    });
  }

  haeTietokannastaJuna($event) {
    this._freeApiService.haeTietokanta().subscribe((data) => {
      this.tietokanta = data;
      console.log(this.tietokanta);
    });
  }
}
