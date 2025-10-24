export class LoginResponseDto {
    resultado: boolean;
    mensaje: string | null;
    stackTrace: string | null;
    obj: UsuarioDto;         

    constructor() {        
        this.resultado = false;
        this.mensaje = null;
        this.stackTrace = null;
        this.obj = new UsuarioDto();
    }
}

export class Privilegio{
    idPrivilegio: number;
    nombre: string;

    constructor() {
        this.idPrivilegio = 0;
        this.nombre = ""
    }
}

export class UsuarioDto{
    nombre: string | null;
    apPaterno: string | null;
    apMaterno: string | null;
    email: string;
    idRol: number;
    lstPrivilegios: Privilegio[];
    token: string;
    fotoUrl?: string;

    constructor() {
        this.nombre = null
        this.apPaterno = null
        this.apMaterno = null
        this.email = ""
        this.idRol = 0
        this.lstPrivilegios = []
        this.token = ""
        this.fotoUrl = ""
    }
}
