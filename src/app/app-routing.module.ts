import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { TietokantaComponent } from './tietokanta/tietokanta.component';
import { LoginComponent } from './login/login.component';
import { JunaComponent } from './juna/juna.component';
import { MapComponent } from './map/map.component';
import { LoginGuard } from './login.guard';
import { OhjeComponent } from './ohje/ohje.component';
import { AuthGuard } from './auth.guard';
import { RegComponent } from './reg/reg.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'juna', component: JunaComponent, canActivate: [LoginGuard] }, // Juna-komponenttiin ei pääse ellei ole hakenut kartta-komponentissa sijaintietoa.
  {
    path: 'tietokanta',
    component: TietokantaComponent, // Tietokanta-komponenttiin ei pääse, ellei ole kirjautunut sisään.
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'kartta', component: MapComponent },
  { path: 'ohje', component: OhjeComponent },
  { path: 'register', component: RegComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] }, // User-komponenttiin ei pääse, ellei ole kirjautunut sisään.

  { path: '**', redirectTo: '/kartta', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
