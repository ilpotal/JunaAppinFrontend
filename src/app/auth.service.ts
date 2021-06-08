import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'; // kirjasto jwt:n käsittelyyn
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
@Injectable()
export class AuthService {
  private apiUrl = 'https://junaappi.herokuapp.com/users/login'; // autentikaatiopalvelun osoite
  public token: string;
  private jwtHelp = new JwtHelperService(); // tokenin dekoodauspalvelu
  private subject = new Subject<any>(); // subjectilla viesti navbariin että token on tullut
  public loginerror: string; // muuttujaan sijoitetaan virheilmoitus, jos login epäonnistuu. Virheilmoitus näytetään login -sivulla-
  public isadmin: boolean; // muuttujaan sijoitetaan tieto onko käyttäjä admin vai ei
  canshow: boolean; // onko käyttäjä hakenut sijaintinsa, jotta voidaan näyttää Juna-aikataulut -komponentin linkki
  //deluser: boolean; // tämä saa arvon true silloin kun käyttäjä poistaa tunnuksen, arvon avulla päivitetään navbar, tämä vaatii jatkokehitystä

  // Alla olevia tietoja tarvitaan userkomponentissa, jonka kautta tiedot näytetään käyttäjälle.
  public lastvisitday: string; // tähän tallennetaan loginissa saatava käyttäjän edellinen sisäänkirjautumispäivä
  public regday: string; // tähän tallennetaan loginissa saatava käyttäjän rekisteröintipäivä
  public username: string; // tähän tallennetaan username
  public visits: string; // tähän tallennetaan loginissa saatava tieto siitä montako kertaa käyttäjä on kirjautunut palveluun

  constructor(private http: HttpClient) {
    // Jos token on jo sessionStoragessa, otetaan se sieltä muistiin
    //this.deluser = false; // tämä alustetaan falseksi.
    this.canshow = false; // tämä alustetaan falseksi.
    const currentUser = JSON.parse(sessionStorage.getItem('accesstoken'));
    this.token = currentUser && currentUser.token;
  }

  canShow() {
    // metodilla muutetaan muuttujan canshow -arvo trueksi.
    this.canshow = true;
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);

    //console.error('An error occurred', error);
    return error.message || error;
  }
  /* login-metodi ottaa yhteyden palvelumen autentikaatioreittiin, postaa tunnarit
  ja palauttaa Observablena true tai false riippuen siitä saatiinko lähetetyillä
  tunnareilla token backendistä */
  login(username: string, password: string): Observable<boolean> {
    // tässä ei käytetä JSON.stringify -metodia lähtevälle tiedolle
    return this.http
      .post(this.apiUrl, { username: username, password: password }) // salasana ja tunnus viedään serverille autentikaatioreitille
      .pipe(
        map((res) => {
          console.log(res); // loggaa alla olevan tyylisen vastauksen
          /*
        {success: true, message:
          "Tässä on valmis Token!",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…zNzV9.x1gWEg9DtoPtEUUHlR8aDgpuzG6NBNJpa2L-MEhyraQ"}
        */
          const token = res['token']; // otetaan vastauksesta token
          if (token) {
            this.token = token;
            /* Tässä tutkitaan onko tokenin payloadin sisältö oikea.
             Jos on, laitetaan token sessionStorageen ja palautetaan true
             jolloin käyttäjä pääsee Admin-sivulle
          */
            try {
              // dekoodataan token
              const payload = this.jwtHelp.decodeToken(token);
              console.log(payload);
              // Tässä voidaan tarkistaa tokenin oikeellisuus
              //if (payload.username === username) {
              if (payload.username === username) {
                // username ja token viedään sessionStorageen
                sessionStorage.setItem(
                  'accesstoken',
                  JSON.stringify({ username: username, token: token })
                );
                this.loginTrue(); // lähetetään viesti navbariin että vaihdetaan login:true -tilaan
                console.log('login onnistui'); // tulostetaan konsoleen
                this.isadmin = payload.isadmin;
                this.lastvisitday = res['lastvisitday']; // poimitaan vastauksesta edellinen kirjautumispäivä
                this.regday = res['regday']; // poimitaan vastauksesta rekisteröitymispäivä
                this.username = payload.username; // poimitaan payloadista username
                this.visits = res['visits'];
                console.log(this.username);
                return true; // saatiin token
              } else {
                console.log('login epäonnistui'); // tulostetaan konsoleen
                return false; // ei saatu tokenia
              }
            } catch (err) {
              return false;
            }
          } else {
            console.log('tokenia ei ole'); // tulostetaan konsoleen
            this.loginerror = res['message']; // sijoitetaan loginerror -muuttujaan palvelimelta tulleen virheilmoituksen teksti, joka näytetään login-sivulla.

            return false;
          }
        })
      );
  }
  /* Ilmoitetaan navbariin että koska ollaan loggauduttu,
     niin Logout on mahdollista tehdä, joten vaihdetaan navbariin login-linkin
     tilalle logout-linkki
  */

  loginTrue(): Observable<any> {
    this.subject.next(true);
    return this.subject.asObservable();
  }

  // Ilmoitetaan Navbaariin, että navin logout pitää vaihtaa loginiksi. Käytetään kun käyttäjää poistetaan.

  loginFalse(): Observable<any> {
    this.subject.next(false);
    return this.subject.asObservable();
  }

  // logout poistaa tokenin sessionStoragesta
  logout(): void {
    this.canshow = false; // kun käyttäjä kirjautuu ulos ei näytetä pääsivulla enää viimeistä sijaintia ja napin teksti vaihtuu
    //this._navbar.doLogout();
    this.token = null; // nollataan token
    sessionStorage.removeItem('accesstoken'); // poistetaan token sessionStoragesta
  }

  deleteUser(username): Observable<any> {
    console.log('Voi voi');
    const deltoken = JSON.parse(sessionStorage['accesstoken']);
    const tokenheaders = {
      headers: new HttpHeaders({ 'x-access-token': deltoken.token }),
    };
    console.log(deltoken);

    return this.http
      .delete(`http://localhost:3000/users/delete/${username}`, tokenheaders)

      .pipe(catchError(this.handleError));
  }
}
