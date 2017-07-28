import { Component, Output, EventEmitter } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'menu-superior',
  templateUrl: 'menuSuperior.html'
})
export class MenuSuperior {
  @Output() menuChange = new EventEmitter();
  menu: string;
  subMenu: string;

  constructor(private translate: TranslateService) {
    this.menu = 'caballos';
    this.subMenu = 'caballos_ind';
  }

  onSegmentChanged(selectedItem): void {
    if (this.subMenu.indexOf(this.menu) >= 0) {
      this.menuChange.emit({ value: this.subMenu })
      return;
    }

    switch (this.menu) {
      case 'caballos':
        this.subMenu = 'caballos_ind';
        break;
      case 'veterinarios':
        this.subMenu = 'veterinarios_ind';
        break;
      case 'fotos':
        this.subMenu = 'fotos_todas';
        break;
      default:
        break;
    };
    this.menuChange.emit({ value: this.subMenu })
  };
}