export class PoligonoModel {
  idPoligono: number;
  idTipo: number; 
  tipo: string;  
  nombre:string;
  poligono: any[];

  constructor() {
        this.idPoligono = 0;
        this.idTipo = 0;
        this.tipo = "";
        this.nombre = "";
        this.poligono = [];
    }
}