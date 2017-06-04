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

/* Notificaciones */
import { NotificacionesPage } from '../pages/notificaciones/notificaciones';
import { NotificacionesViewPage } from '../pages/notificaciones/notificaciones-view';
import { NotificacionesInsertPage } from '../pages/notificaciones/notificaciones-insert';
import { NotificacionesExtendedInsertPage } from '../pages/notificaciones/notificaciones-extended-insert';

/* Caballos */
import { AdminGruposCaballosPage } from "../pages/home/admin-grupos-caballos/admin-grupos-caballos";
import {FichaCaballoPage } from "../pages/home/ficha-caballo/ficha-caballo-home";
import {AdminCaballosInsertPage } from "../pages/home/admin-caballos/admin-caballos-insert";
/* Caballos-Grupos */
import { GruposCaballos } from "../pages/home/subPages/grupos-caballos/grupos-caballos";
import { GruposCaballosDetailPage } from "../pages/home/subPages/grupos-caballos/grupos-caballos-detail";
/* Caballos-ALimentacion */
import {AlimentacionPage } from "../pages/home/ficha-caballo/alimentacion/alimentacion";
import {AlimentacionEditPage } from "../pages/home/ficha-caballo/alimentacion/alimentacion-edit";
import {PopoverAlimentacionPage } from "../pages/home/ficha-caballo/alimentacion/pop-over/pop-over-alimentacion";
/* Caballos-Notas */
import {NotasPage } from "../pages/home/ficha-caballo/notas/notas";
/* Caballos-Datos */
import {DatosViewPage } from "../pages/home/ficha-caballo/datos/datos-view";
/* Caballos-Herrajes */
import { HerrajesPage } from "../pages/home/ficha-caballo/herrajes/herrajes";
/* Caballos-Dentista */
import { DentistaPage } from "../pages/home/ficha-caballo/dentista/dentista";
/* Perfil */
import { PerfilDatosPage } from "../pages/perfil/datos/perfil-datos";
import { PopoverDatosPage } from '../pages/perfil/pop-over/pop-over-datos';
/* Establos */
import { ListadoEstablosPage } from "../pages/perfil/establos/establos";
import { AdminEstablosPage } from "../pages/perfil/establos/admin-establo/admin-establo";
import { CaballosEstabloModal } from "../pages/perfil/establos/admin-establo/caballos-establo/caballos-establo-modal";
import { InfoEstabloPage } from "../pages/perfil/establos/admin-establo/info-establo";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MenuSuperior,
    CaballosInd,
    /* Notificaciones */
    NotificacionesPage,
    NotificacionesViewPage,
    NotificacionesInsertPage,
    NotificacionesExtendedInsertPage,
    /* Caballos */
    AdminGruposCaballosPage,
    FichaCaballoPage,
    AdminCaballosInsertPage,
    /* Caballos-Grupos */
    GruposCaballos,
    GruposCaballosDetailPage,
    /* Caballos-ALimentacion */
    AlimentacionPage,
    AlimentacionEditPage,
    PopoverAlimentacionPage,
    /* Caballos-Notas */
    NotasPage,
    /* Caballos-Datos */
    DatosViewPage,
    /* Caballos-Herrajes */
    HerrajesPage,
    /* Caballos-Dentista */
    DentistaPage,
    /* Perfil */
    PerfilDatosPage,
    PopoverDatosPage,
    /* Establos */
    ListadoEstablosPage,
    AdminEstablosPage,
    CaballosEstabloModal,
    InfoEstabloPage
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
    NotificacionesExtendedInsertPage,
    /* Caballos */
    AdminGruposCaballosPage,
    FichaCaballoPage,
    AdminCaballosInsertPage,
    /* Caballos-Grupos */
    GruposCaballosDetailPage,
    /* Caballos-Alimentacion */
    AlimentacionPage,
    AlimentacionEditPage,
    PopoverAlimentacionPage,
    /* Caballos-Notas */
    NotasPage,
    /* Caballos-Datos */
    DatosViewPage,
    /* Caballos-Herrajes */
    HerrajesPage,
    /* Caballos-Dentista */
    DentistaPage,
    /* Perfil */
    PerfilDatosPage,
    PopoverDatosPage,
    /* Establos */
    ListadoEstablosPage,
    AdminEstablosPage,
    CaballosEstabloModal,
    InfoEstabloPage
  ],
  providers: []
})
export class AppModule { }
