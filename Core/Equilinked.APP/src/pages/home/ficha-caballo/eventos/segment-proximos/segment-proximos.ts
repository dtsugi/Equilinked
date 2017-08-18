import {Component, Input, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
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

  constructor(public navController: NavController,
              private commonService: CommonService,
              private alertaCaballoService: AlertaCaballoService,
              private securityService: SecurityService,
              private languageService: LanguageService) {
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
    let textFilter: string = evt.target.value;
    if (textFilter) {
      let value = textFilter.toUpperCase();
      let mapDates: Map<string, any> = new Map<string, any>();
      this.eventosRespaldo.forEach(pn => {
        if (pn.FechaCorta.toUpperCase().indexOf(value) > -1
          || pn.Dia.toUpperCase().indexOf(value) > -1) { //El dia corresponde al texto buscado?
          mapDates.set(pn.Fecha, pn);
        } else {
          pn.Notificaciones.forEach(n => {
            if (n.Hora.toUpperCase().indexOf(value) > -1
              || (n.Ubicacion != null && n.Ubicacion.toUpperCase().indexOf(value) > -1)
              || (n.Titulo != null && n.Titulo.toUpperCase().indexOf(value) > -1)) { //Alguna parte dela notificacion corresponde al texto buscado?
              if (!mapDates.has(pn.Fecha)) {
                let notificacionDia = {
                  Fecha: pn.Fecha,
                  Dia: pn.Dia,
                  FechaCorta: pn.FechaCorta,
                  Notificaciones: []
                };
                mapDates.set(pn.Fecha, notificacionDia);
              }
              mapDates.get(pn.Fecha).Notificaciones.push(n);
            }
          });
        }
      });
      this.eventos = Array.from(mapDates.values());
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
        this.commonService.hideLoading();
        this.loadEventos();
      }).catch(err => {
      this.commonService.ShowErrorHttp(err, this.labels["PANT007_MSG_ERRELI"]);
    });
  }

  loadEventos(): void {
    this.loading = true;
    this.dateMillis = new Date().getTime();
    let today = moment();
    this.alertaCaballoService.getAlertasByCaballoId(this.session.PropietarioId, this.caballo.ID, today.format("YYYY-MM-DD"),
      ConstantsConfig.ALERTA_TIPO_EVENTOS, ConstantsConfig.ALERTA_FILTER_NEXT, null, ConstantsConfig.ALERTA_ORDEN_ASCENDENTE
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
      this.eventos = Array.from<any>(mapDates.values());
      this.eventosRespaldo = this.eventos;
      this.loading = false;
    }).catch(err => {
      console.error(err);
      this.commonService.ShowInfo(this.labels["PANT007_MSG_ERRALT"]);
      this.loading = false;
    });
  }
}
