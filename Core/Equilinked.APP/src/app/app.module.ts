import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { MenuSuperior } from '../pages/home/subPages/menuSuperior/menuSuperior';
import { CaballosInd } from '../pages/home/subPages/caballosInd/caballosInd';
import { GruposCaballos } from "../pages/home/subPages/grupos-caballos/grupos-caballos";
import { AdminGruposCaballosPage } from "../pages/home/admin-grupos-caballos/admin-grupos-caballos";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    MenuSuperior,
    CaballosInd,
    GruposCaballos,
    AdminGruposCaballosPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    AdminGruposCaballosPage
  ],
  providers: []
})
export class AppModule { }
