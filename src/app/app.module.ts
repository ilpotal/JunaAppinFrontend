// Tässä on importattu kaikki sovelluksen tarvitsemat Modulit.

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';

import { HttpClientModule } from '@angular/common/http';
import { freeApiService } from './services/freeapi.service';
import { MapComponent } from './map/map.component';
import { JunaComponent } from './juna/juna.component';
import { TietokantaComponent } from './tietokanta/tietokanta.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { OhjeComponent } from './ohje/ohje.component';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    JunaComponent,
    TietokantaComponent,
    NavbarComponent,
    OhjeComponent,
    LoginComponent,
    RegComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [freeApiService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
