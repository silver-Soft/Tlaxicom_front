import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../services/core/notification.service';
import { LoginUsuarioService } from '../../../services/core/login.service';
import { LoginResponseDto } from '../../../DTOs/response/loginResponseDto';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../DTOs/request/loginRequest';
import { NavBarService } from '../../../services/core/navBar.service';

// Declaración global para exponer el manejador
declare global {
  interface Window {
    googleCallbackHandler: (response: { credential: string }) => void;
  }
}

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule,
    FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginComponent implements OnInit{
  loginFormGroup!: FormGroup;

  userData: LoginResponseDto = new LoginResponseDto();

  
  constructor(
    private _formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private loginUsuarioService: LoginUsuarioService,
    private router: Router,
    private servicioNavBar: NavBarService,
  ) {
    this.loginFormGroup = this._formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    
    if (typeof window !== 'undefined') {
        window.googleCallbackHandler = this.handleGoogleCredentialResponse.bind(this);
    }
  }
  ngOnInit(): void {    
    if(this.loginUsuarioService.obtenerToken()!=null){
      this.router.navigate(['/dashboard'])    
    }
  }

  validarFormulario(form: any) {
    if (form.valid) {
      this.logueoUsuario()
    }
    else {
      this.notificationService.pushError('Por favor, ingrese sus credenciales completas.');
    }
  }

  
  //MANEJADOR DEL CALLBACK: Toma el token de Google y lo envía a tu backend.
  handleGoogleCredentialResponse(response: { credential: string }): void {
    const idToken = response.credential;
    
    if (idToken) {        
        this.loginUsuarioService.LoginConGoogle(idToken).subscribe({
            next: (data: LoginResponseDto) => {
                // Si el backend validó que el email existe en Firestore, processLogin se ejecuta
                this.processLogin(data);
            },
            error: (err) => {
                // El error proviene del backend, indicando que el email no se encontró en Firestore
                console.error('Error de Vinculación de Cuentas:', err);
                this.notificationService.pushError("Acceso denegado: Tu cuenta de Google no está registrada como empleado.");
            }
        });
    }
  }

  // Método para manejar la lógica a ambos logins
  private processLogin(data: LoginResponseDto): void {
    this.userData = data; // Asignar la respuesta a tu propiedad global (si existe)

    if (this.userData.resultado === true) {
      sessionStorage.clear();
      localStorage.clear();
      
      const nombreCompleto = `${this.userData.obj.nombre} ${this.userData.obj.apPaterno} ${this.userData.obj.apMaterno}`;
      
      // Almacenamiento de datos del JSON
      sessionStorage.setItem("token", this.userData.obj.token);
      sessionStorage.setItem("email", this.userData.obj.email);
      sessionStorage.setItem("usuario", nombreCompleto);
      sessionStorage.setItem("idRol", this.userData.obj.idRol.toString());
      
      this.servicioNavBar.triggerLogin.emit(true);
      this.router.navigate(['/dashboard']);
      this.notificationService.pushSuccess("Bienvenido " + this.userData.obj.nombre);
    } else {
      this.notificationService.pushError(this.userData.mensaje);
    }
  }

  //Implementación del manejo de Login Normal
  logueoUsuario(): void {
    if (this.loginUsuarioService.obtenerToken()) {
      // Si ya hay token válido, redirige.
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Si no hay token, procede con el login de usuario/contraseña
    const usuario: LoginRequest = this.loginFormGroup.value;

    this.loginUsuarioService.UsuarioLogueo(usuario).subscribe({
      next: (data: LoginResponseDto) => this.processLogin(data),
      error: (err) => this.notificationService.pushError("Error de conexión o credenciales.")
    });
  }

  /*logueoUsuario() {
    if (this.loginUsuarioService.obtenerToken()) {
      this.notificationService.pushSuccess("Bienvenido " + this.userData.obj.nombre)
      this.servicioNavBar.triggerLogin.emit(true) //emitir evento de que hay sesion
      //dirigir usario al dashboard
      this.router.navigate(['/dashboard'])
    } else {
      const usuario:LoginRequest = this.loginFormGroup.value

      this.loginUsuarioService.UsuarioLogueo(usuario).subscribe((data: LoginResponseDto) => {
        this.userData = data;

        if (this.userData.resultado === true) {
          sessionStorage.clear();
          localStorage.clear();
          const nombreCompleto = this.userData.obj.nombre + " " + this.userData.obj.apPaterno + " " + this.userData.obj.apMaterno
          sessionStorage.setItem("token", this.userData.obj.token);
          sessionStorage.setItem("email", this.userData.obj.email);          
          sessionStorage.setItem("usuario", nombreCompleto)
          sessionStorage.setItem("idRol", this.userData.obj.idRol.toString())   
          this.servicioNavBar.triggerLogin.emit(true)       
          this.router.navigate(['/dashboard'])
          this.notificationService.pushSuccess("Bienvenido " + this.userData.obj.nombre)
        } else {
          this.notificationService.pushError(this.userData.mensaje)
        }
      });
    }
  }*/

  recuperaPassword() {

  }
}
