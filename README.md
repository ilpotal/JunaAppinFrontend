# AngJunahaku

## Yleisesittely

JunaApp -sovelluksella sovelluksen käyttäjä voi hakea oman sijaintinsa ja lähimmän rautatieaseman sijannin, sekä lähimmältä rautatieasemalta lähtevät junavuorot. Sovellus sijoittaa käyttäjän, sekä lähimmän henkilöliikennettä harjoittavan rautatieaseman sijainnin kartalle. Kun käyttäjä on hakenut sijaintinsa ja frontend on saanut serveriltä lähimmän rautatieaseman, käyttäjä näkee tiedot sovelluksen etusivulla. Sen lisäksi valikkoon tulee uusi valinta "Juna-aikataulut", jonka valitsemalla pääsee etsimään lähimmältä rautatieasemalta käyttäjän valitsemalle kohdeasemalle seuraavan 24 tunnin aikana lähtevät junat. Palvelu näyttää tai serveri palauttaa oletuksena vain 10 ensimmäistä lähtevää junavuoroa. Tämä asetus on serverillä. Mikäli päätelaitteen näyttö sallii leveämmän sovellusikkunan, saa lähtevistä junavuoroista halutessaan myös niiden väliasemat matkalla kohdeasemalle. Väliasemien näkyminen edellyttää että frontendin tulostamaan taulukkoon tulee Väliasemat -sarake, jossa on Väliasemat -nappi. Nappia klikkaamalla junavuorotaulukon alle tulostuu lista väliasemista mikäli niitä on. Väliasema-sarakkeen näkyminen edellyttää että päätelaite näyttö on riittävän leveä. Myös Väliasema-tulosteessa on rajoitettu sarakkeiden näkymistä, mikäli päätelaitteen näyttö on kapea.

Sijainnin, lähimmän rautatieaseman ja lähtevien junavuorojen, tai niiden väliasemien näkeminen ei edellytä kirjautumista. Kirjautumalla palveluun,saa valikkoon lisäksi valinnan "Tietokanta", josta näkyy kaikki palvelun käyttäjille palauttamat junavuorot. Jos käyttäjän rooli on isadmin = true, tulee Tietokanta -tauluun myös sarake, jossa on Poista -nappi kullakin rivillä. Kun nappia painaa, saa kyseisen rivin poistettua tietokannasta.

Kun käyttäjä on kirjautunut palveluun sisään, valikkoon tulee lisäksi Käyttäjätiedot -linkki, jonka kautta käyttäjä näkee oman käyttäjätunnuksensa ja päivämäärän, jolloin hän rekisteröityi palveluun. Lisäksi Käyttäjätiedot-sivulla näkyy päivämäärä, jolloin käyttäjä edellisen kerran kirjautui palveluun. Käyttäjä näkee myös kuinka monta kertaa hän on kirjautunut palveluun sisään. Käyttäjätiedot -sivulla on lisäksi nappi, jolla pääsee poistamaan käyttäjän tiedot palvelun tietokannasta.

Sovelluksen valikossa on myös Ohje-valinta, josta käyttäjä näkee lyhyen ohjeistuksen palvelun käytöstä. Luonnollisesti sovelluksessa on rekisteröinti-, sisäänkirjautumis-, sekä uloskirjautumisvalinta.

Sovelluksessa voi rekisteröityä vain ei-admin -tasolla, admin-tason tunnukset, jos niitä tarvitaan lisää, tehdään esimerkiksi Postmanilla. Admin-tason tunnushan ei anna muuta lisäarvoa kuin, että sillä kirjautumalla pääsee poistamaan tietokannasta rivin kerrallaan. Lähinnä halusin nähdä, että miten eri käyttäjätasolle saa erilaistetun näkymän ja toiminnallisuuden.

Frontend-sovellus on tehty JavaScripitillä Angularilla ja serverisovellus Node.js -ympäristössä hyvödyntäen Expressiä. Frontendin ulkoasua on maustettu kevyesti Bootstrapilla. Bootstrapin osalta projektin aikana havaitsin että versio 5.1.0 ei toiminut siten kuten olisi pitänyt. 5.1.0 -versiota käytettäessä ylävalikko ei laajentunut alaspäin ollenkaan. Kun päivitin sen alempaan 4.6.0 -versioon navi toimi kuten pitikin.

## Rajapinnat ja palveluita

Front-end -sovelluksesta on API-rajapinnat serverille. Serveriltä on kyselyjä VR:n tarjoamaan Fintraffic / Digtraffic -avoimen datan palveluun. Lisäksi serverin taustamma on mongo-tietokanta, johon palvelun käyttäjät ja palvelun käyttäjille palauttamat junavuorot tallennetaan. Frontendiin näkyviin saatavassa Tietokanta-näkymässä ei ole käyttäjiin liittyvää tietoa. Kaikki käyttäjiin liittyvä tieto on User-taulussa: käyttäjätunnus, salasana kryptattuna, palveluun rekisteröitymispäivä, viimeisin kirjautumispäivä, sekä kirjautumiskertojen lukumäärä. Käyttäjä voi poistaa tietonsa User-taulusta sovelluksesta.

Kartta- ja sijaintitiedoissa hyödynnetään OpenStreetMapia, sekä Leafletiä.

Ulkoasukirjastona käytetään Bootstrapin versiota 4.6.0

Olen pyrkinyt kommentoimaan koodin sekaan, jos koodissa on käytetty muuta kuin omaa koodiani. Vähäinen määrä lainattua koodia on kurssin tehtävistä hyödynnettyä koodia, omaan tarpeeseen soveltuvin osin muokattua.

Kehityksessä käytin Gittiä, tosin tajusin, että sitä pitää käyttää, vasta loppumetreillä, mutta aika monta committia olen kuitenkin ehtinyt jo tehdä sekä serveripuolella, että frontend-puolella. Tarvittaessa minulta löytyy koodin aikaisempia kehitysversioita koneelta.

## Huomioita kehityksestä

Harjoitustyö oli mielenkiintoinen ja siitä sai juuri niin haastavan kuin halusi. Monessa kohtaa meni hetkeksi sormi suuhun, mutta ratkaisu löytyi aina netistä googlettamalla ja Youtube -videoita katsomalla. Youtubesta löytyy lukematon määrä hyödyllisiä "kursseja" tai opasvideoita, osa niistä on hyvinkin valaisevia. Web-kehittäjän kurssi antoi lopputyölle erittäin hyvä puitteet, oli erittäin hyödyllistä että kurssilla käytiin koodeja läpi ja niitä tehtiin opettajan opastuksella. Haasteeksi on meinannut nousta se, että koodaamisesta ei meinaa tulla loppua. Sovellukseen keksii koko ajan lisää ominaisuuksia, joita siihen haluaisi tehdä. Toisaalta kuitenkin totesin, että lopputyö pitää saada palautettua - koodin lisäämistä voi jatkaa myöhemmin.
