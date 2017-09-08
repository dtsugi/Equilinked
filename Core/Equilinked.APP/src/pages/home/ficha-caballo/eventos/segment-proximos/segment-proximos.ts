import {Component, Input, OnInit} from '@angular/core';
import {NavController, Events} from 'ionic-angular';
import {CommonService} from '../../../../../services/common.service';
import {AlertaCaballoService} from '../../../../../services/alerta.caballo.service';
import {LanguageService} from '../../../../../services/language.service';
import {SecurityService} from '../../../../../services/security.service';
import {UserSessionEntity} from '../../../../../model/userSession';
import {ConstantsConfig} from "../../../../../app/utils";
import {DetalleEventoCaballoPage} from "../detalle-evento/detalle-evento";
import moment from "moment";
import "moment/locale/es";

@Component({
  selector: 'segment-eventos-prox',
  templateUrl: 'segment-proximos.html',
  providers: [LanguageService, CommonService, AlertaCaballoService, SecurityService]
})
export class SegmentEventosProximos implements OnInit {
  private session: UserSessionEntity;
  private eventosRespaldo: Array<any>;
  @Input("caballo") caballo: any;
  eventos: Array<any>;
  dateMillis: number;
  loading: boolean;
  labels: any = {};
  isFilter: boolean;

  constructor(public navController: NavController,
              private commonService: CommonService,
              private alertaCaballoService: AlertaCaballoService,
              private events: Events,
              private securityService: SecurityService,
              private languageService: LanguageService) {
    this.isFilter = false;
    this.loading = true;
    this.eventosRespaldo = new Array<any>();
  }

  ngOnInit(): void {
    this.session = this.securityService.getInitialConfigSession();
    this.languageService.loadLabels().then(labels => {
      this.labels = labels;
      this.loadEventos();
    });
  }

  filter(evt: any): void {
    this.isFilter = false;
    this.eventosRespaldo.forEach(pn => {
      pn.FechaCortaFilter = pn.FechaCorta;
      pn.DiaFilter = pn.Dia;
      pn.Notificaciones.forEach(n => {
        n.TituloFilter = n.Titulo;
        n.UbicacionFilter = n.Ubicacion;
        n.HoraFilter = n.Hora;
      });
    });
    let value: string = evt ? evt.target.value : null;
    if (value) {
      let mapDates: Map<string, any> = new Map<string, any>();
      this.eventosRespaldo.forEach(pn => {
        let notificacionDia: any;
        pn.Notificaciones.forEach(n => {
          let indexTitulo = n.Titulo.toUpperCase().indexOf(value.toUpperCase());
          let indexUbicacion = n.Ubicacion ? n.Ubicacion.toUpperCase().indexOf(value.toUpperCase()) : -1;
          let indexHora = n.Hora.toUpperCase().indexOf(value.toUpperCase());
          if (indexTitulo > -1 || indexUbicacion > -1 || indexHora > -1) { //Alguna parte dela notificacion corresponde al texto buscado?
            if (!mapDates.has(pn.Fecha)) {
              notificacionDia = {
                Fecha: pn.Fecha,
                Dia: pn.Dia,
                DiaFilter: pn.Dia,
                FechaCorta: pn.FechaCorta,
                FechaCortaFilter: pn.FechaCorta,
                Notificaciones: []
              };
              mapDates.set(pn.Fecha, notificacionDia);
            }
            mapDates.get(pn.Fecha).Notificaciones.push(n);
            if (indexTitulo > -1) {
              let textReplace = n.Titulo.substring(indexTitulo, indexTitulo + value.length);
              n.TituloFilter = n.Titulo.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
            if (n.Ubicacion && indexUbicacion > -1) {
              let textReplace = n.Ubicacion.substring(indexUbicacion, indexUbicacion + value.length);
              n.UbicacionFilter = n.Ubicacion.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
            if (indexHora > -1) {
              let textReplace = n.Hora.substring(indexHora, indexHora + value.length);
              n.HoraFilter = n.Hora.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
            }
          }
        });
        let notificacionDiaTemp = !notificacionDia ? pn : notificacionDia;
        let indexFechaCorta = notificacionDiaTemp.FechaCorta.toUpperCase().indexOf(value.toUpperCase());
        let indexDia = notificacionDiaTemp.Dia.toUpperCase().indexOf(value.toUpperCase());
        if (indexFechaCorta > -1) {
          let textReplace = notificacionDiaTemp.FechaCorta.substring(indexFechaCorta, indexFechaCorta + value.length);
          notificacionDiaTemp.FechaCortaFilter = notificacionDiaTemp.FechaCorta.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (indexDia > -1) {
          let textReplace = notificacionDiaTemp.Dia.substring(indexDia, indexDia + value.length);
          notificacionDiaTemp.DiaFilter = notificacionDiaTemp.Dia.replace(textReplace, '<span class="equi-text-black">' + textReplace + '</span>');
        }
        if (!notificacionDia && (indexFechaCorta > -1 || indexDia > -1)) {
          mapDates.set(pn.Fecha, notificacionDiaTemp);
        }
      });
      this.eventos = Array.from(mapDates.values());
      this.isFilter = true;
    } else {
      this.eventos = this.eventosRespaldo;
    }
  }

  view(evento: any): void {
    this.navController.push(DetalleEventoCaballoPage, {alertaId: evento.ID});
  }

  delete(evento: any): void {
    this.commonService.showLoading(this.labels["PANT007_ALT_CARG"]);
    this.alertaCaballoService.deleteAlertasCaballosByIds(this.session.PropietarioId, this.caballo.ID, [evento.ID])
      .then(() => {
        this.events.publish("notificaciones:refresh");
        this.commonService.hideLoading();
        this.loadEventos();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  loadEventos(): void {
    this.loading = true;
    this.dateMillis = new Date().getTime();
    let fecha: string = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.alertaCaballoService.getAlertasByCaballoId(this.session.PropietarioId, this.caballo.ID, fecha, null,
      [ConstantsConfig.ALERTA_TIPO_EVENTOS], null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE
    ).then(alertas => {
      let mapDates: Map<string, any> = new Map<string, any>();
      let day: any;
      alertas.forEach(nn => {
        let d = new Date(nn.FechaNotificacion);
        nn.Hora = moment(d).format("hh:mm A").toUpperCase();
        let date: string = moment(d).format("dddd-DD MMMM");
        if (!mapDates.has(date)) {
          let partsDate: any = date.split("-");
          day = {
            Fecha: date,
            Dia: partsDate[0].charAt(0).toUpperCase() + partsDate[0].slice(1),
            FechaCorta: partsDate[1].toUpperCase().substring(0, 6),
            Notificaciones: []
          };
          mapDates.set(date, day);
        }
        day = mapDates.get(date);
        day.Notificaciones.push(nn);
      });
      this.eventosRespaldo = Array.from<any>(mapDates.values());
      this.filter(null);
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loading = false;
    });
  }
}
