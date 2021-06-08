// Tämä on omaa koodiani kokonaan. IT

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { freeApiService } from '../services/freeapi.service';
import { RegsService } from '../regs.service';
import { Juna } from '../classes/juna'; // Juna-model
import { Asema } from '../classes/asemat'; // Asema-model
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-juna',
  templateUrl: './juna.component.html',
  styleUrls: ['./juna.component.css'],
})
export class JunaComponent implements OnInit, AfterViewInit {
  title = 'ang-junahaku';
  asemat: Asema[] = []; // Taulu, johon kerätään Asema-mallista tietoa, tässä siihen kerätään asemat, jotka esitetään käyttäjälle alasvetovalikossa.

  asema: string;
  stations: Asema[] = []; // Taulu, johon kerätään Asema-mallin tietoa. Tässä välivaratona servicen kautta tulevalle datalle.
  lahtevat: Asema[] = []; // Taulu, johon kerätään Asema-mallin tietoa, tässä siihen tulee lähtöasemalta lähtevät junavuorot.
  valiasemat: string[] = []; // Taulu, johon kerätään stringeja
  tavara: Asema[] = []; // // Taulu, johon kerätään Asema-mallin tietoa.
  showTitles: boolean; // Näytetäänkö Junavuoro-taulukon "header" -tiedot vai ei. Ei näytetä ennen kuin taulukkoon tulee sisältöä
  showValiasTitles: boolean; // Näytetäänkö väliasemataulukon "header" -tiedot vai ei. Ei näytetä ennen kuin taulukkoon tulee sisältöä.
  valias: boolean; // Väliasemataulun pituusseurantaa varten. Muuttujan arvolla seurataan onko väliasemia vai ei.

  constructor(
    public _freeApiService: freeApiService,
    public canshow: AuthService,
    public _regservice: RegsService
  ) {
    this.showTitles = false; // Ei näytetä Junavuoro-taulukon otsikkoa oletuksena tempaatissa
    this.showValiasTitles = false; //Ei näytetä Valiasema-taulukon otsikkoa oletuksena templaatissa.
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    // Kun komponentti syntyy, kutsutaan metodia, joka hakee asemat Juna-aikataulut templaatin alasvetovalikkoon.
    this.getAsemat();
  }

  // Haetaan lähtöasemalta lähtevät junavuorot serverin kautta digitraffic-palvelusta. Käyttäjä valitsee alasvetovalikosta kohdeaseman,
  //joka tulee haeasemaltaLahtevat-metodille asema-parametrina.
  haeasemaltaLahtevat(asema) {
    // muuttujan arvoksi asetetaan tässäkin false, koska käyttäjä voi valita peräkkäin uusia asemia, jolloin välissä ei haluta vilauttaa
    // otskoita turhaan. Kun asemat on haettu, muutetaan muuttujan arvoksi true.
    this.showValiasTitles = false;
    //this.valiasemat = [];
    this._freeApiService.haeLahtevatJunat(asema).subscribe((data) => {
      //kutsutaan servicen kautta serveriä. asema -parametri kertoo aseman minne menevistä junavuoroista käyttäjä on kiinnostunu.
      //serveri tarvitsee toisena parametrina lähtöaseman, se lisätään kutsuun _freeApiServicessä
      this.lahtevat = data; // vastaus sijoitetaan this.lahtevat -taulukkoon.
    });

    this.showTitles = true; // näytetään otsikot.
  }

  getAsemat() {
    // Haetaan asemat Juna-aikataulut -sivun alasvetovalikkoon. Alasvetovalikosta käyttäjä valitsee aseman minne menevistä junavuoroista on kiinnostunut.
    // Asemat haetaan servicen kautta serveriltä tai tarficomista.
    this._freeApiService.getAsemat().subscribe((data) => {
      this.stations = data;

      for (let i = 0; i < this.stations.length; i++) {
        this.asemat.push(this.stations[i]); // Asemat sijoitetaan this.asemat -tauluun.
      }
    });
  }

  haeValiasemat(valiasemaId) {
    // Tässä haetaan väliasemat this.lahtevat -taulusta. Vain ne väliasemat otetaan tauluun, joilla on sama id kuin kohdeasemalle. Id tulee valiasemaId-parametrina.
    this.valias = false; // Väliasemataulun pituusseuranta asetetaan falseksi.
    this.valiasemat = []; // Tyhjennetään väliasemat taulu, jotta ne eivät jää tauluun, jos käyttäjä valitsee toisen junavuoron väliaseman.
    for (let asemak of this.lahtevat) {
      if (asemak.id === valiasemaId) {
        for (let valiasema of asemak.valiasemat) {
          this.valiasemat.push(valiasema); // valiasemat-tauluun kerätään ehdon täyttävät väliasemat.
        }
      }
    }
    if (this.valiasemat.length === 0) {
      this.valias = true; // jos valiasemat-taulukon pituudeksi jää 0, saa muuttuja arvon true, jolloin templaatilla näytetään " Ei väliasemia".
    }

    this.showValiasTitles = true; // Näytetään väliasemataulukon "header" -tiedot.
  }
}
