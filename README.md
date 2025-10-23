# README.md: TLAXICOM - Especificaciones Técnicas

Este documento detalla la arquitectura y la implementación de la autenticación de usuarios y la integración del inicio de sesión único (SSO) mediante Google OAuth 2.0 (Vinculación de Cuentas) para el sistema de administración.

---

## 1. Arquitectura del Sistema

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Angular 19+ (Standalone) | Interfaz de usuario y manejo del flujo de Google Identity Services (GIS). |
| **Backend** | Spring Boot (Java) | Servicios REST, **Vinculación de Cuentas** y generación de JWT de TLAXICOM. |
| **Base de Datos** | Cloud Firestore | Almacenamiento de usuarios/empleados registrados. |
| **Autenticación** | Google OAuth 2.0 / GIS | Proceso de verificación de identidad. |

---

## 2. Integración de Google OAuth 2.0: Vinculación de Cuentas (Account Linking)

La estrategia de seguridad implementada restringe el acceso solo a **usuarios (empleados) pre-registrados** en Firestore. El proceso utiliza el ID Token de Google para verificar la identidad antes de emitir un token de sesión de TLAXICOM.

### 2.1. Flujo de Autenticación (`/public/auth/google`)

| Paso | Origen / Destino | Resumen de la Acción |
| :--- | :--- | :--- |
| **1. Captura de Token** | Frontend (GIS) | El SDK de Google llama a la función global **`googleCallbackHandler`**, extrayendo el `idToken` (JWT de Google). |
| **2. Petición REST**| Angular $\rightarrow$ Spring Boot | Se realiza un `POST` al *endpoint* `/public/auth/google` enviando el `idToken`. |
| **3. Verificación** | `GoogleTokenVerifier` | Valida la autenticidad del `idToken` y extrae el *payload* (email, nombre, `fotoUrl`). |
| **4. Vinculación** | `AuthService` $\rightarrow$ Firestore | Se ejecuta `UsuarioRepository.findByEmail(email)`. **Si el email NO existe en Firestore, se niega el acceso (Unauthorized).** |
| **5. Respuesta** | Spring Boot $\rightarrow$ Angular | Si es exitoso, el `AuthService` genera un **JWT de TLAXICOM** y devuelve la respuesta en la estructura JSON **`LoginResponseDto`**, incluyendo `nombre`, `apPaterno` y `fotoUrl` obtenidos del *payload* de Google. |

---

## 3. Especificaciones Técnicas del Backend (Java/Spring Boot)

### 3.1. Clases y Lógica Central

| Clase | Rol Principal | Detalles de Implementación |
| :--- | :--- | :--- |
| `GoogleLoginRequest` | DTO de Petición | `record` que modela el payload JSON `{"idToken": "..."}`. |
| `GoogleTokenVerifier` | Verificador | Utiliza la librería de Google para validar el `idToken` y extraer el `Payload` (datos de usuario y foto). |
| `AuthService` | Lógica de Negocio | Implementa **`loginWithGoogle()`**: maneja la excepción de "Usuario no encontrado" de Firestore para restringir el acceso. Reutiliza la lógica de JWT y la estructura de respuesta (`LoginResponseDto`). |
| `AuthController` | API REST | Expone el *endpoint* `/public/auth/google`. |

### 3.2. Configuración de Seguridad

La configuración en `SecurityConfig.java` permite que el filtro de JWT funcione sin interrumpir las peticiones públicas.

* **Exclusión de Rutas:** `.requestMatchers("/public/**").permitAll()` asegura que el `JwtAuthenticationFilter` no lance errores de token en peticiones de login.

---

## 4. Especificaciones Técnicas del Frontend (Angular 19+)

### 4.1. Configuración GIS y Botón

| Elemento | Ubicación | Función / Detalle Técnico |
| :--- | :--- | :--- |
| **Carga de SDK** | `index.html` | `<script src="https://accounts.google.com/gsi/client" async defer></script>` para cargar el SDK de Google de forma global. |
| **Botón GIS** | `login.component.html` | Usa el contenedor `div class="g_id_signin"` con **`data-shape="pill"`** para el diseño de cápsula. |
| **Enganche Callback** | `login.component.ts` | La función global `window.googleCallbackHandler` captura el `idToken` de Google y llama al servicio Angular. |
| **Redibujo** | `login.component.ts` (`ngAfterViewInit`) | Se utiliza `google.accounts.id.renderButton()` para **forzar el redibujo** del botón al navegar de vuelta al login (solucionando el problema de las SPA). |

### 4.2. Persistencia y UX

* **Servicio:** El método `LoginConGoogle(idToken)` realiza la llamada REST.
* **Datos de Usuario:** El método `processLogin` (común a ambos logins) almacena el **`token`**, `email`, nombre y la **`fotoUrl`** (obtenida del *payload* de Google) en **`sessionStorage`**.
* **Avatar UX:** El *header* utiliza un contenedor CSS **`.profile-avatar-container`** con `border-radius: 50%` y una lógica **`*ngIf`** para mostrar la foto de perfil (si existe) o el `mat-icon` por defecto.