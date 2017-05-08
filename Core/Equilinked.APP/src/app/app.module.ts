import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage} from '../pages/login/login';
import { MenuSuperior } from '../pages/home/subPages/menuSuperior/menuSuperior';
import { CaballosInd } from '../pages/home/subPages/caballosInd/caballosInd';
import { GruposCaballos } from "../pages/home/subPages/grupos-caballos/grupos-caballos";

/* Notificaciones */
import { NotificacionesPage } from '../pages/notificaciones/notificaciones';
import { NotificacionesViewPage } from '../pages/notificaciones/notificaciones-view';
import { NotificacionesInsertPage } from '../pages/notificaciones/notificaciones-insert';

/* Caballos */
import { AdminGruposCaballosPage } from "../pages/home/admin-grupos-caballos/admin-grupos-caballos";

/* Perfil */
import { PerfilDatosPage } from "../pages/perfil/perfil-datos";
import {PopoverDatosPage} from '../pages/perfil/pop-over/pop-over-datos';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MenuSuperior,
    CaballosInd,
    GruposCaballos,
    /* Notificaciones */
    NotificacionesPage,
    NotificacionesViewPage,
    NotificacionesInsertPage,
    /* Caballos */
    AdminGruposCaballosPage,
    /* Perfil */
    PerfilDatosPage,
    PopoverDatosPage
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
    /* Notificaciones */
    NotificacionesPage,
    NotificacionesViewPage,
    NotificacionesInsertPage,
    /* Caballos */
    AdminGruposCaballosPage,
    /* Perfil */
    PerfilDatosPage,
    PopoverDatosPage
  ],
  providers: []
})
export class AppModule { }
