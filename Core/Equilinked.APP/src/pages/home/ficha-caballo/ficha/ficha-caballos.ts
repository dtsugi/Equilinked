import {Component, Input, OnInit} from "@angular/core";
import {NavController} from 'ionic-angular'
import {DatosViewPage} from '../datos/datos-view';
import {AlimentacionPage} from '../alimentacion/alimentacion';
import {NotasPage} from '../notas/notas';
import {HerrajesPage} from '../herrajes/herrajes';
import {DentistaPage} from '../dentista/dentista';
import {DesparasitacionPage} from '../desparasitacion/desparasitacion';
import {EventosCaballoPage} from '../eventos/eventos';
import {UbicacionCaballoPage} from "../ubicacion/ubicacion";
import {AsignacionUbicacionCaballoPage} from "../ubicacion/asignacion-ubicacion/asignacion-ubicacion";

@Component({
  selector: "segment-ficha-caballo",
  templateUrl: "./ficha-caballos.html"
})
export class SegmentFichaCaballo implements OnInit {
  @Input("caballo") caballo: any;
  opcionesFicha: Array<any>;

  constructor(private navController: NavController) {
  }

  ngOnInit(): void {
    this.loadOptions();
  }

  open(index: number): void {
    let option: any = this.opcionesFicha[index];
    if (option && option.page) {
      this.navController.push(option.page, option.params);
    }
  }

  private loadOptions(): void {
    this.opcionesFicha = [
      {
        page: DatosViewPage, params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      },
      {
        page: this.caballo.Establo_ID ? UbicacionCaballoPage : AsignacionUbicacionCaballoPage,
        params: {caballo: this.caballo}
      },
      {},
      {
        page: EventosCaballoPage,
        params: {caballo: this.caballo}
      },
      {
        page: HerrajesPage,
        params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      },
      {
        page: AlimentacionPage,
        params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      },
      {
        page: DesparasitacionPage,
        params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      },
      {
        page: DentistaPage,
        params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      },
      {
        page: NotasPage, params: {idCaballoSelected: this.caballo.ID, nombreCaballoSelected: this.caballo.Nombre}
      }
    ];
  }
}
