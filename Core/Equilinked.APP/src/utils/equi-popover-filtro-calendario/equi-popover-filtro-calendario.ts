import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';

@Component({
  templateUrl: 'equi-popover-filtro-calendario.html'
})
export class EquiPopoverFiltroCalendario {
  public options: any;

  constructor(public navParams: NavParams,
              public viewController: ViewController) {
    this.options = {};
  }

  ngOnInit() {
    this.options = this.navParams.get("options");
    this.options.modified = false;//lo marcamos como no modificado!
  }

  selectType(alertType: any): void {
    this.options.modified = true;//marcamos como modificado
    alertType.checked = !alertType.checked;
    if (!alertType.id) { //si no tiene id es que es "todos" por lo tanto del estado que seleccione marcamos todos
      this.options.alertTypes.forEach(type => {
        type.checked = alertType.checked;
      });
    } else {
      let statusAll: boolean = true;
      let i = 1;
      while (statusAll && i < this.options.alertTypes.length) {
        statusAll = this.options.alertTypes[i].checked;
        i++;
      }
      this.options.alertTypes[0].checked = statusAll;
    }
  }
}
