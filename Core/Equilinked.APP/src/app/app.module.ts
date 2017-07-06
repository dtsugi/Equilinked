import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';
import { MomentModule } from "angular2-moment";

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { MenuSuperior } from '../pages/home/subPages/menuSuperior/menuSuperior';
import { CaballosInd } from '../pages/home/subPages/caballosInd/caballosInd';

/* Notificaciones */
import { NotificacionesPage } from '../pages/notificaciones/notificaciones';
import { NotificacionesViewPage } from '../pages/notificaciones/notificaciones-view';
import { NotificacionesInsertPage } from '../pages/notificaciones/notificaciones-insert';
import { NotificacionesExtendedInsertPage } from '../pages/notificaciones/notificaciones-extended-insert';

/* Caballos */
import { FichaCaballoPage } from "../pages/home/ficha-caballo/ficha-caballo-home";
import { AdminCaballosInsertPage } from "../pages/home/admin-caballos/admin-caballos-insert";
/* Caballos-Grupos */
import { GruposCaballos } from "../pages/home/subPages/grupos-caballos/grupos-caballos";
import { CreacionGrupoPage } from "../pages/home/subPages/grupos-caballos/creacion-grupo/creacion-grupo";
import { AdministracionGrupoPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/administracion-grupo";
import { UbicacionesGrupoPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/ubicaciones";
import { DetalleEstabloPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/detalle-establo/detalle-establo";
import { PopoverOpcionesEstablo } from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/detalle-establo/popover-establo/popover-establo";
import { SegmentFichaGrupo } from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-ficha/segment-ficha";
import { AlertasFicha } from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/alertas-ficha";
import { EdicionAlertaPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/edicion-alerta/edicion-alerta";
import { SeleccionCaballosPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/seleccion-caballos/seleccion-caballos";
import { DetalleAlertaPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/detalle-alerta/detalle-alerta";
import { NotasFichaPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/notas-ficha";
import { EdicionNotaPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/edicion-nota/edicion-nota";
import { DetalleNotaPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/detalle-nota/detalle-nota";
import { OpcionesFichaGrupo } from "../pages/home/subPages/grupos-caballos/administracion-grupo/opciones-ficha/opciones-ficha";
import { CambioNombrePage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/cambio-nombre/cambio-nombre";
import { SegmentCaballosGrupo } from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-caballos/segment-caballos";
import { EdicionCaballosGrupoPage } from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-caballos/edicion-caballos/edicion-caballos";
/* Caballos-ALimentacion */
import { AlimentacionPage } from "../pages/home/ficha-caballo/alimentacion/alimentacion";
import { AlimentacionEditPage } from "../pages/home/ficha-caballo/alimentacion/alimentacion-edit";
import { PopoverAlimentacionPage } from "../pages/home/ficha-caballo/alimentacion/pop-over/pop-over-alimentacion";
/* Caballos-Notas */
import { NotasPage } from "../pages/home/ficha-caballo/notas/notas";
/* Caballos-Datos */
import { DatosViewPage } from "../pages/home/ficha-caballo/datos/datos-view";
/* Caballos-Herrajes */
import { HerrajesPage } from "../pages/home/ficha-caballo/herrajes/herrajes";
/* Caballos-Dentista */
import { DentistaPage } from "../pages/home/ficha-caballo/dentista/dentista";
/* Caballos-Desparasitacion */
import { DesparasitacionPage } from "../pages/home/ficha-caballo/desparasitacion/desparasitacion";
/* Perfil */
import { PerfilPage } from "../pages/perfil/perfil";
import { SegmentDatos } from "../pages/perfil/datos/segment-datos";
import { EdicionPerfilPage } from "../pages/perfil/datos/edicion-perfil/edicion-perfil";
import { PopoverDatosPage } from '../pages/perfil/datos/pop-over/pop-over-datos';
import { OpcionesCuentaPage } from "../pages/perfil/datos/opciones-cuenta/opciones-cuenta";
import { CambioContrasenaPage } from "../pages/perfil/datos/opciones-cuenta/cambio-contrasena/cambio-contrasena";
import { TerminosPrivacidadPage } from "../pages/perfil/datos/opciones-cuenta/terminos-privacidad/terminos-privacidad";
import { ContactoPage } from "../pages/perfil/datos/opciones-cuenta/contacto/contacto";
import { RecomendacionPage } from "../pages/perfil/datos/opciones-cuenta/recomendacion/recomendacion";
import { PreguntasFrecuentesPage } from "../pages/perfil/datos/opciones-cuenta/preguntas-frecuentes/preguntas-frecuentes";
import { EliminacionCuentaPage } from "../pages/perfil/datos/opciones-cuenta/eliminacion-cuenta/eliminacion-cuenta";
/* Establos */
import { SegmentEstablos } from "../pages/perfil/establos/segment-establos";
import { AdminEstablosPage } from "../pages/perfil/establos/admin-establo/admin-establo";
import { CaballosEstabloModal } from "../pages/perfil/establos/admin-establo/caballos-establo/caballos-establo-modal";
import { InfoEstabloPage } from "../pages/perfil/establos/admin-establo/info-establo";
import { EdicionEstabloCaballosPage } from "../pages/perfil/establos/admin-establo/edicion-caballos";

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
    FichaCaballoPage,
    AdminCaballosInsertPage,
    /* Caballos-Grupos */
    GruposCaballos,
    CreacionGrupoPage,
    AdministracionGrupoPage,
    UbicacionesGrupoPage,
    DetalleEstabloPage,
    PopoverOpcionesEstablo,
    SegmentFichaGrupo,
    AlertasFicha,
    EdicionAlertaPage,
    SeleccionCaballosPage,
    DetalleAlertaPage,
    NotasFichaPage,
    EdicionNotaPage,
    DetalleNotaPage,
    OpcionesFichaGrupo,
    CambioNombrePage,
    SegmentCaballosGrupo,
    EdicionCaballosGrupoPage,
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
    /* Caballos-Desparasitacion */
    DesparasitacionPage,
    /* Perfil */
    PerfilPage,
    SegmentDatos,
    EdicionPerfilPage,
    PopoverDatosPage,
    OpcionesCuentaPage,
    CambioContrasenaPage,
    TerminosPrivacidadPage,
    ContactoPage,
    RecomendacionPage,
    PreguntasFrecuentesPage,
    EliminacionCuentaPage,
    /* Establos */
    SegmentEstablos,
    AdminEstablosPage,
    CaballosEstabloModal,
    InfoEstabloPage,
    EdicionEstabloCaballosPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: "md"
    }),
    HttpModule,
    FormsModule,
    MomentModule
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
    FichaCaballoPage,
    AdminCaballosInsertPage,
    /* Caballos-Grupos */
    CreacionGrupoPage,
    AdministracionGrupoPage,
    UbicacionesGrupoPage,
    DetalleEstabloPage,
    PopoverOpcionesEstablo,
    AlertasFicha,
    EdicionAlertaPage,
    SeleccionCaballosPage,
    DetalleAlertaPage,
    NotasFichaPage,
    EdicionNotaPage,
    DetalleNotaPage,
    OpcionesFichaGrupo,
    CambioNombrePage,
    EdicionCaballosGrupoPage,
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
    /* Caballos-Desparasitacion */
    DesparasitacionPage,
    /* Perfil */
    PerfilPage,
    EdicionPerfilPage,
    PopoverDatosPage,
    OpcionesCuentaPage,
    CambioContrasenaPage,
    TerminosPrivacidadPage,
    ContactoPage,
    RecomendacionPage,
    PreguntasFrecuentesPage,
    EliminacionCuentaPage,
    /* Establos */
    AdminEstablosPage,
    CaballosEstabloModal,
    InfoEstabloPage,
    EdicionEstabloCaballosPage
  ],
  providers: []
})
export class AppModule { }
