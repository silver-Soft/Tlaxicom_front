export class ContratoModel {
    idContrato: number; 
    activo: boolean;
    nombre: string | null;
    apPaterno: string | null;
    apMaterno: string | null;
    domicilio: string | null;
    numExterior: string | null;
    numInterior: string | null;
    colonia: string | null;
    municipio: string | null;
    estado: string | null;
    cp: string | null;
    telefono: string | null;
    idPaquete: number;
    tarifa: number;
    marcaModem: string | null;
    modeloModem: string | null;
    noSerieModem: string | null;
    cantEquipos: number;
    fechaInstalacion: Date;
    horaInstalacion: string | null; 
    idMetodoPago: number;
    serviciosAdicionales: boolean;
    cuentaEmail: boolean;
    email: string | null;

    constructor() {
        this.idContrato = 0;
        this.activo = true;
        this.nombre = null;
        this.apPaterno = null;
        this.apMaterno = null;
        this.domicilio = null;
        this.numExterior = null;
        this.numInterior = null;
        this.colonia = null;
        this.municipio = null;
        this.estado = null;
        this.cp = null;
        this.telefono = null;
        this.idPaquete = 0;
        this.tarifa = 0.0;
        this.marcaModem = null;
        this.modeloModem = null;
        this.noSerieModem = null;
        this.cantEquipos = 0;
        this.fechaInstalacion = new Date();
        this.horaInstalacion = null;
        this.idMetodoPago = 0;
        this.serviciosAdicionales = false;
        this.cuentaEmail = false;
        this.email = null;
    }
}