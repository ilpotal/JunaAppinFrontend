import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt'; // kirjasto jwt:n käsittelyyn
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegsService {
  private apiUrl = 'https://junaappi.herokuapp.com/users/register'; // rekisteröintipalvelun osoite

  public token: string;
  private jwtHelp = new JwtHelperService(); // tokenin dekoodauspalvelu
  public regerror: string; // rekisteröinnin yhteydessä tuleva virhilmoitus tähän muuttujaan, josta se näytetään templaatilla
  public regsuccess: string; // onnistuneen rekisteröinnin yhteydessä palvelimelta tuleva viesti, joka näytetään kirjautumisen jälkeen "pääsivulla"
  public regtext: boolean; // kertoo onko rekisteröinti onnistunut vai ei, tämän avulla poistetaan onnistuneesta rekisteröinnistä kertova "Voit kirjautua palveluun" disabloidaan

  constructor(private http: HttpClient) {}

  // alla viedään uuden käyttäjän tiedot palvelimelle ja tietokantaan. Sovelluksella voi rekisteröityä vain isadmin = false -arvolla, jolla ei pääse poistamaan tietokannasta mitään.
  // isadmin = true -arvolla voi rekisteröityä esimerkiksi Postmanilla, jolloin tunnuksella pääsee poistamaan sovelluksen kautta tietokannan rivejä.
  register(username: string, password: string): Observable<boolean> {
    return this.http
      .post(this.apiUrl, {
        username: username,
        password: password,
        isadmin: false,
      })
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
              if (payload.username === username) {
                // token sessionStorageen
                sessionStorage.setItem(
                  'accesstoken',
                  JSON.stringify({ username: username, token: token })
                );

                console.log('rekisteröinti onnistui'); // tulostaa konsoliin tekstin
                this.regsuccess = res[`message`]; // regsucces -muuttujaan sijoitetaan onnistunesta rekisteröinnistä kertova viesti
                this.regtext = true; // regtext -muuttujan arvo muutetaan trueksi, eli että rekisteröinti on suoritettu.
                return true; // saatiin token
              } else {
                console.log('rekisteröinti epäonnistui'); // tulostaa konsoliin tekstin
                return false; // ei saatu tokenia
              }
            } catch (err) {
              return false;
            }
          } else {
            console.log('tokenia ei ole'); // tulostaa konsoliin tekstin
            this.regerror = res['message']; // sijoittaa rekisteröinnin yhteydessä tulleen virheilmoituksen muuttujaan. Virheilmoitus näytetään rekisteröintisivulla.

            return false;
          }
        })
      );
  }

  removereg(): void {
    this.token = null;
    sessionStorage.removeItem('accesstoken');
  }
}
