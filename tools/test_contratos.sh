#!/usr/bin/env bash
# Pruebas funcionales del modulo /contratos contra el entorno local (dev/up.sh).
# Uso: tools/test_contratos.sh [base]   (por defecto http://localhost:8080)
# Crea y borra usuarios "tmp_test_*". NO usar contra produccion.
BASE="${1:-http://localhost:8080}/contratos"
CJ="$(mktemp)"; CJ2="$(mktemp)"; CH="$(mktemp)"; fail=0
ok()   { echo "OK   $1"; }
bad()  { echo "FAIL $1"; fail=1; }
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
check() { # descripcion esperado obtenido
  [ "$2" = "$3" ] && ok "$1 ($3)" || bad "$1 (esperado $2, obtenido $3)"; }
token() { curl -s -b "$1" -c "$1" "$BASE/$2" | sed -n 's/.*name="csrf" value="\([^"]*\)".*/\1/p' | head -1; }

limpiar_rl() { docker exec tlaxicom-web-1 sh -c "rm -f /tmp/tlaxicom_storage/rl_*.json" >/dev/null 2>&1; }
limpiar_rl
echo "== Acceso sin sesion"
for p in dashboard.php bienvenido.php lista_usuarios.php registro.php; do
  check "$p sin sesion redirige" 302 "$(code "$BASE/$p")"
done
check "POST procesar_bienvenido sin sesion" 302 "$(code -X POST "$BASE/procesar_bienvenido.php")"
check "procesar_accion_usuario por GET sin sesion" 302 "$(code "$BASE/procesar_accion_usuario.php?id=1&accion=eliminar")"

echo "== Archivos internos bloqueados"
for p in lib/bootstrap.php lib/config.php TCPDF/tcpdf.php PHPMailer/src/PHPMailer.php config.example.php composer.json package.json README.md conexion_test.php gd.php; do
  c=$(code "$BASE/$p"); [ "$c" = 403 ] || [ "$c" = 404 ] && ok "$p bloqueado ($c)" || bad "$p accesible ($c)"
done

echo "== Login"
T=$(token "$CJ" login.php)
check "login sin CSRF" 403 "$(code -b "$CJ" -c "$CJ" -d usuario=admin_dev -d contrasena=dev-pass-123 "$BASE/procesar_login.php")"
check "login incorrecto vuelve al formulario" 302 "$(code -b "$CJ" -c "$CJ" -d "csrf=$T" -d usuario=admin_dev -d contrasena=mala "$BASE/procesar_login.php")"
curl -s -b "$CJ" -c "$CJ" "$BASE/login.php" | grep -q "incorrectos" && ok "mensaje generico de error" || bad "mensaje de error no mostrado"
T=$(token "$CJ" login.php)
r=$(curl -s -b "$CJ" -c "$CJ" -o /dev/null -w '%{http_code} %{redirect_url}' -d "csrf=$T" -d usuario=admin_dev -d contrasena=dev-pass-123 "$BASE/procesar_login.php")
case "$r" in "302 "*dashboard.php) ok "login correcto -> dashboard";; *) bad "login correcto: $r";; esac
check "dashboard con sesion" 200 "$(code -b "$CJ" "$BASE/dashboard.php")"
curl -s -b "$CJ" "$BASE/dashboard.php" | grep -q "Lista de Usuarios" && ok "admin ve menu de usuarios" || bad "menu admin"
curl -sI -b "$CJ" "$BASE/dashboard.php" | tr -d '\r' | grep -qi "x-frame-options: DENY" && ok "cabeceras de seguridad" || bad "cabeceras"

echo "== Operador (sin privilegios)"
T2=$(token "$CJ2" login.php)
curl -s -b "$CJ2" -c "$CJ2" -o /dev/null -d "csrf=$T2" -d usuario=operador_dev -d contrasena=dev-pass-123 "$BASE/procesar_login.php"
check "operador abre dashboard" 200 "$(code -b "$CJ2" "$BASE/dashboard.php")"
curl -s -b "$CJ2" "$BASE/dashboard.php" | grep -q "Lista de Usuarios" && bad "operador ve menu admin" || ok "operador no ve menu admin"
check "operador no entra a lista_usuarios" 403 "$(code -b "$CJ2" "$BASE/lista_usuarios.php")"
check "operador no entra a registro" 403 "$(code -b "$CJ2" "$BASE/registro.php")"
check "operador abre formulario de contrato" 200 "$(code -b "$CJ2" "$BASE/bienvenido.php")"

echo "== Registro de usuarios (admin)"
T=$(token "$CJ" registro.php); U="tmp_test_$$"
reg() { curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d "nuevo_usuario=$1" -d "nueva_contrasena=$2" -d tipo_usuario=activo -d con_privilegios="${3:-0}" "$BASE/procesar_registro.php"; curl -s -b "$CJ" -c "$CJ" "$BASE/registro.php" | grep -o -E "Usuario registrado correctamente|ya existe|al menos 10|3 a 50|no válidos|Datos incompletos" | head -1; }
[ "$(reg "$U" corta1)" = "al menos 10" ] && ok "contrasena debil rechazada" || bad "contrasena debil"
[ "$(reg "mal usuario!" Contrasena12345)" = "3 a 50" ] && ok "usuario invalido rechazado" || bad "usuario invalido"
[ "$(reg "$U" Contrasena12345 7)" = "no válidos" ] && ok "privilegios fuera de lista rechazados" || bad "privilegios"
[ "$(reg "$U" Contrasena12345)" = "Usuario registrado correctamente" ] && ok "usuario creado" || bad "creacion"
[ "$(reg "$U" Contrasena12345)" = "ya existe" ] && ok "duplicado detectado" || bad "duplicado"
check "registro sin CSRF" 403 "$(code -b "$CJ" -d nuevo_usuario=x -d nueva_contrasena=Contrasena12345 "$BASE/procesar_registro.php")"

echo "== Lista de usuarios y acciones"
ID=$(curl -s -b "$CJ" "$BASE/lista_usuarios.php" | grep -B2 ">$U<" | grep -o '<td>[0-9]*</td>' | head -1 | tr -dc '0-9')
[ -n "$ID" ] && ok "usuario nuevo en la lista (id $ID)" || bad "no aparece en la lista"
T=$(token "$CJ" lista_usuarios.php)
check "accion por GET no hace nada" 302 "$(code -b "$CJ" "$BASE/procesar_accion_usuario.php?id=$ID&accion=eliminar")"
curl -s -b "$CJ" "$BASE/lista_usuarios.php" | grep -q ">$U<" && ok "GET no elimino al usuario" || bad "GET elimino al usuario"
check "accion sin CSRF" 403 "$(code -b "$CJ" -d id=$ID -d accion=eliminar "$BASE/procesar_accion_usuario.php")"
curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d id=$ID -d accion=deshabilitar "$BASE/procesar_accion_usuario.php"
curl -s -b "$CJ" -c "$CJ" "$BASE/lista_usuarios.php" | grep -q "Usuario deshabilitado" && ok "deshabilitar" || bad "deshabilitar"
T3=$(token "$(mktemp)" login.php); CJ3="$(mktemp)"; T3=$(token "$CJ3" login.php)
curl -s -b "$CJ3" -c "$CJ3" -o /dev/null -d "csrf=$T3" -d "usuario=$U" -d contrasena=Contrasena12345 "$BASE/procesar_login.php"
curl -s -b "$CJ3" "$BASE/login.php" | grep -q "inhabilitada" && ok "usuario inactivo no entra" || bad "usuario inactivo entro"
T=$(token "$CJ" lista_usuarios.php)
curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d id=1 -d accion=nada "$BASE/procesar_accion_usuario.php"
curl -s -b "$CJ" -c "$CJ" "$BASE/lista_usuarios.php" | grep -q "Acción no válida" && ok "accion desconocida rechazada" || bad "accion desconocida"
T=$(token "$CJ" lista_usuarios.php)
curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d "id=1 OR 1=1" -d accion=eliminar "$BASE/procesar_accion_usuario.php"
curl -s -b "$CJ" -c "$CJ" "$BASE/lista_usuarios.php" | grep -q "ID del usuario" && ok "id no numerico rechazado (SQLi)" || bad "id no numerico"
T=$(token "$CJ" lista_usuarios.php)
curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d id=$ID -d accion=eliminar "$BASE/procesar_accion_usuario.php"
curl -s -b "$CJ" "$BASE/lista_usuarios.php" | grep -q ">$U<" && bad "no se elimino" || ok "eliminar por POST+CSRF"
MI=$(curl -s -b "$CJ" "$BASE/lista_usuarios.php" | grep -B2 ">admin_dev<" | grep -o '<td>[0-9]*</td>' | head -1 | tr -dc '0-9'); T=$(token "$CJ" lista_usuarios.php)
curl -s -b "$CJ" -c "$CJ" -o /dev/null -d "csrf=$T" -d id=$MI -d accion=eliminar "$BASE/procesar_accion_usuario.php"
curl -s -b "$CJ" "$BASE/lista_usuarios.php" | grep -q "propio usuario" && ok "no puede eliminarse a si mismo" || bad "auto-eliminacion"

echo "== Contrato: validaciones"
T=$(token "$CJ" bienvenido.php)
r=$(curl -s -b "$CJ" -o "$CH" -w '%{http_code}' -F "csrf=$T" -F nombre=Ana "$BASE/procesar_bienvenido.php"); check "contrato incompleto" 422 "$r"
grep -q "Falta" "$CH" && ok "lista los campos faltantes" || bad "mensajes de validacion"
check "contrato sin CSRF" 403 "$(code -b "$CJ" -F nombre=Ana "$BASE/procesar_bienvenido.php")"

echo "== Logout"
check "logout redirige" 302 "$(code -b "$CJ" -c "$CJ" "$BASE/logout.php")"
check "tras logout, dashboard pide login" 302 "$(code -b "$CJ" "$BASE/dashboard.php")"

echo "== Limite de intentos"
CJ4="$(mktemp)"; T4=$(token "$CJ4" login.php)
for i in 1 2 3 4 5 6; do curl -s -b "$CJ4" -c "$CJ4" -o /dev/null -d "csrf=$T4" -d usuario=nadie_rl -d contrasena=x "$BASE/procesar_login.php"; done
curl -s -b "$CJ4" -c "$CJ4" -o /dev/null -d "csrf=$T4" -d usuario=nadie_rl -d contrasena=x "$BASE/procesar_login.php"
curl -s -b "$CJ4" "$BASE/login.php" | grep -q "Demasiados intentos" && ok "bloqueo tras 5 fallos" || bad "sin bloqueo"

limpiar_rl
rm -f "$CJ" "$CJ2" "$CJ3" "$CJ4" "$CH"
[ $fail -eq 0 ] && echo "TODO OK" || echo "HAY FALLOS"; exit $fail
