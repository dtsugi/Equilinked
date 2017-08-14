import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'menu-superior',
  templateUrl: 'menuSuperior.html'
})
export class MenuSuperior implements OnInit {
  private mapMenus: Map<number, any>;
  @Output() menuChange = new EventEmitter();
  lastMenu: string;
  menu: string;
  lastSubmenu: string;
  subMenu: string;

  constructor() {
    this.lastMenu = "caballos"
    this.menu = "caballos";
    this.lastSubmenu = "caballos_ind";
    this.subMenu = "caballos_ind";
  }

  ngOnInit(): void {
    this.mapMenus = new Map<number, any>();
    this.mapMenus.set(0, {submenu: "caballos_ind", menu: "caballos"});
    this.mapMenus.set(1, {submenu: "caballos_gru", menu: "caballos"});
    this.mapMenus.set(2, {submenu: "veterinarios_ind", menu: "veterinarios"});
    this.mapMenus.set(3, {submenu: "fotos_todas", menu: "fotos"});
    this.mapMenus.set(4, {submenu: "fotos_albums", menu: "fotos"});
  }

  /*Consolan la seleccion inferior segun los elementos seleccionados*/
  menuChanged(menu: any): void {
    if (this.lastMenu != menu) {
      this.lastMenu = menu;
      let submenu: string;
      switch (this.menu) {
        case "caballos":
          submenu = "caballos_ind";
          break;
        case "veterinarios":
          submenu = "veterinarios_ind";
          break;
        case "fotos":
          submenu = "fotos_todas";
          break;
      }
      this.subMenu = submenu;
      this.lastSubmenu = submenu;
      this.menuChange.emit({value: this.subMenu});
    }
  }

  /*Controla la selección de los menus superiores segun la seleccion */
  subMenuChanged(submenu: any): void {
    if (submenu != this.lastSubmenu) {
      this.lastSubmenu = submenu;
      let menu: string;
      switch (submenu) {
        case "caballos_ind":
        case "caballos_gru":
          menu = "caballos";
          break;
        case "veterinarios_ind":
          this.menu = "veterinarios";
          break;
        case "fotos_todas":
        case "fotos_albums":
          menu = "fotos"
          break;
      }
      this.menu = menu;
      this.lastMenu = menu;
      this.menuChange.emit({value: submenu});
    }
  }

  /*Método para cambiar los valores de los segments desde afuera */
  changeSubmenuByIndex(index: number): void {
    let subMenu: any = this.mapMenus.get(index);
    if (this.lastSubmenu != subMenu.submenu) {
      this.subMenu = subMenu.submenu;
      this.menu = subMenu.menu;
      this.lastSubmenu = this.subMenu;
      this.lastMenu = this.menu;
    }
  }
}
