// Tässä tiedostossa on API-rajapintaa kutsuva koodi.
// getComments() -metodia kutsutaan app.component.ts -tiedostosta, jonne kutsun hakema data menee muuttujan arvoksi.
// Tämä on kokonaan omaa koodiani

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class freeApiService {
  lahinasema: any;
  asema_sij: any;
  kayt_sij: any;
  loggedin: boolean;
  lahin_lat: any;
  lahin_lon: any;
  lat: any;
  lon: any;
  lahinasema_nimi: any;

  constructor(private httpclient: HttpClient) {
    this.lahinasema = '';
    this.asema_sij = '';
    this.kayt_sij = '';
    this.lahin_lat = '';
    this.lahin_lon = '';
    this.lat = '';
    this.lon = '';
    this.lahinasema_nimi = '';
  }

  private handleError(error: any): Observable<any> {
    console.error('Virhe!', error);

    return error.message || error;
  }

  getAsemat(): Observable<any> {
    return this.httpclient
      .get(
        `https://junaappi.herokuapp.com/trains/stationsmetadata/${this.lahinasema}`
      )
      .pipe(catchError(this.handleError));
  }

  getLahinAsema(lat, lon): Observable<any> {
    return this.httpclient
      .get(`https://junaappi.herokuapp.com/trains/stations/${lat}/${lon}`)
      .pipe(catchError(this.handleError));
  }

  tallennaStatus(
    asema,
    asema_sij,
    kayt_sij,
    asLat,
    asLon,
    kayLat,
    kayLon,
    lahinasema_nimi
  ) {
    this.lahinasema = asema;
    this.asema_sij = asema_sij;
    this.kayt_sij = kayt_sij;
    this.lahin_lat = asLat;
    this.lahin_lon = asLon;
    this.lat = kayLat;
    this.lon = kayLon;
    this.lahinasema_nimi = lahinasema_nimi;

    console.log('Taa' + this.lahinasema);
  }

  haeLahtevatJunat(kohdeasema): Observable<any> {
    return this.httpclient
      .get(
        `https://junaappi.herokuapp.com/trains/getnexttrains/${this.lahinasema}/${kohdeasema}`
      )
      .pipe(catchError(this.handleError));
  }

  haeTietokanta(): Observable<any> {
    const mytoken = JSON.parse(sessionStorage['accesstoken']);
    const headers = {
      headers: new HttpHeaders({ 'x-access-token': mytoken.token }),
    };
    return this.httpclient
      .get(`https://junaappi.herokuapp.com/trains/`, headers)
      .pipe(catchError(this.handleError));
  }

  poistaTietokannasta(id): Observable<any> {
    const deltoken = JSON.parse(sessionStorage['accesstoken']);
    const tokenheaders = {
      headers: new HttpHeaders({ 'x-access-token': deltoken.token }),
    };
    return this.httpclient
      .delete(`https://junaappi.herokuapp.com/trains/id/${id}`, tokenheaders)
      .pipe(catchError(this.handleError));
  }
}
