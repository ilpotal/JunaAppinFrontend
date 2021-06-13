// Tämä on omaa koodiani kokonaan. IT

import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet'; // Leaflet haetaan
import { freeApiService } from '../services/freeapi.service';
import { AuthService } from '../auth.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const iconDefault = L.icon({
  // käyttäjälle näytetään perusmarkkeri.
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [23, 37],
  iconAnchor: [11, 37],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const trainIcon = L.icon({
  iconUrl: 'assets/images/train2.png', // Rautatieasemalle näytetään oma markkeri.
  iconSize: [27, 22],
  iconAnchor: [15, 12],
});

const marker_sina = L.marker([0, 0], { icon: iconDefault }).bindPopup(
  // luodaan kayttajan markkeri.
  'Sinun sijaintisi'
);
const marker_juna = L.marker([0, 0], { icon: trainIcon }).bindPopup(
  // luodaan rautatieaseman markkeri.
  'Rautatieasema'
);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  latlng: L.LatLng;
  lat: number;
  lon: number;
  lahinasema: any;
  lahimmat: any;
  lahin_lat: any;
  lahin_lon: any;
  lahinlatlng: L.LatLng;
  etaisyys: any;
  lahin_asema: any;
  timestamp: any;
  refresh: boolean;
  nonavigation: boolean;
  nopermission: boolean;

  constructor(
    public _freeApiService: freeApiService,
    public canshow: AuthService
  ) {
    this.latlng = new L.LatLng(0, 0);
    this.lat = 0;
    this.lon = 0;
    this.lahinlatlng = new L.LatLng(0, 0);
    this.lahin_lat = 0;
    this.lahin_lon = 0;
    this.etaisyys = 0;
    this.lahin_asema = '';
    this.refresh = false;
    this.nonavigation = false;
    this.nopermission = false;
  }
  ngOnDestroy(): void {
    // Tämä yhdessä ngAfterViewInitin kanssa piti laittaa, jotta Leaflet ei herjannut konsolessa, että kartta on jo alustettu.
    // poistaa kartan lopussa
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Tämä yhdessä ngOnDestroyn kanssa piti laittaa, jotta Leaflet ei herjannut konsolessa, että kartta on jo alustettu..
    // Jos kartta on, se poistetaan ennen uuden alustusta.
    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    // Jos sijainti on kertaalleen haettu kutsutaan this.setLocation() -metodia, silloin kun  palataan map-komponenttiin. Tällöin kartalle saadaan muistissa oleva
    // sijainti. Kun painetaan Päivitä sijainti tai Hae sijainti -nappia, silloin mennään suoraan getLocation()-metodiin ja haetaan uusi sijainti.

    if (this.canshow.canshow) {
      this.setLocation();
    }
  }

  private initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          this.latlng = new L.LatLng(
            location.coords.latitude,
            location.coords.longitude
          );
          this.nopermission = false;
          this.nonavigation = false;
          this.timestamp = location.timestamp;
          let tstamp = new Date(this.timestamp);
          this.timestamp =
            tstamp.toLocaleDateString() +
            ', kello ' +
            tstamp.toLocaleTimeString();

          this.lat = location.coords.latitude;
          this.lon = location.coords.longitude;

          this.map = L.map('map', {
            center: [this.lat, this.lon],
            zoom: 7,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          }).addTo(this.map);

          //Tällä voi säätää kartan zoomia.
          L.control.scale().addTo(this.map);

          // haetaan käyttäjän sijantiin nähden lähin asema serveriltä.
          this.haeLahimmatStationit(this.lat, this.lon);

          // Tämä on lisäominaisuus. Kun klikkaa kartalla, selain kertoo kyseisen kohdan koordinaatit.

          this.map.on('click', function (e) {
            alert(e.latlng);
          });
        },
        (error) => {
          console.error(error);
          this.refresh = false;
          this.nopermission = true;
        },
        {
          enableHighAccuracy: true, // tällä pyritään parantamaan paikannuksen tarkkuutta.
          maximumAge: 0, // ei oteta cachesta sijantia.
        }
      );
    } else {
      this.refresh = false;
      this.nonavigation = true;
    }
  }

  alustaKartta(lahin) {
    // Tässä viedään markerit kartalle. Kutsussa tulee lähimmän aseman sijainti.

    marker_sina.setLatLng([this.latlng.lat, this.latlng.lng]).addTo(this.map);

    marker_juna.setLatLng(lahin).addTo(this.map);
    this.refresh = false;
  }

  haeLahimmatStationit(lat, lon) {
    // haetaan lähin rautatieasema, ja etäisyys käyttäjään.
    this._freeApiService.getLahinAsema(lat, lon).subscribe(async (data) => {
      this.lahimmat = data;
      this.lahinasema = this.lahimmat[0].asema;
      this.lahin_asema = this.lahimmat[0].koodi;
      this.lahin_lat = this.lahimmat[0].pituus;
      this.lahin_lon = this.lahimmat[0].leveys;
      this.etaisyys = this.lahimmat[0].etaisyys;
      this.etaisyys = parseFloat(this.etaisyys).toFixed(2);
      //console.log(this.lahin_lat);
      //console.log(this.lahin_asema);
      this.lahinlatlng = new L.LatLng(this.lahin_lon, this.lahin_lat);
      // kutsutaan this.vieStatus -metodia, jolla käydään viemässä joukko arvoja servicelle.
      this.alustaKartta(this.lahinlatlng); // kutsutaan metodia, joka vie markkerit kartalle.
      this.vieStatus();
    });
  }

  vieStatus() {
    // tällä viedään joukko arvoja servicelle, josta niitä voi hyödyntää muuallakin sovelluksessa.
    //console.log(this.lahin_asema);
    this._freeApiService.tallennaStatus(
      this.lahin_asema,
      this.lahinlatlng, // lähimmän aseman sijainti (pituus ja leveys)
      this.latlng, //Käyttäjän sijainti (pituus ja leveys)
      this.lahin_lat, // lähimmän aseman sijainnin leveyspiiri
      this.lahin_lon, // lähimmän aseman sijainnin pituuspiiri
      this.lat, // Käyttäjän sijainnin leveyspiiri
      this.lon, // Kättäjän sijainnin pituuspiiri
      this.lahinasema, // lähimmän aseman nimi
      this.timestamp
    );
    this.canshow.canShow();
    // yllä käydään muuttamassa canshow -muuttujan arvon trueksi, jotta voidaan aktivoida Juna-aikataulut componentin linkki, koska sivun tarvitsemia tietoja
    // on käytettävissä. Tämän arvoa hyödynnetään myös siinä kun map-componenttia ladataan muistiin, kun canshow-arvo on truee, silloin otetaan muistissa oleva
    // sijainti, eikä haeta uutta sijaintia.
  }

  // Kun templaatilla olevaa Päivitä sijaintisi -nappia painaa kutsutaan tätä metodia, joka ensin poistaa vanhan kartan ja sitten
  //muodostaa sen sijainteineen uudelleen

  getLocation() {
    this.refresh = true;
    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    this.initMap();
  }

  // Jos käyttäjä on hakenut sijainnin kertaalleen säilytetään sijaintitietoja servicessa, jotta kartta voidaan piirtää sijainteineen
  // ilman, että käyttäjän sijaintia tarvitsee hakea uudelleen. Käyttäjä voi hakea halutessaan sijainnin uudelleen painamalla Päivitä sijaintisi -nappia,
  // jolloin kutsutaan yllä olevaa metodia.

  setLocation() {
    //console.log('setLocation');

    navigator.geolocation.getCurrentPosition((location) => {
      this.haeLahimmatStationit(
        this._freeApiService.lat,
        this._freeApiService.lon
      );
      this.timestamp = this._freeApiService.timestamp;

      this.latlng = new L.LatLng(
        this._freeApiService.lat,
        this._freeApiService.lon
      );
      this.lat = this._freeApiService.lat;
      this.lon = this._freeApiService.lon;

      //console.log(this.lahin_lat);

      this.map = L.map('map', {
        center: [this.lat, this.lon],
        zoom: 7,
      });
      //this.map.invalidateSize();

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      }).addTo(this.map);

      L.control.scale().addTo(this.map);

      this.map.on('click', function (e) {
        alert(e.latlng);
      });
    });
  }
}
