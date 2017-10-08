import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule, Http} from '@angular/http';
import {MomentModule} from "angular2-moment";
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {GoogleMaps} from "@ionic-native/google-maps";
import {Facebook} from "@ionic-native/facebook";
import {GooglePlus} from "@ionic-native/google-plus";
import {Camera} from '@ionic-native/camera';
import {MyApp} from './app.component';
/*Utils */
import {TextareaAutoresize} from "../utils/equi-autoresize/autoresize.directive";
import {CDVPhotoLibraryPipe} from "../utils/equi-cdvphotolibrary/equi-cdvphotolibrary.pipe";
import {EquiButtonAdd} from "../utils/equi-button-add/equi-button-add";
import {EquiItemList} from "../utils/equi-item-list/equi-item-list";
import {EquiNextAlertHorse} from "../utils/equi-next-alert-horse/equi-next-alert-horse";
import {EquiHistoryAlertHorse} from "../utils/equi-history-alert-horse/equi-history-alert-horse";
import {EquiModalCaballos} from "../utils/equi-modal-caballos/equi-modal-caballos";
import {EquiModalGrupos} from "../utils/equi-modal-grupos/equi-modal-grupos";
import {EquiModalRecordatorio} from "../utils/equi-modal-recordatorio/equi-modal-recordatorio";
import {EquiOpcionesTelefonoPopover} from "../utils/equi-opciones-telefono/equi-opciones-telefono-popover";
import {EquiCalendar} from "../utils/equi-calendar/equi-calendar";
import {EquiCalendar2} from "../utils/equi-calendar2/equi-calendar2";
import {EquiPopoverFiltroCalendario} from "../utils/equi-popover-filtro-calendario/equi-popover-filtro-calendario";
import {EquiSelectImageModal} from '../utils/equi-modal-select-image/select-image-modal';
import {EquiModalFiltroCaballos} from '../utils/equi-modal-filtro-caballos/filtro-caballos-modal';
/*Home*/
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {RegistroPage} from "../pages/login/registro/registro";
import {MenuSuperior} from '../pages/home/subPages/menuSuperior/menuSuperior';
import {CaballosInd} from '../pages/home/subPages/caballosInd/caballosInd';
/* Notificaciones */
import {NotificacionesPage} from '../pages/notificaciones/notificaciones';
import {EdicionNotificacionGeneralPage} from "../pages/notificaciones/edicion-notificacion/edicion-notificacion";
import {NotificacionesViewPage} from '../pages/notificaciones/notificaciones-view';
import {NotificacionesInsertPage} from '../pages/notificaciones/notificaciones-insert';
import {NotificacionesExtendedInsertPage} from '../pages/notificaciones/notificaciones-extended-insert';
import {NotificacionGeneralDetalle} from "../pages/notificaciones/notificacion-general-detalle/notificacion-general-detalle";
import {NotificacionNotaDetalle} from "../pages/notificaciones/notificacion-nota-detalle/notificacion-nota-detalle";
import {NotificacionesEditPage} from "../pages/notificaciones/notificaciones-edit/notificaciones-edit";
/* Caballos */
import {FichaCaballoPage} from "../pages/home/ficha-caballo/ficha-caballo-home";
import {SegmentFichaCaballo} from "../pages/home/ficha-caballo/ficha/ficha-caballos";
import {OpcionesCaballoPopover} from "../pages/home/ficha-caballo/opciones-caballo/opciones-caballo";
import {CambioNombreCaballoPage} from "../pages/home/ficha-caballo/cambio-nombre/cambio-nombre";
import {AdminCaballosInsertPage} from "../pages/home/admin-caballos/admin-caballos-insert";
import {UbicacionCaballoPage} from "../pages/home/ficha-caballo/ubicacion/ubicacion";
import {AsignacionUbicacionCaballoPage} from "../pages/home/ficha-caballo/ubicacion/asignacion-ubicacion/asignacion-ubicacion";
import {OpcionesUbicacionModal} from "../pages/home/ficha-caballo/ubicacion/opciones-ubicacion/opciones-ubicacion";
import {FotoCaballoPage} from '../pages/home/ficha-caballo/foto-caballo/foto-caballo';
/* Caballos-Grupos */
import {GruposCaballos} from "../pages/home/subPages/grupos-caballos/grupos-caballos";
import {CreacionGrupoPage} from "../pages/home/subPages/grupos-caballos/creacion-grupo/creacion-grupo";
import {AdministracionGrupoPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/administracion-grupo";
import {UbicacionesGrupoPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/ubicaciones";
import {CaballosSinUbicacionPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/caballos-sin-ubicacion/caballos-sin-ubicacion";
import {DetalleEstabloPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/detalle-establo/detalle-establo";
import {PopoverOpcionesEstablo} from "../pages/home/subPages/grupos-caballos/administracion-grupo/ubicaciones/detalle-establo/popover-establo/popover-establo";
import {SegmentFichaGrupo} from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-ficha/segment-ficha";
import {AlertasFicha} from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/alertas-ficha";
import {EdicionAlertaPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/edicion-alerta/edicion-alerta";
import {SeleccionCaballosPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/seleccion-caballos/seleccion-caballos";
import {DetalleAlertaPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/alertas-ficha/detalle-alerta/detalle-alerta";
import {NotasFichaPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/notas-ficha";
import {EdicionNotaPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/edicion-nota/edicion-nota";
import {DetalleNotaPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/notas-ficha/detalle-nota/detalle-nota";
import {OpcionesFichaGrupo} from "../pages/home/subPages/grupos-caballos/administracion-grupo/opciones-ficha/opciones-ficha";
import {CambioNombrePage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/cambio-nombre/cambio-nombre";
import {SegmentCaballosGrupo} from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-caballos/segment-caballos";
import {EdicionCaballosGrupoPage} from "../pages/home/subPages/grupos-caballos/administracion-grupo/segment-caballos/edicion-caballos/edicion-caballos";
import {SegmentCalendarioGrupo} from '../pages/home/subPages/grupos-caballos/administracion-grupo/segment-calendario/calendario-grupo';
import {GrupoAlertasEditPage} from '../pages/home/subPages/grupos-caballos/administracion-grupo/segment-calendario/alertas-edit/grupo-alertas-edit';
import {FotoGrupoPage} from '../pages/home/subPages/grupos-caballos/administracion-grupo/foto-grupo/foto-grupo';
/* Caballos-ALimentacion */
import {AlimentacionPage} from "../pages/home/ficha-caballo/alimentacion/alimentacion";
import {AlimentacionEditPage} from "../pages/home/ficha-caballo/alimentacion/alimentacion-edit";
import {PopoverAlimentacionPage} from "../pages/home/ficha-caballo/alimentacion/pop-over/pop-over-alimentacion";
/* Caballos-Notas */
import {NotasPage} from "../pages/home/ficha-caballo/notas/notas";
/* Caballos-Datos */
import {DatosViewPage} from "../pages/home/ficha-caballo/datos/datos-view";
/* Caballos-Herrajes */
import {HerrajesPage} from "../pages/home/ficha-caballo/herrajes/herrajes";
/* Caballos-Dentista */
import {DentistaPage} from "../pages/home/ficha-caballo/dentista/dentista";
/* Caballos-Desparasitacion */
import {DesparasitacionPage} from "../pages/home/ficha-caballo/desparasitacion/desparasitacion";
import {EventosCaballoPage} from '../pages/home/ficha-caballo/eventos/eventos';
import {SegmentEventosProximos} from '../pages/home/ficha-caballo/eventos/segment-proximos/segment-proximos';
import {SegmentCalendarioEventos} from "../pages/home/ficha-caballo/eventos/segment-calendario/segment-calendario";
import {SegmentEventosHistorial} from '../pages/home/ficha-caballo/eventos/segment-historial/segment-historial';
import {DetalleEventoCaballoPage} from "../pages/home/ficha-caballo/eventos/detalle-evento/detalle-evento";
import {EdicionEventoCaballoPage} from '../pages/home/ficha-caballo/eventos/edicion-evento/edicion-evento';
/* Caballos-Calendario */
import {SegmentCalendarioCaballo} from '../pages/home/ficha-caballo/calendario/calendario-caballo';
import {CaballoAlertasEditPage} from '../pages/home/ficha-caballo/calendario/alertas-edit/caballo-alertas-edit';
/* Perfil */
import {PerfilPage} from "../pages/perfil/perfil";
import {SegmentDatos} from "../pages/perfil/datos/segment-datos";
import {EdicionPerfilPage} from "../pages/perfil/datos/edicion-perfil/edicion-perfil";
import {PopoverDatosPage} from '../pages/perfil/datos/pop-over/pop-over-datos';
import {OpcionesCuentaPage} from "../pages/perfil/datos/opciones-cuenta/opciones-cuenta";
import {CambioContrasenaPage} from "../pages/perfil/datos/opciones-cuenta/cambio-contrasena/cambio-contrasena";
import {TerminosPrivacidadPage} from "../pages/perfil/datos/opciones-cuenta/terminos-privacidad/terminos-privacidad";
import {ContactoPage} from "../pages/perfil/datos/opciones-cuenta/contacto/contacto";
import {RecomendacionPage} from "../pages/perfil/datos/opciones-cuenta/recomendacion/recomendacion";
import {PreguntasFrecuentesPage} from "../pages/perfil/datos/opciones-cuenta/preguntas-frecuentes/preguntas-frecuentes";
import {EliminacionCuentaPage} from "../pages/perfil/datos/opciones-cuenta/eliminacion-cuenta/eliminacion-cuenta";
import {FotoPerfilPage} from '../pages/perfil/datos/foto-perfil/foto-perfil';
/* Establos */
import {SegmentEstablos} from "../pages/perfil/establos/segment-establos";
import {AdminEstablosPage} from "../pages/perfil/establos/admin-establo/admin-establo";
import {CaballosEstabloModal} from "../pages/perfil/establos/admin-establo/caballos-establo/caballos-establo-modal";
import {MapaEstabloPage} from "../pages/perfil/establos/admin-establo/mapa-establo/mapa-establo";
import {BusquedaPosicionModal} from '../pages/perfil/establos/admin-establo/mapa-establo/busqueda-posiciones/busqueda-posiciones-modal';
import {InfoEstabloPage} from "../pages/perfil/establos/admin-establo/info-establo";
import {EdicionEstabloCaballosPage} from "../pages/perfil/establos/admin-establo/edicion-caballos";
/* Calendario */
import {CalendarioPage} from "../pages/calendario/calendario";
/* Camara */
import {CamaraPage} from "../pages/camara/camara";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegistroPage,
    HomePage,
    TabsPage,
    MenuSuperior,
    CaballosInd,
    /*Utils */
    TextareaAutoresize,
    CDVPhotoLibraryPipe,
    EquiButtonAdd,
    EquiItemList,
    EquiNextAlertHorse,
    EquiHistoryAlertHorse,
    EquiModalCaballos,
    EquiModalGrupos,
    EquiModalRecordatorio,
    EquiOpcionesTelefonoPopover,
    EquiCalendar,
    EquiCalendar2,
    EquiPopoverFiltroCalendario,
    EquiSelectImageModal,
    EquiModalFiltroCaballos,
    /* Notificaciones */
    NotificacionesPage,
    EdicionNotificacionGeneralPage,
    NotificacionesViewPage,
    NotificacionesInsertPage,
    NotificacionesExtendedInsertPage,
    NotificacionGeneralDetalle,
    NotificacionNotaDetalle,
    NotificacionesEditPage,
    /* Caballos */
    FichaCaballoPage,
    SegmentFichaCaballo,
    OpcionesCaballoPopover,
    CambioNombreCaballoPage,
    AdminCaballosInsertPage,
    UbicacionCaballoPage,
    AsignacionUbicacionCaballoPage,
    OpcionesUbicacionModal,
    FotoCaballoPage,
    /* Caballos-Grupos */
    GruposCaballos,
    CreacionGrupoPage,
    AdministracionGrupoPage,
    UbicacionesGrupoPage,
    CaballosSinUbicacionPage,
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
    SegmentCalendarioGrupo,
    EdicionCaballosGrupoPage,
    GrupoAlertasEditPage,
    FotoGrupoPage,
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
    EventosCaballoPage,
    DetalleEventoCaballoPage,
    EdicionEventoCaballoPage,
    SegmentEventosProximos,
    SegmentCalendarioEventos,
    SegmentEventosHistorial,
    /* Caballos-calendario*/
    SegmentCalendarioCaballo,
    CaballoAlertasEditPage,
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
    FotoPerfilPage,
    /* Establos */
    SegmentEstablos,
    AdminEstablosPage,
    CaballosEstabloModal,
    MapaEstabloPage,
    BusquedaPosicionModal,
    InfoEstabloPage,
    EdicionEstabloCaballosPage,
    /*Calendario*/
    CalendarioPage,
    /*Camara*/
    CamaraPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: "md",
      platforms: {
        ios: {
          statusbarPadding: true
        }
      }
    }),
    HttpModule,
    FormsModule,
    MomentModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    LoginPage,
    RegistroPage,
    /* Notificaciones */
    NotificacionesPage,
    EdicionNotificacionGeneralPage,
    NotificacionesViewPage,
    NotificacionesInsertPage,
    NotificacionesExtendedInsertPage,
    NotificacionGeneralDetalle,
    NotificacionNotaDetalle,
    NotificacionesEditPage,
    /* Caballos */
    FichaCaballoPage,
    OpcionesCaballoPopover,
    CambioNombreCaballoPage,
    AdminCaballosInsertPage,
    UbicacionCaballoPage,
    AsignacionUbicacionCaballoPage,
    OpcionesUbicacionModal,
    FotoCaballoPage,
    /* Caballos-Grupos */
    CreacionGrupoPage,
    AdministracionGrupoPage,
    UbicacionesGrupoPage,
    CaballosSinUbicacionPage,
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
    GrupoAlertasEditPage,
    FotoGrupoPage,
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
    EventosCaballoPage,
    DetalleEventoCaballoPage,
    EdicionEventoCaballoPage,
    /*calendario caballos*/
    CaballoAlertasEditPage,
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
    FotoPerfilPage,
    /* Establos */
    AdminEstablosPage,
    CaballosEstabloModal,
    MapaEstabloPage,
    BusquedaPosicionModal,
    InfoEstabloPage,
    EdicionEstabloCaballosPage,
    /*Utils */
    EquiModalCaballos,
    EquiModalGrupos,
    EquiModalRecordatorio,
    EquiOpcionesTelefonoPopover,
    EquiPopoverFiltroCalendario,
    EquiSelectImageModal,
    EquiModalFiltroCaballos,
    /*Calendario*/
    CalendarioPage,
    /*Camara*/
    CamaraPage
  ],
  providers: [
    GoogleMaps,
    Facebook,
    GooglePlus,
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
