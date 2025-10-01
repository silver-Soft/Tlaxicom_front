export class PaqueteModel {
      idPaquete: number;
      background: string | null;
      title: string;
      speed: string;
      headerTextColor: string;
      headerBackground: string;
      mode: string;
      idTipo: number;
      tipo: string;
      costo: number;
      features: Feaatures;
      buttons: Buttons;

  constructor() {
        this.idPaquete = 0;
        this.background = null;
        this.title = "";
        this.speed = "";
        this.headerTextColor = "";
        this.headerBackground = "";
        this.mode = "";
        this.idTipo = 0;
        this.tipo = "";
        this.costo = 0.0;
        this.features = new Feaatures();
        this.buttons = new Buttons();
    }
}

export class Feaatures {
    banner: string;
    info: string;
    folio: string;
    textColor: string;

  constructor() {
        this.banner = "";
        this.info = "";
        this.folio = "";
        this.textColor = "";
    }
}

class Buttons {
    showContratar: Boolean;
    showInfo: Boolean;

  constructor() {
        this.showContratar = false;
        this.showInfo = false;
    }
}

